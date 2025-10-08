# Database Migration Instructions

## Step-by-Step Setup

### 1. Open Supabase Dashboard

- Go to your Supabase project dashboard
- Navigate to the SQL Editor (left sidebar)

### 2. Create Team Members Table

- Click "New Query"
- Copy the entire contents of `database/create_team_members_table.sql`
- Paste into the SQL editor
- Click "Run" or press Cmd/Ctrl + Enter

### 3. Verify Table Creation

Run this query to check:

```sql
SELECT * FROM team_members;
```

You should see an empty table with all columns.

### 4. Check RLS Policies

Run this query:

```sql
SELECT * FROM pg_policies WHERE tablename = 'team_members';
```

You should see 5 policies created.

### 5. Test Insert (Optional)

Add a test team member:

```sql
INSERT INTO team_members (name, role, image, bio, experience, is_active)
VALUES (
  'Test User',
  'Test Role',
  '/images/users/user-01.png',
  'This is a test bio',
  '5+ Years',
  true
);
```

### 6. Access Admin Panel

Navigate to: `http://localhost:3000/admin/team`

You should see:

- The stats cards (showing 1 member if you added the test)
- The team members table
- "Add Team Member" button

### 7. Create Your First Real Team Member

- Click "Add Team Member"
- Fill in the form
- Upload an image
- Add specialties
- Save

### 8. View Public Page

Navigate to: `http://localhost:3000/team`

You should see your team member displayed beautifully!

## Troubleshooting

### Error: "relation team_members does not exist"

- The table wasn't created properly
- Re-run the SQL migration script
- Check for any error messages in Supabase

### Error: "permission denied for table team_members"

- RLS policies not set up correctly
- Re-run the RLS policy section of the script
- Make sure you're authenticated in your app

### Images Not Showing

- Check the image path is correct
- For now, images are stored as data URLs
- TODO: Implement Supabase Storage upload

### Can't Access Admin Panel

- Make sure you're authenticated
- Check your auth middleware
- Verify admin routes are protected properly

## Success Checklist

- ✅ Table created successfully
- ✅ RLS policies in place
- ✅ Can access `/admin/team`
- ✅ Can create team members
- ✅ Can edit team members
- ✅ Can delete team members
- ✅ Can drag & drop reorder
- ✅ Public page shows team members
- ✅ Modal opens for full details
- ✅ Optional fields work correctly

## Next Steps After Setup

1. **Add Real Team Members**

   - Use professional photos
   - Write compelling bios
   - Add accurate contact info

2. **Test All Features**

   - Create, edit, delete
   - Reorder members
   - Toggle active/inactive
   - Check public page

3. **Customize**

   - Adjust colors if needed
   - Modify fields
   - Add new features

4. **Deploy**
   - Test in production
   - Verify database connection
   - Check RLS policies work

---

**Ready to Go!** 🚀 Run the migration and start managing your team!
