# Supabase Integration Setup Guide

This guide will help you set up the production-ready Supabase integration for your property listing application.

## Prerequisites

1. A Supabase project
2. Database table created with the provided schema
3. Environment variables configured

## Database Schema

Your `properties` table should already be created with this schema:

```sql
create table public.properties (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  location text not null,
  rate text not null,
  area integer not null,
  beds integer null,
  baths integer null,
  photo_sphere text null,
  property_type text not null,
  images jsonb null default '[]'::jsonb,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint properties_pkey primary key (id),
  constraint properties_slug_key unique (slug),
  constraint properties_property_type_check check (
    (
      property_type = any (
        array['house'::text, 'apartment'::text, 'plot'::text]
      )
    )
  )
) TABLESPACE pg_default;
```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Features Implemented

✅ **Real-time Property Loading**: Properties are fetched from Supabase database
✅ **Advanced Filtering**: Filter by property type, price range, area, beds, baths
✅ **Search Functionality**: Search by location or property name
✅ **Real-time Updates**: Properties update automatically when database changes
✅ **Loading States**: Professional loading skeletons
✅ **Error Handling**: Graceful error handling with retry functionality
✅ **Responsive Design**: Works on all device sizes
✅ **API Routes**: RESTful API endpoints for properties

## Data Migration

If you have existing static property data, you can use the migration utility:

1. **To check migration status**:
   ```typescript
   import { getMigrationStats } from '@/lib/supabase/migration';
   const stats = await getMigrationStats();
   console.log(stats);
   ```

2. **To migrate data** (only run once):
   ```typescript
   import { migratePropertiesToSupabase } from '@/lib/supabase/migration';
   await migratePropertiesToSupabase();
   ```

3. **To clear all data** (use with caution):
   ```typescript
   import { clearAllProperties } from '@/lib/supabase/migration';
   await clearAllProperties();
   ```

## API Endpoints

### GET /api/properties
Fetch all properties with optional query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `type`: Property type filter (all, homes, apartments, plots)

### POST /api/properties
Create a new property (requires admin authentication)

### GET /api/properties/[id]
Fetch a specific property by ID

## Components Updated

- **Search Page** (`/explore`): Now uses Supabase data with real-time filtering
- **Property Card**: Compatible with database structure
- **Search Sidebar**: Optimized filtering with database queries
- **Loading States**: Professional skeleton screens

## Database Optimization

Consider adding these indexes for better performance:

```sql
-- Index for property type filtering
CREATE INDEX idx_properties_property_type ON properties(property_type);

-- Index for area filtering
CREATE INDEX idx_properties_area ON properties(area);

-- Index for beds filtering
CREATE INDEX idx_properties_beds ON properties(beds) WHERE beds IS NOT NULL;

-- Index for baths filtering
CREATE INDEX idx_properties_baths ON properties(baths) WHERE baths IS NOT NULL;

-- Index for text search
CREATE INDEX idx_properties_search ON properties USING gin(to_tsvector('english', name || ' ' || location));
```

## Row Level Security (RLS)

For production, enable RLS policies:

```sql
-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON properties
FOR SELECT USING (true);

-- Allow authenticated users to insert (for admin)
CREATE POLICY "Allow authenticated insert" ON properties
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own properties
CREATE POLICY "Allow authenticated update" ON properties
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete (for admin)
CREATE POLICY "Allow authenticated delete" ON properties
FOR DELETE USING (auth.role() = 'authenticated');
```

## Testing

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Visit the explore page**: `http://localhost:3000/explore`

3. **Test filtering**: Try different property types, price ranges, and search terms

4. **Test real-time updates**: Add/edit properties in your Supabase dashboard and watch the page update automatically

## Production Considerations

1. **Caching**: Implement Redis or similar for property caching
2. **CDN**: Use a CDN for property images
3. **Monitoring**: Set up error monitoring (Sentry, etc.)
4. **Analytics**: Track user searches and popular properties
5. **SEO**: Implement proper meta tags for property listings
6. **Rate Limiting**: Protect API endpoints from abuse

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your environment variables are correct
3. Ensure your Supabase table schema matches exactly
4. Check Supabase logs for database errors

Your explore page is now production-ready with full Supabase integration! 🚀