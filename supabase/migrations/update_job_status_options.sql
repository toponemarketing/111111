/*
  # Update Job Status Options

  1. Changes
    - Add "Approved" as a valid job status option
    - Ensure all status transitions work properly
    - Update the CHECK constraint to include all valid statuses

  2. Security
    - Maintain existing RLS policies
    - No changes to permissions
*/

-- Update the jobs table to include "Approved" as a valid status
DO $$
BEGIN
  -- Drop the existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'jobs_status_check' 
    AND table_name = 'jobs'
  ) THEN
    ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
  END IF;
  
  -- Add the updated constraint with all valid statuses including "Approved"
  ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
    CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Quote Sent', 'Approved'));
END $$;
