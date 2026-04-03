-- Add missing columns to the existing expenses table
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS transaction_id TEXT,
ADD COLUMN IF NOT EXISTS receipt_image TEXT,
ADD COLUMN IF NOT EXISTS receipt_public_id TEXT,
ADD COLUMN IF NOT EXISTS confidence FLOAT,
ADD COLUMN IF NOT EXISTS note TEXT,
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
