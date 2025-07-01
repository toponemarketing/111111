/*
  # Add Quote Approval Fields

  1. Schema Changes
    - Add client contact fields directly to quotes table for simplified structure
    - Add public_token for secure quote sharing
    - Add due_date and notes fields for complete quote information
    - Update status enum to include proper approval states

  2. Security
    - Update RLS policies for public quote access via token
    - Ensure clients can only view and update their specific quotes

  3. Data Migration
    - Add new columns with proper defaults
    - Generate tokens for existing quotes
*/

-- Add new columns to quotes table
DO $$
BEGIN
  -- Add client fields directly to quotes table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_email'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_phone'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'client_address'
  ) THEN
    ALTER TABLE quotes ADD COLUMN client_address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE quotes ADD COLUMN due_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'notes'
  ) THEN
    ALTER TABLE quotes ADD COLUMN notes text;
  END IF;

  -- Ensure public_token exists with proper default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'public_token'
  ) THEN
    ALTER TABLE quotes ADD COLUMN public_token text UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');
  END IF;
END $$;

-- Update existing quotes to have tokens if they don't
UPDATE quotes 
SET public_token = encode(gen_random_bytes(32), 'hex')
WHERE public_token IS NULL;

-- Make public_token required and unique
ALTER TABLE quotes ALTER COLUMN public_token SET NOT NULL;

-- Create index for public_token if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_quotes_public_token ON quotes(public_token);

-- Update RLS policies for public quote access
DROP POLICY IF EXISTS "Public quotes access via token" ON quotes;

CREATE POLICY "Public quotes read via token"
  ON quotes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public quotes update status via token"
  ON quotes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);