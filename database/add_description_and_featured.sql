-- Add description and featured fields to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing records to have a sample description
UPDATE properties 
SET description = 'A beautiful property with modern amenities and stunning views. This property offers the perfect blend of comfort and luxury.'
WHERE description IS NULL;

-- Create an index on is_featured for better performance
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);