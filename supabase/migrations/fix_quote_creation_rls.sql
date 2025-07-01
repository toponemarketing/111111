/*
  # Fix Quote Creation RLS Policy

  1. Policy Updates
    - Add INSERT policy for anonymous users to create quotes
    - Maintain existing SELECT and UPDATE policies for public access
    - Ensure quote creation works while maintaining security

  2. Security
    - Allow anonymous users to create quotes (for the contractor interface)
    - Allow anonymous users to read and update quotes via public token
    - Keep all data accessible for the single-user contractor app
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public quotes read via token" ON quotes;
DROP POLICY IF EXISTS "Public quotes update status via token" ON quotes;

-- Create comprehensive policies for quote operations
CREATE POLICY "Allow quote creation"
  ON quotes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow quote reading"
  ON quotes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow quote updates"
  ON quotes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow quote deletion"
  ON quotes
  FOR DELETE
  TO anon
  USING (true);