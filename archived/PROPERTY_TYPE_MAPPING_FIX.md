# Property Type Mapping Fix

## Problem
The database has a CHECK constraint that only allows these 4 property types:
- `'house'`
- `'apartment'`
- `'plot'`
- `'commercial plot'`

But the form was sending property types like:
- "House", "Flat", "Upper Portion", "Lower Portion", "Farm House", "Room", "Penthouse"
- "Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Land", "Plot File", "Plot Form"
- "Office", "Shop", "Warehouse", "Factory", "Building", "Other"

This caused the error: `new row for relation "properties" violates check constraint "properties_property_type_check"`

## Solution
Created a `mapPropertyType()` function that maps the detailed form property types to one of the 4 database-allowed values:

```typescript
const mapPropertyType = (
  propertyType: string,
  category: string
): "house" | "apartment" | "plot" | "commercial plot" => {
  const type = propertyType.toLowerCase();
  
  // Home category
  if (category === "Home") {
    if (type.includes("flat") || type.includes("apartment") || type.includes("penthouse")) {
      return "apartment";
    }
    return "house"; // House, Upper Portion, Lower Portion, Farm House, Room
  }
  
  // Plots category
  if (category === "Plots") {
    if (type.includes("commercial")) {
      return "commercial plot";
    }
    return "plot"; // Residential Plot, Agricultural Land, Industrial Land, Plot File, Plot Form
  }
  
  // Commercial category
  if (category === "Commercial") {
    return "commercial plot"; // Office, Shop, Warehouse, Factory, Building, Other
  }
  
  // Fallback
  return "plot";
};
```

## Mapping Logic

### Home Category → `house` or `apartment`
- **Apartment**: Flat, Apartment, Penthouse
- **House**: House, Upper Portion, Lower Portion, Farm House, Room

### Plots Category → `plot` or `commercial plot`
- **Commercial Plot**: Commercial Plot
- **Plot**: Residential Plot, Agricultural Land, Industrial Land, Plot File, Plot Form

### Commercial Category → `commercial plot`
- All commercial types (Office, Shop, Warehouse, Factory, Building, Other) → `commercial plot`

## Files Updated

1. **src/app/admin/properties/create/page.tsx**
   - Added `mapPropertyType()` function
   - Used it to convert `formData.propertyType` to database-allowed value
   - Added console logs for debugging

2. **src/app/admin/properties/edit/[id]/page.tsx**
   - Added same `mapPropertyType()` function
   - Used it in the update handler

## Testing
When you create a property now, check the browser console to see:
1. "Form Data:" - what the form collected
2. "Property Data being sent to DB:" - what's being sent to database
3. "Mapped property_type:" - the converted property type value

This should now match one of: `house`, `apartment`, `plot`, or `commercial plot`

## Alternative Solution (If Needed)
If you want to store the detailed property type, you have two options:

### Option 1: Update Database Constraint
Modify the database to allow all property types:
```sql
ALTER TABLE properties 
DROP CONSTRAINT properties_property_type_check;

ALTER TABLE properties 
ADD CONSTRAINT properties_property_type_check 
CHECK (property_type IN (
  'house', 'flat', 'upper portion', 'lower portion', 'farm house', 'room', 'penthouse',
  'residential plot', 'commercial plot', 'agricultural land', 'industrial land', 'plot file', 'plot form',
  'office', 'shop', 'warehouse', 'factory', 'building', 'other'
));
```

### Option 2: Add a New Column (Recommended)
Keep the simplified `property_type` for filtering/categorization, and add a new column for detailed type:
```sql
ALTER TABLE properties 
ADD COLUMN property_subtype TEXT NULL;
```

Then store:
- `property_type`: house/apartment/plot/commercial plot (for filtering)
- `property_subtype`: Flat/Upper Portion/Office/etc (for display)
