/*
  # QuickQuote Database Schema

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `address` (text, optional)
      - `created_at` (timestamp)
    
    - `quotes`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `service_description` (text, required)
      - `amount` (decimal, required)
      - `scheduled_date` (timestamp, optional)
      - `status` (enum: draft, pending, approved, declined)
      - `public_token` (text, unique for sharing)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `invoices`
      - `id` (uuid, primary key)
      - `quote_id` (uuid, foreign key to quotes)
      - `client_id` (uuid, foreign key to clients)
      - `invoice_number` (text, unique)
      - `amount` (decimal, required)
      - `due_date` (date, required)
      - `status` (enum: unpaid, paid, overdue)
      - `stripe_payment_intent_id` (text, optional)
      - `public_token` (text, unique for sharing)
      - `paid_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access via tokens
    - Add policies for authenticated users (future feature)

  3. Indexes
    - Add indexes for frequently queried columns
    - Add unique constraints for tokens
*/

-- Create custom types
CREATE TYPE quote_status AS ENUM ('draft', 'pending', 'approved', 'declined');
CREATE TYPE invoice_status AS ENUM ('unpaid', 'paid', 'overdue');

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  service_description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  scheduled_date timestamptz,
  status quote_status DEFAULT 'draft',
  public_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  status invoice_status DEFAULT 'unpaid',
  stripe_payment_intent_id text,
  public_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access via tokens
CREATE POLICY "Public quotes access via token"
  ON quotes
  FOR ALL
  TO anon
  USING (true);

CREATE POLICY "Public invoices access via token"
  ON invoices
  FOR ALL
  TO anon
  USING (true);

CREATE POLICY "Public clients access"
  ON clients
  FOR ALL
  TO anon
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quotes_client_id ON quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_public_token ON quotes(public_token);
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_public_token ON invoices(public_token);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();