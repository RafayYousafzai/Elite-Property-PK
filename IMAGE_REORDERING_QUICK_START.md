# Quick Start - Image Reordering Feature

## What's New? 🎉

You can now **drag and drop to reorder property images** in the admin panel. The first image is automatically the cover/featured image!

## Setup (One-Time)

### 1. Run Database Migration

Open your Supabase SQL Editor and run:

```sql
-- File: database/add_featured_image_index.sql

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

COMMENT ON COLUMN properties.featured_image_index IS 'Index of the featured/cover image in the images JSONB array. Defaults to 0 (first image).';

ALTER TABLE properties
ADD CONSTRAINT featured_image_index_non_negative
CHECK (featured_image_index >= 0);
```

### 2. That's It!

The code changes are already in place. Dependencies have been installed.

## How to Use

### Creating a New Property

1. Go to Admin → Properties → Create New
2. Upload multiple images as usual
3. **Notice**: The first image shows a gold "Cover" badge with a star
4. **To reorder**: Hover over any image and drag it using the handle (≡ icon)
5. **Result**: Whatever image is first becomes the cover automatically
6. Save your property as normal

### Editing an Existing Property

1. Go to Admin → Properties → Edit
2. Existing images load in their current order
3. Drag to reorder as needed
4. First image is always the cover
5. Save changes

## Visual Indicators

- 🌟 **Gold "Cover" Badge**: Shows on the first image
- ≡ **Drag Handle**: Appears on hover (top-right corner)
- 🗑️ **Remove Button**: Appears on hover (bottom-right corner)
- 💬 **Helper Text**: "First image is the cover photo. Drag to reorder."

## Testing Steps

1. **Test Upload**
   - Upload 4-5 images
   - Verify first image shows "Cover" badge
2. **Test Reordering**
   - Drag the last image to the first position
   - Verify "Cover" badge moves to it
   - Drag it back
3. **Test Removal**
   - Remove the first image
   - Verify second image now shows "Cover" badge
4. **Test Save**

   - Reorder images
   - Save property
   - Refresh page or re-open editor
   - Verify images are in the new order

5. **Test Edit**
   - Open an existing property
   - Verify images load correctly
   - Reorder and save
   - Verify changes persist

## What Was Changed

### Files Modified

✅ `src/components/Admin/PropertyForm.tsx` - Added drag-and-drop
✅ `src/types/property.ts` - Added featured_image_index field
✅ `src/app/admin/properties/actions.ts` - Added to interface
✅ `src/app/admin/properties/create/page.tsx` - Sets featured_image_index: 0
✅ `src/app/admin/properties/edit/[id]/page.tsx` - Sets featured_image_index: 0

### Files Created

✅ `database/add_featured_image_index.sql` - Database migration
✅ `IMAGE_REORDERING_FEATURE.md` - Full documentation
✅ `IMAGE_REORDERING_QUICK_START.md` - This file

### Packages Installed

✅ `@dnd-kit/core` - Drag-and-drop core
✅ `@dnd-kit/sortable` - Sortable utilities
✅ `@dnd-kit/utilities` - Helper functions

## Need Help?

### Images Not Dragging?

- Make sure you're hovering over the image to see the drag handle
- Try clicking and holding on the handle icon (≡)
- Check browser console for errors

### Cover Badge Not Showing?

- The badge only shows on the first image
- If you don't see any badge, try refreshing the page

### Database Errors?

- Make sure you ran the SQL migration in Supabase
- Check if the `featured_image_index` column exists:
  ```sql
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'properties'
  AND column_name = 'featured_image_index';
  ```

## Technical Details

### How It Works

1. Images are stored in a JSONB array in the database
2. `featured_image_index` column tracks which image is the cover (always 0)
3. Frontend uses @dnd-kit for accessible drag-and-drop
4. When you reorder, both the preview and data arrays are updated
5. First image in array = cover image (automatic)

### Why First Image = Cover?

- Simple and intuitive for users
- No extra clicks or selections needed
- Visual feedback with the "Cover" badge
- Drag to reorder is a familiar pattern
- Can be extended later if needed

## Next Steps

1. Run the SQL migration
2. Test creating a property with multiple images
3. Test dragging to reorder
4. Test editing an existing property
5. Verify everything saves correctly

Enjoy your new drag-and-drop image management! 🚀
