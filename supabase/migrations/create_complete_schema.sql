/*
  # Complete ServicePro Database Schema

  1. New Tables
    - `customers` - Customer information and contact details
    - `jobs` - Service jobs with scheduling and status tracking
    - `quotes` - Price quotes for potential work
    - `invoices` - Billing and payment tracking
    - `appointments` - Calendar scheduling system

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Features
    - UUID primary keys for all tables
    - Timestamps for audit trails
    - Status tracking for jobs, quotes, and invoices
    - Foreign key relationships between related entities
*/

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  status text DEFAULT 'Active' CHECK (status IN ('Active', 'VIP', 'Inactive')),
  total_jobs integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0.00,
  last_job_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  job_number text UNIQUE NOT NULL,
  service text NOT NULL,
  description text,
  status text DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Quote Sent')),
  priority text DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  scheduled_date date,
  scheduled_time time,
  address text,
  amount decimal(10,2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  quote_number text UNIQUE NOT NULL,
  service text NOT NULL,
  description text,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Accepted', 'Rejected')),
  valid_until date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  service text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending', 'Paid', 'Overdue')),
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  title text NOT NULL,
  service text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  address text,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can manage their own customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs
CREATE POLICY "Users can manage their own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quotes
CREATE POLICY "Users can manage their own quotes"
  ON quotes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can manage their own invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can manage their own appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions to generate sequential numbers
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS text AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM jobs
  WHERE user_id = auth.uid();
  
  RETURN 'JOB-' || LPAD(next_num::text, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS text AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM quotes
  WHERE user_id = auth.uid();
  
  RETURN 'QUO-' || LPAD(next_num::text, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text AS $$
DECLARE
  next_num integer;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS integer)), 0) + 1
  INTO next_num
  FROM invoices
  WHERE user_id = auth.uid();
  
  RETURN 'INV-' || LPAD(next_num::text, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;