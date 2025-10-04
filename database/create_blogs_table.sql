-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  cover_image TEXT,
  author TEXT NOT NULL,
  author_image TEXT,
  content TEXT NOT NULL,
  detail TEXT,
  tag TEXT DEFAULT 'General',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
  BEFORE UPDATE ON blogs 
  FOR EACH ROW EXECUTE FUNCTION update_blogs_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Allow anyone to read published blogs
CREATE POLICY "Allow public read access to published blogs" ON blogs
  FOR SELECT 
  USING (is_published = true);

-- Allow authenticated users to read all blogs (including drafts)
CREATE POLICY "Allow authenticated read all blogs" ON blogs
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert blogs
CREATE POLICY "Allow authenticated insert access" ON blogs
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update blogs
CREATE POLICY "Allow authenticated update access" ON blogs
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to delete blogs
CREATE POLICY "Allow authenticated delete access" ON blogs
  FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- Create index for faster slug lookups
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(is_published, published_at);

-- Insert sample blog data (migrated from existing MDX files)
INSERT INTO blogs (title, slug, excerpt, cover_image, author, author_image, content, detail, tag, published_at) VALUES
(
  'Home buying tips',
  'home-buying-tips',
  'Home buying tips',
  '/images/blog/blog-1.jpg',
  'Arlene McCoy',
  '/images/users/arlene.jpg',
  E'### Your Ultimate Guide to Buying Your Dream Home

Buying a home is one of the most significant financial decisions you''ll ever make. Whether you''re a first-time buyer or looking to upgrade, understanding the process can help you navigate it with confidence. Here are essential tips to guide you through your home-buying journey.

### 1. Assess Your Financial Readiness

- Check Your Credit Score: A higher credit score can help you secure better mortgage rates. Check your credit report for any errors and work on improving your score if necessary
- Determine Your Budget: Calculate how much you can afford, considering your income, expenses, and potential mortgage payments. Don''t forget to account for property taxes, insurance, and maintenance costs.
- Save for a Down Payment: While many loans require a 20% down payment, some government programs offer options with lower down payments. Research what works best for you.
- Get Pre-Approved: A mortgage pre-approval shows sellers that you are a serious buyer and can give you an edge in competitive markets.

### 2. Define Your Priorities

- Location Matters: Consider proximity to work, schools, public transportation, and amenities. Research the neighborhood''s safety and future growth potential.
- Home Features: Make a list of must-haves versus nice-to-haves. Think about the number of bedrooms, bathrooms, and any special requirements like a backyard or home office
- Future Needs: Are you planning to grow your family or work from home? Think about your future lifestyle when selecting a property

### 3. Find the Right Real Estate Agent

A reliable real estate agent can be invaluable in helping you find properties, negotiate offers, and navigate the closing process. Ask for referrals, read reviews, and interview a few agents to find the right fit.

### 4. Shop Smart

- Attend Open Houses: Get a feel for different styles and neighborhoods by visiting open houses
- Compare Prices: Research comparable homes to ensure you''re getting a fair price
- Consider Resale Value: Choose a home that will appeal to future buyers in case you decide to sell later

### 5. Make an Offer and Negotiate

When you find the right home, your agent will help you submit a competitive offer. Be prepared to negotiate on price, repairs, or closing costs. Always stay within your budget.',
  'Buying your first home is an exciting milestone, but it can also feel overwhelming with so many factors to consider. To help you make informed decisions, here are the top five tips for first-time home buyers to successfully navigate the real estate market.',
  'Tip',
  '2025-02-05'
);

-- Add comment
COMMENT ON TABLE blogs IS 'Stores blog posts with markdown content';
