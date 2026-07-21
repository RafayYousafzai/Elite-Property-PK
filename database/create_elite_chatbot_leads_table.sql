-- Create table for Elite Property PK AI Chatbot Leads
CREATE TABLE IF NOT EXISTS elite_chatbot_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    budget_range TEXT,
    purpose TEXT,
    looking_for TEXT,
    is_complete BOOLEAN DEFAULT false
);

-- Index session_id for fast upsert lookups
CREATE INDEX IF NOT EXISTS idx_elite_chatbot_leads_session_id ON elite_chatbot_leads(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE elite_chatbot_leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert and update via REST
CREATE POLICY "Allow public insert to elite_chatbot_leads" ON elite_chatbot_leads
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public update to elite_chatbot_leads" ON elite_chatbot_leads
    FOR UPDATE
    USING (true);

-- Allow authenticated users (Admin) to view and manage chatbot leads
CREATE POLICY "Allow authenticated read to elite_chatbot_leads" ON elite_chatbot_leads
    FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete to elite_chatbot_leads" ON elite_chatbot_leads
    FOR DELETE
    USING (auth.role() = 'authenticated');
