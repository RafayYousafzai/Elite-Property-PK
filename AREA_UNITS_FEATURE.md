# Area Units Feature Addition

## Overview

Added support for multiple area measurement units (Square Feet, Square Yards, Marla, and Kanal) to the property management system.

## Changes Made

### 1. Database Schema Update

**File:** `database/add_area_units.sql`

Added new columns to the `properties` table:

- `area_sqft` - Square Feet (INTEGER)
- `area_sqyards` - Square Yards (INTEGER)
- `area_marla` - Marla (DECIMAL 10,2)
- `area_kanal` - Kanal (DECIMAL 10,2)

**Migration Note:** The existing `area` field is kept for backward compatibility. New data should populate `area_sqft` as well.

**To apply the migration:**

```bash
# Run this SQL in your Supabase SQL Editor
psql -h <your-supabase-db-host> -U postgres -d postgres -f database/add_area_units.sql
```

Or manually execute the SQL in the Supabase Dashboard → SQL Editor.

### 2. TypeScript Interfaces Updated

#### PropertyFormData Interface

**File:** `src/components/Admin/PropertyForm.tsx`

Added fields:

```typescript
area_sqft?: number;
area_sqyards?: number;
area_marla?: number;
area_kanal?: number;
```

#### PropertyData Interface

**File:** `src/app/admin/properties/actions.ts`

Added the same fields to the server action interface.

### 3. Property Form UI

**File:** `src/components/Admin/PropertyForm.tsx`

Added a new section "Additional Area Units" with:

- Square Yards input (decimal support)
- Marla input (decimal support)
- Kanal input (decimal support)
- Conversion reference tooltip showing:
  - 1 Kanal = 20 Marla = 5,445 sq ft
  - 1 Marla = 272.25 sq ft = 30.25 sq yards

The primary "Area (sq ft)" field remains required, while the additional units are optional.

### 4. Create Property Page

**File:** `src/app/admin/properties/create/page.tsx`

Updated to include all area unit fields when submitting property data.

### 5. Edit Property Page

**File:** `src/app/admin/properties/edit/[id]/page.tsx`

Updated to:

- Load area unit values from database
- Include them in the form submission

## Area Unit Conversion Reference

For reference, here are the standard conversions used in Pakistan/India real estate:

| Unit          | Conversion to Square Feet        |
| ------------- | -------------------------------- |
| 1 Square Yard | 9 sq ft                          |
| 1 Marla       | 272.25 sq ft (or 30.25 sq yards) |
| 1 Kanal       | 5,445 sq ft (or 20 Marla)        |

## Usage

### Creating a Property

1. Navigate to `/admin/properties/create`
2. Fill in the required "Area (sq ft)" field
3. Optionally fill in Square Yards, Marla, or Kanal
4. The conversion tooltip helps with calculations
5. Submit the form

### Editing a Property

1. Navigate to `/admin/properties`
2. Click "Edit" on any property
3. The form will load existing area values
4. Update any area fields as needed
5. Save changes

## UI Features

✅ **Primary area field** - Required (Square Feet)  
✅ **Optional area units** - Square Yards, Marla, Kanal  
✅ **Decimal support** - For precise measurements  
✅ **Conversion tooltip** - Quick reference guide  
✅ **Clean layout** - 3-column grid on desktop, stacked on mobile  
✅ **Dark mode support** - All inputs styled for both themes

## Database Considerations

### Why keep the `area` field?

- **Backward compatibility** - Existing queries won't break
- **Default display** - Can be used as primary display value
- **Migration safety** - Existing data remains intact

### Optional Fields

All new area unit fields are optional (nullable), allowing:

- Partial data entry
- Gradual adoption
- No breaking changes to existing forms

## Testing Checklist

- [ ] Run the database migration
- [ ] Create a new property with all area units filled
- [ ] Create a property with only required area (sq ft)
- [ ] Edit an existing property and add area units
- [ ] Verify data saves correctly in Supabase
- [ ] Check mobile responsive layout
- [ ] Test dark mode appearance
- [ ] Verify conversion tooltip displays correctly

## Future Enhancements

Potential improvements for future versions:

1. **Auto-calculation** - Calculate other units when one is entered
2. **Unit switcher** - Allow displaying property areas in preferred units
3. **Area filter** - Filter properties by area range in any unit
4. **Display preference** - User setting for preferred area unit
5. **More units** - Add Acres, Hectares if needed

## Notes

- The primary `area` field remains required for backward compatibility
- All additional units are optional and can be left empty
- The conversion tooltip is informational only - no automatic conversion is performed
- Values are stored exactly as entered (no automatic conversions between units)
