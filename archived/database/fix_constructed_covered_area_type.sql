-- Fix constructed_covered_area column type
-- This migration changes the column from TEXT to INTEGER

-- First, check if the column exists and drop it if it's TEXT
DO $$ 
BEGIN
  -- Try to alter the column type if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'constructed_covered_area'
  ) THEN
    -- Convert existing text values to integers, then change the column type
    -- First, update any non-numeric or NULL values to 0
    UPDATE properties 
    SET constructed_covered_area = '0' 
    WHERE constructed_covered_area IS NULL 
       OR constructed_covered_area !~ '^\d+$';
    
    -- Now alter the column type
    ALTER TABLE properties 
    ALTER COLUMN constructed_covered_area TYPE INTEGER 
    USING constructed_covered_area::INTEGER;
  ELSE
    -- Column doesn't exist, add it as INTEGER
    ALTER TABLE properties 
    ADD COLUMN constructed_covered_area INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add a comment to document the column
COMMENT ON COLUMN properties.constructed_covered_area IS 'The constructed/covered area of the property in square units';
