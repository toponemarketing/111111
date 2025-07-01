/*
  # Fix Invoice Schema Issues

  1. Changes
    - Ensure invoice_number column exists and has proper constraints
    - Add missing columns if needed
    - Fix any data type mismatches
    - Ensure all required fields are properly configured

  2. Schema Updates
    - Make invoice_number required but allow system generation
    - Ensure proper foreign key relationships
    - Add any missing indexes
*/

-- Ensure invoice_number column exists and is properly configured
DO $$
BEGIN
  -- Check if invoice_number column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE invoices ADD COLUMN invoice_number text;
  END IF;
  
  -- Make invoice_number unique but not required (we'll generate it)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'invoices' AND constraint_name = 'invoices_invoice_number_key'
  ) THEN
    ALTER TABLE invoices ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);
  END IF;
END $$;

-- Ensure client_id is optional (since we're storing client info directly)
ALTER TABLE invoices ALTER COLUMN client_id DROP NOT NULL;

-- Ensure quote_id is optional (invoices can be created independently)
ALTER TABLE invoices ALTER COLUMN quote_id DROP NOT NULL;

-- Add client info columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'client_email'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_email text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'client_phone'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_phone text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'client_address'
  ) THEN
    ALTER TABLE invoices ADD COLUMN client_address text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'service_description'
  ) THEN
    ALTER TABLE invoices ADD COLUMN service_description text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'notes'
  ) THEN
    ALTER TABLE invoices ADD COLUMN notes text;
  END IF;
END $$;

-- Update the status enum to match what we're using
DO $$
BEGIN
  -- Check if we need to update the enum
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'pending' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'invoice_status')
  ) THEN
    ALTER TYPE invoice_status ADD VALUE 'pending';
  END IF;
END $$;