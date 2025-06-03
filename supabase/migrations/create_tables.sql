/*
  # Initial Schema Setup for Rental Property Management

  1. New Tables
    - `profiles` - User profiles for landlords and tenants
    - `properties` - Properties owned by landlords
    - `units` - Individual rental units within properties
    - `leases` - Lease agreements between landlords and tenants
    - `payments` - Rent payments made by tenants
    - `payment_methods` - Payment methods configured by landlords
    - `maintenance_requests` - Maintenance requests submitted by tenants
    - `maintenance_images` - Images attached to maintenance requests
    - `maintenance_comments` - Comments on maintenance requests
    - `notifications` - System notifications for users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on role
*/

-- Profiles table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('landlord', 'tenant')),
  avatar_url TEXT
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- Units table
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms NUMERIC NOT NULL,
  square_feet INTEGER,
  rent_amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('vacant', 'occupied', 'maintenance')) DEFAULT 'vacant',
  description TEXT,
  image_url TEXT,
  UNIQUE (property_id, unit_number)
);

-- Leases table
CREATE TABLE IF NOT EXISTS leases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  rent_amount NUMERIC NOT NULL,
  security_deposit NUMERIC NOT NULL,
  rent_due_day INTEGER NOT NULL CHECK (rent_due_day BETWEEN 1 AND 28),
  late_fee_amount NUMERIC,
  late_fee_days INTEGER,
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'terminated')) DEFAULT 'active',
  document_url TEXT
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lease_id UUID NOT NULL REFERENCES leases(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'paypal', 'venmo', 'cash', 'other')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  transaction_id TEXT,
  notes TEXT,
  late_fee NUMERIC
);

-- Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  landlord_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('stripe', 'paypal', 'venmo', 'bank', 'cash')),
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  account_email TEXT,
  account_username TEXT,
  account_details TEXT,
  instructions TEXT,
  UNIQUE (landlord_id, method_type)
);

-- Maintenance Requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Maintenance Images table
CREATE TABLE IF NOT EXISTS maintenance_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT
);

-- Maintenance Comments table
CREATE TABLE IF NOT EXISTS maintenance_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  maintenance_request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'maintenance', 'lease', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Landlords can view tenant profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT landlord_id FROM properties p
      JOIN units u ON p.id = u.property_id
      JOIN leases l ON u.id = l.unit_id
      WHERE l.tenant_id = profiles.id
    )
  );

-- Properties Policies
CREATE POLICY "Landlords can CRUD their own properties"
  ON properties FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view properties they rent"
  ON properties FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM units u
      JOIN leases l ON u.id = l.unit_id
      WHERE u.property_id = properties.id
      AND l.tenant_id = auth.uid()
      AND l.status = 'active'
    )
  );

-- Units Policies
CREATE POLICY "Landlords can CRUD units in their properties"
  ON units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = units.property_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their rented units"
  ON units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leases
      WHERE leases.unit_id = units.id
      AND leases.tenant_id = auth.uid()
      AND leases.status = 'active'
    )
  );

-- Leases Policies
CREATE POLICY "Landlords can CRUD leases for their properties"
  ON leases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM units
      JOIN properties ON units.property_id = properties.id
      WHERE units.id = leases.unit_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own leases"
  ON leases FOR SELECT
  USING (auth.uid() = tenant_id);

-- Payments Policies
CREATE POLICY "Landlords can view and manage payments for their properties"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM leases
      JOIN units ON leases.unit_id = units.id
      JOIN properties ON units.property_id = properties.id
      WHERE leases.id = payments.lease_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own payments"
  ON payments FOR SELECT
  USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can create their own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = tenant_id);

-- Payment Methods Policies
CREATE POLICY "Landlords can manage their payment methods"
  ON payment_methods FOR ALL
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view landlord payment methods"
  ON payment_methods FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leases
      JOIN units ON leases.unit_id = units.id
      JOIN properties ON units.property_id = properties.id
      WHERE leases.tenant_id = auth.uid()
      AND properties.landlord_id = payment_methods.landlord_id
      AND leases.status = 'active'
    )
  );

-- Maintenance Requests Policies
CREATE POLICY "Landlords can view and manage maintenance requests for their properties"
  ON maintenance_requests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM units
      JOIN properties ON units.property_id = properties.id
      WHERE units.id = maintenance_requests.unit_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own maintenance requests"
  ON maintenance_requests FOR SELECT
  USING (auth.uid() = tenant_id);

CREATE POLICY "Tenants can create maintenance requests for their units"
  ON maintenance_requests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM leases
      WHERE leases.unit_id = maintenance_requests.unit_id
      AND leases.tenant_id = auth.uid()
      AND leases.status = 'active'
    )
  );

-- Maintenance Images Policies
CREATE POLICY "Landlords can view and manage maintenance images for their properties"
  ON maintenance_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests
      JOIN units ON maintenance_requests.unit_id = units.id
      JOIN properties ON units.property_id = properties.id
      WHERE maintenance_requests.id = maintenance_images.maintenance_request_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view maintenance images for their requests"
  ON maintenance_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests
      WHERE maintenance_requests.id = maintenance_images.maintenance_request_id
      AND maintenance_requests.tenant_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can create maintenance images for their requests"
  ON maintenance_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM maintenance_requests
      WHERE maintenance_requests.id = maintenance_images.maintenance_request_id
      AND maintenance_requests.tenant_id = auth.uid()
    )
  );

-- Maintenance Comments Policies
CREATE POLICY "Landlords can view and manage maintenance comments for their properties"
  ON maintenance_comments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests
      JOIN units ON maintenance_requests.unit_id = units.id
      JOIN properties ON units.property_id = properties.id
      WHERE maintenance_requests.id = maintenance_comments.maintenance_request_id
      AND properties.landlord_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view maintenance comments for their requests"
  ON maintenance_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM maintenance_requests
      WHERE maintenance_requests.id = maintenance_comments.maintenance_request_id
      AND maintenance_requests.tenant_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own maintenance comments"
  ON maintenance_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_properties_modtime
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_units_modtime
BEFORE UPDATE ON units
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_leases_modtime
BEFORE UPDATE ON leases
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payments_modtime
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_payment_methods_modtime
BEFORE UPDATE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_maintenance_requests_modtime
BEFORE UPDATE ON maintenance_requests
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
