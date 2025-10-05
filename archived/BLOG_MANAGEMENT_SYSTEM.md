# Blog Management System - Documentation

## Overview

Added complete blog management system to the admin panel with full CRUD operations, markdown support, and image uploads.

## What Was Implemented

### 1. Database Setup

- **File**: `database/create_blogs_table.sql`
- Created `blogs` table with all necessary fields
- Includes RLS policies for security
- Sample data migration from existing MDX files
- Triggers for automatic `updated_at` timestamp

**Schema:**

```sql
- id (UUID, Primary Key)
- title (TEXT, NOT NULL)
- slug (TEXT, UNIQUE, NOT NULL)
- excerpt (TEXT)
- cover_image (TEXT)
- author (TEXT, NOT NULL)
- author_image (TEXT)
- content (TEXT, NOT NULL) - Markdown format
- detail (TEXT) - Summary below title
- tag (TEXT, default: 'General')
- is_published (BOOLEAN, default: true)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- published_at (TIMESTAMP)
```

**To apply**: Run this SQL file in your Supabase SQL editor

### 2. Server Actions

- **File**: `src/app/admin/blogs/actions.ts`

**Functions:**

- `getAllBlogs(includeUnpublished)` - Get all blogs
- `getBlogBySlug(slug)` - Get single blog by URL slug
- `getBlogById(id)` - Get single blog by ID
- `createBlog(blogData)` - Create new blog
- `updateBlog(id, blogData)` - Update existing blog
- `deleteBlog(id)` - Delete blog
- `toggleBlogPublished(id, isPublished)` - Toggle publish status

All actions include:

- Authentication verification
- Error handling
- Cache revalidation
- Slug uniqueness validation

### 3. Admin Pages

#### a) Blog List Page

- **File**: `src/app/admin/blogs/page.tsx`
- Shows all blogs in a table
- Displays: Cover image, title, excerpt, author, tag, status
- Actions: Edit, Delete, Toggle publish status
- Click-to-toggle published/draft status
- Delete confirmation modal
- Formatted dates with `date-fns`

#### b) Create Blog Page

- **File**: `src/app/admin/blogs/create/page.tsx`
- Form for creating new blog posts
- Auto-generates slug from title
- Image uploads for cover and author
- Markdown content editor
- Publishing controls

#### c) Edit Blog Page

- **File**: `src/app/admin/blogs/edit/[id]/page.tsx`
- Pre-filled form with existing blog data
- Same features as create page
- Updates without re-uploading images if not changed

### 4. Blog Form Component

- **File**: `src/components/Admin/BlogForm.tsx`

**Features:**

- Auto-slug generation from title
- Cover image upload with preview
- Author image upload with preview
- Markdown content editor (large textarea)
- Tag selection (Tip, Guide, News, Market Update, etc.)
- Published date picker
- Publish/Draft toggle switch
- Loading states and error handling
- Image removal functionality

**Form Sections:**

1. **Basic Information**: Title, slug, excerpt, detail
2. **Content**: Markdown editor with large text area
3. **Author & Category**: Author name, tag selection
4. **Images**: Cover image, author image
5. **Publishing**: Publish toggle, published date

### 5. Dashboard Integration

- **File**: `src/components/Admin/DashboardLayout.tsx`
- Added "Blogs" menu item with NewspaperIcon
- Links to `/admin/blogs`

### 6. Types

Blog data structure follows existing `Blog` type in `src/types/blog.ts`

## How It Works

### User Flow

#### Creating a Blog

1. Admin goes to Admin → Blogs → Create
2. Fills in title (slug auto-generates)
3. Writes content in markdown
4. Uploads cover and author images
5. Selects tag and publish status
6. Clicks "Create Blog"
7. Images upload to Supabase Storage
8. Blog saved to database
9. Redirects to blog list

#### Editing a Blog

1. Admin clicks Edit on any blog
2. Form loads with existing data
3. Makes changes as needed
4. Can upload new images or keep existing
5. Clicks "Update Blog"
6. Changes saved to database
7. Redirects to blog list

#### Publishing/Unpublishing

1. Click the status chip in the list
2. Toggles between Published/Draft
3. Updates immediately
4. Toast notification confirms change

#### Deleting a Blog

1. Click delete button
2. Confirmation modal appears
3. Confirm deletion
4. Blog removed from database
5. Toast notification confirms

### Frontend Integration

The blog system can integrate with existing frontend in two ways:

**Option 1: Keep MDX Files (Current)**

- Existing `/blogs` pages continue to work
- Uses `markdown/blogs/*.mdx` files
- No changes needed

**Option 2: Use Database (Recommended)**

- Update blog pages to fetch from database
- Use the server actions
- Dynamic content updates
- No need to redeploy for new blogs

### Markdown Support

Blogs support full markdown syntax:

- **Headings**: `### Heading`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Lists**: `- item` or `1. item`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Code blocks**: ` ```code``` `

The content is stored as markdown and rendered on the frontend using your existing `markdownToHtml` utility.

## Image Storage

Images are uploaded to Supabase Storage:

- **Bucket**: `property-images` (existing)
- **Folders**:
  - `blog-covers/` - Cover images
  - `blog-authors/` - Author images

Images are publicly accessible and return URLs that are stored in the database.

## Features

### Current Features

✅ Full CRUD operations (Create, Read, Update, Delete)
✅ Markdown content editor
✅ Image uploads (cover + author)
✅ Auto-slug generation
✅ Publish/Draft status
✅ Tag categorization
✅ Author information
✅ Published date tracking
✅ Image preview before upload
✅ Delete confirmation
✅ Loading states
✅ Error handling
✅ Toast notifications
✅ Responsive design
✅ Dark mode support

### Security Features

✅ Row Level Security (RLS) policies
✅ Authentication required for admin actions
✅ Public can only see published blogs
✅ Admins can see all blogs (including drafts)
✅ Slug uniqueness validation
✅ SQL injection protection (Supabase handles this)

## Migration from MDX Files

The SQL file includes a sample blog migrated from `blog_1.mdx`. To migrate all existing blogs:

1. Run the SQL migration
2. Manually create blogs in admin for each MDX file, OR
3. Create a migration script to bulk import

**Migration Script Example:**

```typescript
// scripts/migrate-blogs.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createBlog } from "@/app/admin/blogs/actions";

async function migrateBlogs() {
  const blogsDir = path.join(process.cwd(), "markdown/blogs");
  const files = fs.readdirSync(blogsDir);

  for (const file of files) {
    const content = fs.readFileSync(path.join(blogsDir, file), "utf8");
    const { data, content: markdown } = matter(content);

    await createBlog({
      title: data.title,
      slug: file.replace(".mdx", ""),
      excerpt: data.excerpt,
      cover_image: data.coverImage,
      author: data.author,
      author_image: data.authorImage,
      content: markdown,
      detail: data.detail,
      tag: data.tag,
      is_published: true,
      published_at: data.date,
    });
  }
}
```

## Frontend Integration Guide

To update your frontend to use the database:

### 1. Update Blog List Page

```typescript
// src/app/(site)/blogs/page.tsx
import { getAllBlogs } from "@/app/admin/blogs/actions";

export default async function BlogsPage() {
  const result = await getAllBlogs(false); // Only published
  const blogs = result.success ? result.data : [];

  return (
    <div>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
```

### 2. Update Single Blog Page

```typescript
// src/app/(site)/blogs/[slug]/page.tsx
import { getBlogBySlug } from "@/app/admin/blogs/actions";
import markdownToHtml from "@/components/utils/markdownToHtml";

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const result = await getBlogBySlug(params.slug);
  const blog = result.data;
  const content = await markdownToHtml(blog.content);

  return (
    <article>
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

## Testing Checklist

### Database

- [ ] Run SQL migration in Supabase
- [ ] Verify `blogs` table exists
- [ ] Check RLS policies are active
- [ ] Test public can read published blogs
- [ ] Test admin can read all blogs

### Admin Panel

- [ ] Access `/admin/blogs`
- [ ] Create new blog with all fields
- [ ] Upload cover and author images
- [ ] Save as draft and published
- [ ] Edit existing blog
- [ ] Toggle publish status
- [ ] Delete blog with confirmation
- [ ] Auto-slug generation works
- [ ] Slug uniqueness validation works
- [ ] Error messages display correctly

### Frontend (If Integrated)

- [ ] Blog list shows published blogs
- [ ] Single blog page loads correctly
- [ ] Markdown renders properly
- [ ] Images display correctly
- [ ] SEO metadata works
- [ ] Links work correctly

## Benefits

### For Administrators

- ✅ **Easy Content Management**: No need to edit files or redeploy
- ✅ **Visual Editor**: See images before publishing
- ✅ **Draft System**: Work on blogs before publishing
- ✅ **Quick Updates**: Edit any blog instantly
- ✅ **Rich Content**: Full markdown support

### For Developers

- ✅ **No Deployment**: Content updates don't require code changes
- ✅ **Database-Driven**: Easy to query and filter
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Scalable**: Handle thousands of blogs
- ✅ **API-Ready**: Easy to add API endpoints

### For Users

- ✅ **Fresh Content**: New blogs appear immediately
- ✅ **Better SEO**: Dynamic metadata per blog
- ✅ **Faster Loading**: Database queries vs file reads
- ✅ **Search-Friendly**: Easy to implement search

## Future Enhancements (Optional)

### Possible Additions

1. **Rich Text Editor**: Replace textarea with WYSIWYG editor
2. **SEO Fields**: Custom meta titles, descriptions
3. **Categories**: Multi-level categorization
4. **Comments**: Blog comment system
5. **Related Posts**: Auto-suggest related blogs
6. **Analytics**: View counts, popular posts
7. **Scheduling**: Schedule posts for future publication
8. **Revisions**: Track blog edit history
9. **Multiple Authors**: Co-author system
10. **Tags System**: Multiple tags per blog

## Troubleshooting

### Images Not Uploading

- Check Supabase Storage bucket exists
- Verify `property-images` bucket is public
- Check file size limits
- Ensure proper authentication

### Slug Conflicts

- System auto-appends random string if slug exists
- Can manually edit slug to resolve
- Check database for existing slugs

### Markdown Not Rendering

- Verify `markdownToHtml` utility exists
- Check markdown syntax is valid
- Test with simple markdown first

### RLS Errors

- Verify user is authenticated
- Check RLS policies in Supabase
- Ensure policies match the actions

## Summary

This blog management system provides a complete, production-ready solution for managing blog content. It's built with the same architecture as your existing admin panels (properties, testimonials) for consistency.

Key advantages:

- **No code changes needed** for new blogs
- **Immediate publishing** without deployment
- **Full control** over content and presentation
- **Secure** with RLS policies
- **Scalable** for thousands of posts
- **User-friendly** admin interface

The system is ready to use - just run the SQL migration and start creating blogs! 🚀
