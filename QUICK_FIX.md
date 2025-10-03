# Quick Fix - Database Constraint Update

## 🚀 Quick Start (3 Steps)

### 1️⃣ Run This SQL in Supabase Dashboard

```sql
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_property_type_check;

ALTER TABLE public.properties ADD CONSTRAINT properties_property_type_check
CHECK (property_type IN (
  'house', 'flat', 'upper portion', 'lower portion', 'farm house', 'room', 'penthouse',
  'residential plot', 'commercial plot', 'agricultural land', 'industrial land', 'plot file', 'plot form',
  'office', 'shop', 'warehouse', 'factory', 'building', 'other',
  'apartment', 'plot'
));
```

### 2️⃣ Verify It Worked

```sql
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'properties_property_type_check';
```

### 3️⃣ Test Creating a Property

- Go to your admin panel
- Create a property with any type (Flat, Office, etc.)
- Check browser console for "Sending property data:"
- Verify it saves successfully

## ✅ What Was Fixed

| File              | Changes                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| `actions.ts`      | Changed `property_type` to accept any string + added null support           |
| `create/page.tsx` | Added beds/baths mapping + uncommented createProperty + added null handling |
| Database          | Updated constraint to allow all 22 property types                           |

## 🐛 If You Still Get Errors

Check the browser console log for the exact `property_type` value being sent. It should be lowercase (e.g., `"flat"`, not `"Flat"`).

## 📝 Full Details

See `DATABASE_UPDATE_GUIDE.md` for complete documentation.
