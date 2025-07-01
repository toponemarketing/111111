/*
  # Fix Base64URL Encoding Issue

  1. Changes
    - Remove base64url encoding from public_token generation
    - Use simple random text generation instead
    - Update existing tokens to use compatible format

  2. Security
    - Maintain token uniqueness
    - Keep secure random generation
    - Preserve existing functionality
*/

-- Update quotes table to use simple random text for public_token
ALTER TABLE quotes ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(32), 'hex');

-- Update invoices table to use simple random text for public_token  
ALTER TABLE invoices ALTER COLUMN public_token SET DEFAULT encode(gen_random_bytes(32), 'hex');

-- Update existing NULL tokens with hex encoding
UPDATE quotes SET public_token = encode(gen_random_bytes(32), 'hex') WHERE public_token IS NULL;
UPDATE invoices SET public_token = encode(gen_random_bytes(32), 'hex') WHERE public_token IS NULL;