-- Migration: Update property_type constraint to allow all property types
-- This removes the restrictive check constraint and adds a new one that allows all property types from the form

-- Step 1: Drop the existing constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_property_type_check;

-- Step 2: Add new constraint with all allowed property types
ALTER TABLE public.properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (
  property_type IN (
    -- Home types
    'house',
    'flat',
    'upper portion',
    'lower portion',
    'farm house',
    'room',
    'penthouse',
    -- Plot types
    'residential plot',
    'commercial plot',
    'agricultural land',
    'industrial land',
    'plot file',
    'plot form',
    -- Commercial types
    'office',
    'shop',
    'warehouse',
    'factory',
    'building',
    'other',
    -- Legacy support (in case old data exists)
    'apartment',
    'plot'
  )
);

-- Verify the constraint was added successfully
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'properties_property_type_check';
