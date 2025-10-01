-- Add area unit fields to properties table
-- Run this migration to add the new fields

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS area_sqft INTEGER,
ADD COLUMN IF NOT EXISTS area_sqyards INTEGER,
ADD COLUMN IF NOT EXISTS area_marla DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS area_kanal DECIMAL(10,2);

-- Migrate existing area data to area_sqft
UPDATE properties 
SET area_sqft = area 
WHERE area_sqft IS NULL AND area IS NOT NULL;

-- Optional: Make area_sqft the primary area field going forward
-- You can keep the old 'area' column for backward compatibility
-- or drop it after migration if you want

COMMENT ON COLUMN properties.area_sqft IS 'Property area in square feet';
COMMENT ON COLUMN properties.area_sqyards IS 'Property area in square yards';
COMMENT ON COLUMN properties.area_marla IS 'Property area in marla (1 marla = 272.25 sq ft)';
COMMENT ON COLUMN properties.area_kanal IS 'Property area in kanal (1 kanal = 20 marla = 5445 sq ft)';
