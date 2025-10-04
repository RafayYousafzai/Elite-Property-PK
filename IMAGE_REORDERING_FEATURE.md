# Image Reordering Feature - Documentation

## Overview

Added drag-and-drop image reordering functionality to the admin property form. The first image (index 0) is automatically set as the cover/featured image.

## What Was Implemented

### 1. Database Changes

- **File**: `database/add_featured_image_index.sql`
- Added `featured_image_index` column to properties table
- Default value: 0 (first image)
- Includes check constraint to ensure non-negative values
- Added comment explaining the column's purpose

**To apply**: Run this SQL file in your Supabase SQL editor

### 2. TypeScript Types Updated

- **File**: `src/types/property.ts`
- Added `featured_image_index?: number` to both `Property` and `DatabaseProperty` types
- This tracks which image in the array is the cover photo

### 3. Server Actions Updated

- **File**: `src/app/admin/properties/actions.ts`
- Added `featured_image_index?: number` to `PropertyData` interface
- Ensures the field is saved when creating/updating properties

### 4. Property Form (Main Changes)

- **File**: `src/components/Admin/PropertyForm.tsx`

#### New Dependencies Installed

```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### Key Components Added

**a) SortableImageItem Component**

- Displays each image with drag handle
- Shows "Cover" badge on first image (featured)
- Allows removal of images
- Supports drag-and-drop reordering

**b) Drag-and-Drop Context**

- Uses `@dnd-kit` for accessible, performant drag-and-drop
- Sensors: Pointer and Keyboard (for accessibility)
- Collision detection: closestCenter algorithm

**c) handleDragEnd Function**

- Reorders images when drag completes
- Updates both preview state and form data
- Maintains sync between visual order and data order

#### UI Enhancements

- **Star icon** indicates the cover photo (first image)
- **Grip handle** appears on hover for dragging
- **Helper text**: "First image is the cover photo. Drag to reorder."
- **Remove button** on each image (appears on hover)

### 5. Create & Edit Pages Updated

- **Files**:
  - `src/app/admin/properties/create/page.tsx`
  - `src/app/admin/properties/edit/[id]/page.tsx`
- Both now set `featured_image_index: 0` when submitting
- This ensures the first image is always tracked as the cover

## How It Works

### User Experience

1. **Upload Images**: User uploads multiple images as before
2. **View Grid**: Images display in a 2x4 grid (responsive)
3. **First Image Badge**: First image shows a gold "Cover" badge with star icon
4. **Reorder**: User can drag any image to reorder
5. **Automatic Cover**: Whatever image is first becomes the cover automatically
6. **Visual Feedback**:
   - Hover shows drag handle on top-right
   - Hover shows remove button on bottom-right
   - Dragging shows 50% opacity
   - Helper text reminds user about cover photo behavior

### Technical Flow

```
1. User drags image from position 2 to position 0
2. handleDragEnd fires with active and over indices
3. arrayMove reorders both imagePreviews and formData.images
4. React re-renders with new order
5. First image now shows "Cover" badge
6. On submit, featured_image_index: 0 is sent to backend
7. Database stores images array + featured_image_index: 0
```

## Benefits

### For Users

- ✅ **Intuitive**: Drag-and-drop is familiar to users
- ✅ **Visual**: Clear indication of which image is the cover
- ✅ **Simple**: No extra clicks or selections needed
- ✅ **Accessible**: Keyboard navigation support via @dnd-kit

### For Developers

- ✅ **Flexible**: Can easily change to support multiple featured images
- ✅ **Maintainable**: Clean separation of drag logic in SortableImageItem
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Library**: @dnd-kit is well-maintained, performant, and accessible

## Future Enhancements (Optional)

### Possible Additions

1. **Touch Support**: @dnd-kit supports touch, but could add mobile-specific UI
2. **Bulk Actions**: Select multiple images to delete
3. **Image Editor**: Crop/rotate before upload
4. **AI Auto-Select**: Use AI to suggest best cover photo
5. **Multiple Featured**: Allow marking multiple images as featured (not just first)

## Migration Guide

### For Existing Properties

```sql
-- Set all existing properties to use first image as cover
UPDATE properties
SET featured_image_index = 0
WHERE featured_image_index IS NULL;
```

### Testing Checklist

- [ ] Upload images - verify they appear
- [ ] Drag first image to last position - verify cover badge moves
- [ ] Drag last image to first position - verify it becomes cover
- [ ] Remove first image - verify second image becomes cover
- [ ] Create new property with reordered images - verify saves correctly
- [ ] Edit existing property - verify images load in correct order
- [ ] Keyboard navigation - verify drag works with keyboard
- [ ] Mobile - verify touch drag works (if needed)

## Code Examples

### How to Access Featured Image in Frontend

```typescript
// Get the featured/cover image URL
const property = {
  /* property data */
};
const coverImage = property.images[property.featured_image_index || 0];

// Display in a component
<img src={coverImage.src} alt="Property Cover" />;
```

### How to Change Featured Image Programmatically

```typescript
// If you want to allow users to click any image to set as cover
const handleSetAsCover = (imageIndex: number) => {
  // Reorder images array so selected image is first
  const newImages = [...formData.images];
  const [selectedImage] = newImages.splice(imageIndex, 1);
  newImages.unshift(selectedImage);

  setFormData((prev) => ({
    ...prev,
    images: newImages,
    featured_image_index: 0, // First image is always cover
  }));
};
```

## Dependencies

### New Packages

- `@dnd-kit/core`: ^6.3.1 - Core drag-and-drop functionality
- `@dnd-kit/sortable`: ^10.0.0 - Sortable list utilities
- `@dnd-kit/utilities`: ^3.2.2 - Helper utilities for transforms

### Why @dnd-kit?

- **Modern**: Built for React 18+
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Uses CSS transforms, not DOM manipulation
- **Flexible**: Highly customizable
- **TypeScript**: First-class TypeScript support
- **Well-maintained**: Active development, 11k+ stars on GitHub

## Troubleshooting

### Images Not Reordering

- Check console for errors
- Verify sensors are initialized
- Ensure unique IDs for each SortableImageItem

### Cover Badge Not Showing on First Image

- Verify `isFeatured={index === 0}` prop is passed
- Check if Chip component is imported
- Verify Star icon is imported

### Database Not Saving featured_image_index

- Run the migration SQL file
- Verify the column exists: `SELECT featured_image_index FROM properties LIMIT 1;`
- Check if create/edit pages include the field in submission

## Summary

This feature provides an elegant, user-friendly way to manage property images with automatic cover photo selection. The first image in the array is always the cover, and users can simply drag images to reorder them. This approach is:

- **Intuitive**: Users understand "first = cover" naturally
- **Simple**: No extra UI elements needed
- **Flexible**: Can be extended for more complex featured image logic
- **Future-proof**: Database tracks the index for potential future enhancements
