/*
  # Add Client Fields to Quotes and Invoices Tables

  1. Schema Updates
    - Add client fields directly to `quotes` table:
      - `client_name` (text, required)
      - `client_email` (text, required) 
      - `client_phone` (text, optional)
      - `client_address` (text, optional)
      - `notes` (text, optional)
    
    - Add client fields directly to `invoices` table:
      - `client_name` (text, required)
      - `client_email` (text, required)
      - `client_phone` (text, optional) 
      - `client_address` (text, optional)
      - `notes` (text, optional)
      - `service_description` (text, required)
      - `invoice_number` (text, auto-generated)

  2. Data Migration
    - Preserve existing data if any exists
    - Update constraints and indexes

  3. Notes
    - This approach stores client data directly in quotes/invoices for simplicity
    - Maintains the original normalized design as backup via client_id relationships
    - Frontend can work immediately without complex joins
*/

-- Add client fields to quotes table
DO $$
BEGIN
  -- Add client_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_name text;
  END IF;

  -- Add client_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_email'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_email text;
  END IF;

  -- Add client_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_phone'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_phone text;
  END IF;

  -- Add client_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_address'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_address text;
  END IF;

  -- Add notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'notes'
  ) THEN
    ALTER TABLE quotes ADD COLUMN notes text;
  END IF;
END $$;

-- Add client fields to invoices table
DO $$
BEGIN
  -- Add client_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_name text;
  END IF;

  -- Add client_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_email'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_email text;
  END IF;

  -- Add client_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_phone'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_phone text;
  END IF;

  -- Add client_address column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_address'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_address text;
  END IF;

  -- Add notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'notes'
  ) THEN
    ALTER TABLE invoices ADD COLUMN notes text;
  END IF;

  -- Add service_description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'service_description'
  ) THEN
    ALTER TABLE invoices ADD COLUMN service_description text;
  END IF;
END $$;

-- Update invoice_number to be auto-generated if not already set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'invoice_number' AND column_default IS NOT NULL
  ) THEN
    -- Create a function to generate invoice numbers
    CREATE OR REPLACE FUNCTION generate_invoice_number()
    RETURNS text AS $func$
    BEGIN
      RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_number_seq')::text, 4, '0');
    END;
    $func$ LANGUAGE plpgsql;

    -- Create sequence for invoice numbers
    CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

    -- Update the column to have a default
    ALTER TABLE invoices ALTER COLUMN invoice_number SET DEFAULT generate_invoice_number();
  END IF;
END $$;

-- Make client_name and client_email required for quotes
DO $$
BEGIN
  -- Only add NOT NULL constraint if column exists and has no null values
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_name'
  ) AND NOT EXISTS (
    SELECT 1 FROM quotes WHERE client_name IS NULL
  ) THEN
    ALTER TABLE quotes ALTER COLUMN client_name SET NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_email'
  ) AND NOT EXISTS (
    SELECT 1 FROM quotes WHERE client_email IS NULL
  ) THEN
    ALTER TABLE quotes ALTER COLUMN client_email SET NOT NULL;
  END IF;
END $$;

-- Make client_name and client_email required for invoices
DO $$
BEGIN
  -- Only add NOT NULL constraint if column exists and has no null values
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_name'
  ) AND NOT EXISTS (
    SELECT 1 FROM invoices WHERE client_name IS NULL
  ) THEN
    ALTER TABLE invoices ALTER COLUMN client_name SET NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'client_email'
  ) AND NOT EXISTS (
    SELECT 1 FROM invoices WHERE client_email IS NULL
  ) THEN
    ALTER TABLE invoices ALTER COLUMN client_email SET NOT NULL;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON quotes(client_name);
CREATE INDEX IF NOT EXISTS idx_quotes_client_email ON quotes(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_client_name ON invoices(client_name);
CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);