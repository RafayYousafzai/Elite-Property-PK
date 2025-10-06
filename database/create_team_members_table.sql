-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image text NOT NULL,
  bio text NOT NULL,
  email text,
  phone text,
  linkedin text,
  twitter text,
  facebook text,
  instagram text,
  specialties text[] DEFAULT '{}',
  experience text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on display_order for efficient sorting
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON public.team_members(is_active);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active team members
CREATE POLICY "Allow public read access to active team members"
  ON public.team_members
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all team members
CREATE POLICY "Allow authenticated users to view all team members"
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert team members
CREATE POLICY "Allow authenticated users to insert team members"
  ON public.team_members
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update team members
CREATE POLICY "Allow authenticated users to update team members"
  ON public.team_members
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete team members
CREATE POLICY "Allow authenticated users to delete team members"
  ON public.team_members
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
