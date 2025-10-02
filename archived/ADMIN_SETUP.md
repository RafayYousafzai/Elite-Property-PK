# Admin Dashboard Setup Guide

This guide will help you set up the admin dashboard for managing properties with Supabase authentication.

## Prerequisites

1. A Supabase project
2. Node.js and npm/bun installed
3. Your Supabase project URL and anon key

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to Settings > API to find your project URL and anon key
3. Go to the SQL Editor in your Supabase dashboard
4. Copy and execute the SQL script from `database/setup.sql` to create the properties table

### 2. Environment Configuration

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Update your `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Authentication Setup

1. In your Supabase dashboard, go to Authentication > Settings
2. Disable "Enable email confirmations" for easier testing (optional)
3. Create an admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Add email and password for your admin account

### 4. Database Policies

The SQL script includes Row Level Security (RLS) policies that allow:

- Authenticated users to perform CRUD operations on properties
- Public read access to properties (for the frontend)

### 5. Running the Application

1. Install dependencies:

   ```bash
   bun install
   # or
   npm install
   ```

2. Run the development server:

   ```bash
   bun dev
   # or
   npm run dev
   ```

3. Access the admin dashboard:
   - Go to `http://localhost:3000/admin/login`
   - Login with your admin credentials
   - You'll be redirected to the dashboard

## Admin Features

### Dashboard (`/admin/dashboard`)

- Overview of total properties
- Quick action buttons
- Statistics display

### Properties Management (`/admin/properties`)

- View all properties in a list format
- Edit existing properties
- Delete properties
- Quick navigation to create new properties

### Create Property (`/admin/properties/create`)

- Form to add new properties
- Support for multiple images
- Auto-slug generation
- Property type selection (house, apartment, plot)
- Conditional fields based on property type

### Edit Property (`/admin/properties/edit/[id]`)

- Edit existing property details
- Update images
- Change property information

## API Routes

The application includes the following API endpoints:

- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/[id]` - Get a specific property
- `PUT /api/properties/[id]` - Update a property
- `DELETE /api/properties/[id]` - Delete a property

## Database Schema

The properties table includes:

- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `slug` (Text, Required, Unique)
- `location` (Text, Required)
- `rate` (Text, Required)
- `area` (Integer, Required)
- `beds` (Integer, Optional)
- `baths` (Integer, Optional)
- `photo_sphere` (Text, Optional)
- `property_type` (Enum: house, apartment, plot)
- `images` (JSONB Array)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Authentication Flow

1. Users access `/admin/login`
2. Supabase handles authentication
3. Middleware protects admin routes
4. Authenticated users can access dashboard and CRUD operations

## Security

- Row Level Security (RLS) is enabled
- Authentication required for admin access
- Middleware protects admin routes
- Supabase handles secure authentication

## Troubleshooting

### Common Issues:

1. **"Invalid JWT" errors**

   - Check your environment variables
   - Ensure your Supabase URL and keys are correct

2. **Database connection issues**

   - Verify your Supabase project is active
   - Check that the SQL script was executed successfully

3. **Authentication not working**

   - Ensure you've created a user in Supabase Auth
   - Check that email confirmation is disabled (if testing locally)

4. **Properties not displaying**
   - Verify the properties table exists
   - Check that RLS policies are set up correctly
   - Ensure sample data was inserted

### Getting Help

- Check the Supabase dashboard for error logs
- Use the browser developer tools to inspect network requests
- Verify your environment variables are loaded correctly
