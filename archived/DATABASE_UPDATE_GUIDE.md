# Database Constraint Update Guide

## Overview
This guide explains how to update your database to accept all property types that your form supports.

## Problem
The current database constraint only allows 4 property types:
- `'house'`, `'apartment'`, `'plot'`, `'commercial plot'`

But your form needs to support 22 different property types across 3 categories.

## Solution
Update the database constraint to allow all property types.

---

## Step 1: Run the SQL Migration

### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `archived/database/update_property_type_constraint.sql`
4. Click **Run** to execute the migration

### Option B: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### Option C: Manual SQL Execution
Run this SQL in your database:

```sql
-- Drop the existing constraint
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_property_type_check;

-- Add new constraint with all allowed property types
ALTER TABLE public.properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (
  property_type IN (
    -- Home types
    'house', 'flat', 'upper portion', 'lower portion', 
    'farm house', 'room', 'penthouse',
    -- Plot types
    'residential plot', 'commercial plot', 'agricultural land', 
    'industrial land', 'plot file', 'plot form',
    -- Commercial types
    'office', 'shop', 'warehouse', 'factory', 'building', 'other',
    -- Legacy support
    'apartment', 'plot'
  )
);
```

---

## Step 2: Verify the Changes

After running the migration, verify it worked:

```sql
-- Check the constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'properties_property_type_check';
```

You should see all the property types listed in the constraint definition.

---

## Code Changes Made

### 1. Updated `src/app/admin/properties/actions.ts`
Changed `PropertyData` interface to accept any string for `property_type`:
```typescript
property_type: string; // Instead of union type
```

Also updated all optional fields to accept `null`:
- `photo_sphere?: string | null`
- `description?: string | null`
- `purpose?: string | null`
- etc.

### 2. Updated `src/app/admin/properties/create/page.tsx`
- Added `beds` and `baths` mapping from `bedrooms`/`bathrooms`
- Changed `property_type` to just use `.toLowerCase()` without type restriction
- Added proper null handling for all optional fields
- Uncommented the `createProperty()` call
- Added console.log for debugging

---

## Property Type Mappings

Your form now supports all these property types (case will be normalized to lowercase in database):

### Home Category (7 types)
- House → `house`
- Flat → `flat`
- Upper Portion → `upper portion`
- Lower Portion → `lower portion`
- Farm House → `farm house`
- Room → `room`
- Penthouse → `penthouse`

### Plots Category (6 types)
- Residential Plot → `residential plot`
- Commercial Plot → `commercial plot`
- Agricultural Land → `agricultural land`
- Industrial Land → `industrial land`
- Plot File → `plot file`
- Plot Form → `plot form`

### Commercial Category (6 types)
- Office → `office`
- Shop → `shop`
- Warehouse → `warehouse`
- Factory → `factory`
- Building → `building`
- Other → `other`

---

## Testing Checklist

After running the migration, test these scenarios:

- [ ] Create a property with type "House"
- [ ] Create a property with type "Flat"
- [ ] Create a property with type "Upper Portion"
- [ ] Create a property with type "Residential Plot"
- [ ] Create a property with type "Commercial Plot"
- [ ] Create a property with type "Office"
- [ ] Create a property with type "Shop"
- [ ] Create a property with beds and baths
- [ ] Create a property without beds and baths
- [ ] Create a property with installment options
- [ ] Edit an existing property
- [ ] Verify data is correctly stored in database

---

## Rollback (If Needed)

If you need to revert to the old constraint:

```sql
ALTER TABLE public.properties 
DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE public.properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (
  property_type IN ('house', 'apartment', 'plot', 'commercial plot')
);
```

---

## Next Steps

1. **Run the SQL migration** (Step 1 above)
2. **Test property creation** with different types
3. **Check browser console** for "Sending property data:" log to verify correct mapping
4. **Verify database** has correct property_type values (lowercase)

## Notes

- Property types are automatically converted to lowercase before saving
- All new fields properly handle `null` values
- The `beds` and `baths` fields are now correctly mapped from the form
- The `slug` is auto-generated in the backend using the property name
