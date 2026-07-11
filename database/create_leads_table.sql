-- Create leads table for ad campaign conversions
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    purpose TEXT NOT NULL,
    looking_for TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so campaign submissions go through directly)
CREATE POLICY "Allow public insert to leads" ON leads
    FOR INSERT 
    WITH CHECK (true);

-- Allow authenticated users to view leads
CREATE POLICY "Allow authenticated read to leads" ON leads
    FOR SELECT 
    USING (auth.role() = 'authenticated');
