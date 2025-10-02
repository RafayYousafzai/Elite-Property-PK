-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  rate TEXT NOT NULL,
  area INTEGER NOT NULL,
  beds INTEGER,
  baths INTEGER,
  photo_sphere TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'plot')),
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (admin access)
-- Allow authenticated users to read all properties
CREATE POLICY "Allow authenticated read access" ON properties
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert properties
CREATE POLICY "Allow authenticated insert access" ON properties
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update properties
CREATE POLICY "Allow authenticated update access" ON properties
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete properties
CREATE POLICY "Allow authenticated delete access" ON properties
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Insert some sample data
INSERT INTO properties (name, slug, location, rate, area, beds, baths, property_type, images) VALUES
  (
    'Serenity Height Villas',
    'serenity-height-villas',
    '15 S Aurora Ave, Miami',
    '570,000',
    1200,
    4,
    3,
    'house',
    '[
      {"src": "/images/properties/property1/property1.jpg"},
      {"src": "/images/properties/property1/image-2.jpg"},
      {"src": "/images/properties/property1/image-3.jpg"},
      {"src": "/images/properties/property1/image-4.jpg"}
    ]'::jsonb
  ),
  (
    'Mountain Retreat Villa',
    'mountain-retreat-villa',
    '18 S Aurora Ave, Miami',
    '575,000',
    1500,
    5,
    2,
    'house',
    '[
      {"src": "/images/properties/property2/property2.jpg"},
      {"src": "/images/featuredproperty/image-1.jpg"},
      {"src": "/images/featuredproperty/image-2.jpg"}
    ]'::jsonb
  ),
  (
    'Downtown Luxury Plot',
    'downtown-luxury-plot',
    '25 Main Street, Downtown',
    '250,000',
    5000,
    null,
    null,
    'plot',
    '[
      {"src": "/images/properties/property3/plot1.jpg"}
    ]'::jsonb
  );