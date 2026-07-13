-- 1. Create crm_users table in the public schema (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.crm_users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent'))
);

-- Enable RLS on crm_users
ALTER TABLE public.crm_users ENABLE ROW LEVEL SECURITY;

-- Policies for crm_users
CREATE POLICY "Allow authenticated read to crm_users" ON public.crm_users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin crud to crm_users" ON public.crm_users
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 2. Create function to automatically mirror auth.users into public.crm_users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.crm_users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Agent'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'agent')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function when a user signs up/is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Modify leads table to support CRM features
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'New',
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.crm_users(id) ON DELETE SET NULL;

-- Enable RLS on leads (if not already enabled)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Recreate leads policies to filter by role/assignment
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated read to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated delete of leads" ON public.leads;

CREATE POLICY "Allow public insert to leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read to leads" ON public.leads
    FOR SELECT USING (
        (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
        OR assigned_to = auth.uid()
    );

CREATE POLICY "Allow authenticated update to leads" ON public.leads
    FOR UPDATE USING (
        (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
        OR assigned_to = auth.uid()
    );

CREATE POLICY "Allow authenticated delete of leads" ON public.leads
    FOR DELETE USING (
        (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
    );

-- 4. Create lead_notes table
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.crm_users(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT NOT NULL,
    note TEXT NOT NULL
);

-- Enable RLS on lead_notes
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated select to lead_notes" ON public.lead_notes
    FOR SELECT USING (
        (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
        OR (SELECT assigned_to FROM public.leads WHERE id = lead_id) = auth.uid()
    );

CREATE POLICY "Allow authenticated insert to lead_notes" ON public.lead_notes
    FOR INSERT WITH CHECK (
        (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin'
        OR (SELECT assigned_to FROM public.leads WHERE id = lead_id) = auth.uid()
    );

-- 5. Create crm_notifications table
CREATE TABLE IF NOT EXISTS public.crm_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES public.crm_users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS on crm_notifications
ALTER TABLE public.crm_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own notifications" ON public.crm_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Allow users to update their own notifications" ON public.crm_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- 6. Create RPC function to allow admins to delete agents from auth.users
CREATE OR REPLACE FUNCTION public.delete_user_by_id(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Check if executing user has admin role
    IF (SELECT role FROM public.crm_users WHERE id = auth.uid()) = 'admin' THEN
        DELETE FROM auth.users WHERE id = user_uuid;
    ELSE
        RAISE EXCEPTION 'Only administrators can delete users.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Auto-confirm email addresses for newly registered agents programmatically
CREATE OR REPLACE FUNCTION public.auto_confirm_user_email()
RETURNS TRIGGER AS $$
BEGIN
    NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_confirm_email
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user_email();
