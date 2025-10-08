# Team Management System - Setup Guide

## Overview

The team management system allows you to create, edit, delete, and reorder team members through the admin panel. All fields except email, phone, and social media are required. The team page automatically fetches data from the database.

## Database Setup

### 1. Create the Database Table

Run the SQL script in your Supabase SQL editor:

```bash
# Location: database/create_team_members_table.sql
```

This creates:

- `team_members` table with all required fields
- Indexes for efficient sorting and filtering
- Row Level Security (RLS) policies
- Auto-update trigger for `updated_at` timestamp

### 2. Insert Sample Data (Optional)

After creating the table, you can add some sample team members through the admin panel or directly via SQL.

## Admin Panel Access

### Navigation

1. Go to `/admin/team` to view all team members
2. Click "Add Team Member" to create a new member
3. Click the edit icon (pencil) to edit an existing member
4. Click the delete icon (trash) to remove a member
5. Drag and drop rows to reorder team members

### Creating a Team Member

#### Required Fields:

- **Name**: Full name of the team member
- **Role**: Job title/position
- **Bio**: Brief description (2-3 sentences)
- **Experience**: e.g., "10+ Years"
- **Profile Image**: Upload a professional photo (recommended 400x400px)

#### Optional Fields:

- **Email**: Contact email
- **Phone**: Contact phone number
- **LinkedIn**: Full LinkedIn profile URL
- **Twitter**: Full Twitter profile URL
- **Facebook**: Full Facebook profile URL
- **Instagram**: Full Instagram profile URL
- **Specialties**: Add multiple tags (e.g., "Luxury Properties", "Investment Strategy")
- **Display Order**: Number to control sort order (lower = appears first)
- **Active Status**: Toggle to show/hide on public page

### Editing a Team Member

1. Click the edit icon next to any team member
2. Modify the fields you want to change
3. Click "Update Team Member"

### Deleting a Team Member

1. Click the delete icon (trash) next to any team member
2. Confirm the deletion in the popup
3. The member will be permanently removed

### Reordering Team Members

1. Drag and drop team members in the list
2. The new order is automatically saved
3. This order is reflected on the public team page

## Public Team Page

### Access

Visit `/team` to see the public-facing team page

### Features:

- Displays all active team members in order
- Shows profile photos, names, roles, and experience
- Displays bio and contact information (if provided)
- Shows social media links (if provided)
- Click "View Profile" to see full details in a modal
- Fully responsive design
- Dark mode support
- Smooth animations

### Contact Information Display:

- Email and phone are only shown if provided
- If neither is provided, the contact section is hidden
- Same applies to social media links

## File Structure

```
src/
├── app/
│   ├── (site)/
│   │   └── team/
│   │       └── page.tsx                 # Public team page
│   └── admin/
│       └── team/
│           ├── page.tsx                 # Admin list page
│           ├── create/
│           │   └── page.tsx             # Create page
│           └── edit/
│               └── [id]/
│                   └── page.tsx         # Edit page
├── components/
│   └── Admin/
│       └── Team/
│           ├── SortableTeamMemberRow.tsx  # Drag & drop row
│           └── TeamMemberForm.tsx          # Shared form component
├── lib/
│   └── supabase/
│       └── team.ts                      # Database functions
└── types/
    └── team.ts                          # TypeScript types

database/
└── create_team_members_table.sql        # SQL setup script
```

## Key Features

### 1. Optional Fields

- Email, phone, and all social media fields are optional
- Forms accept empty strings for these fields
- Display components check for null/empty values before rendering

### 2. Drag & Drop Reordering

- Uses @dnd-kit library for smooth drag and drop
- Automatically saves new order to database
- Real-time updates without page reload

### 3. Image Upload

- Currently uses File Reader for preview
- **TODO**: Implement Supabase Storage upload
- Accepts JPG, PNG formats
- Recommended size: 400x400px

### 4. Specialties Management

- Add multiple specialty tags
- Press Enter or click "Add" button
- Remove by clicking the X icon
- Stored as PostgreSQL array

### 5. Active/Inactive Status

- Toggle to control visibility on public page
- Inactive members only visible in admin panel
- Useful for temporary removals without deleting

## API Functions

### `getTeamMembers(includeInactive?)`

Fetches all team members, optionally including inactive ones.

### `getTeamMemberById(id)`

Fetches a single team member by ID.

### `createTeamMember(data)`

Creates a new team member.

### `updateTeamMember(id, data)`

Updates an existing team member.

### `deleteTeamMember(id)`

Permanently deletes a team member.

### `reorderTeamMembers(updates)`

Batch updates display_order for multiple members.

## Customization

### Changing Colors

The system uses the amber color palette for the golden theme:

- Primary: `amber-600` / `amber-500`
- Backgrounds: `amber-50` / `amber-950/30`
- Borders: `amber-200` / `amber-900/50`

### Modifying Fields

To add new fields:

1. Update the database table (add column)
2. Update `src/types/team.ts` interfaces
3. Update `src/lib/supabase/team.ts` functions
4. Update `TeamMemberForm.tsx` to include the field
5. Update `page.tsx` to display the field

### Styling

All components use Tailwind CSS with dark mode support. Modify classes directly in the component files.

## Troubleshooting

### Images Not Displaying

- Check that the image URL is valid
- Implement proper Supabase Storage upload
- Verify file size is reasonable (<5MB)

### Drag & Drop Not Working

- Ensure @dnd-kit packages are installed
- Check browser console for errors
- Verify sensors are properly configured

### Data Not Saving

- Check browser console for API errors
- Verify Supabase connection
- Check RLS policies are correct
- Ensure user is authenticated

## Next Steps

### Recommended Improvements:

1. **Image Upload to Supabase Storage**

   - Create a storage bucket
   - Implement upload function
   - Store bucket URL in database

2. **Bulk Operations**

   - Select multiple members
   - Bulk delete
   - Bulk status change

3. **Search & Filter**

   - Search by name/role
   - Filter by active status
   - Filter by specialties

4. **Analytics**

   - Track profile views
   - Monitor engagement
   - Export data

5. **Email Validation**
   - Validate email format
   - Check for duplicates
   - Send verification emails

## Support

For issues or questions:

1. Check the browser console for errors
2. Verify database connection
3. Review Supabase logs
4. Check RLS policies

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Built with**: Next.js 15, Supabase, Tailwind CSS, Framer Motion
