-- Create Receipts Table
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    public_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, error
    amount NUMERIC,
    currency TEXT DEFAULT 'INR',
    merchant TEXT,
    date DATE,
    category TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    ocr_text TEXT,
    confidence TEXT, -- high, medium, low
    note TEXT,
    is_converted BOOLEAN DEFAULT FALSE, -- whether it has been added to transactions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own receipts" ON receipts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own receipts" ON receipts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts" ON receipts
    FOR UPDATE USING (auth.uid() = user_id);

-- Only owners can delete
CREATE POLICY "Users can delete their own receipts" ON receipts
    FOR DELETE USING (auth.uid() = user_id);

-- Real-time subscription (Supabase specific)
-- Ensure this table is added to the publication for real-time updates
-- ALTER PUBLICATION supabase_realtime ADD TABLE receipts;
