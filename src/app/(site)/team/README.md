# 🌟 Elite Property Team Page

## Overview

A luxurious, modern team page showcasing your Elite Property team members with smooth animations and golden accent colors.

## ✨ Features

### 🎨 Design Elements

- **Luxury Golden Theme** - Premium golden accents throughout (amber-500, amber-600)
- **Smooth Animations** - Framer Motion powered animations with staggered effects
- **Dark Mode Support** - Fully responsive dark/light theme
- **Gradient Backgrounds** - Elegant gradient overlays and decorative elements
- **Hover Effects** - Interactive cards with scale, shadow, and color transitions

### 📱 Responsive Layout

- **Mobile First** - Optimized for all screen sizes
- **Grid System** - 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Fluid Typography** - Scales beautifully from mobile to desktop

### 👥 Team Member Cards

Each card includes:

- **Professional Photo** with hover zoom effect
- **Name & Role** with golden color accent
- **Experience Badge** (e.g., "15+ Years")
- **Bio Description**
- **Contact Information** (Email & Phone with icons)
- **Social Media Links** (LinkedIn, Twitter, Facebook, Instagram)
- **Hover Overlay** with "View Profile" button

### 🔍 Interactive Modal

Click "View Profile" to see:

- **Full-screen Modal** with backdrop blur
- **Detailed Information**
- **Specialties Tags** (e.g., "Luxury Properties", "Investment Strategy")
- **Complete Contact Details** with styled icons
- **Social Media Buttons** with hover effects
- **Smooth Open/Close Animations**

### 🎯 Hero Section

- **Gradient Background** with animated blur orbs
- **Bold Typography** with golden gradient text
- **Statistics Display** - Years Experience, Properties Sold, Happy Clients
- **Decorative Badge** - "Meet Our Team" with icon

### 📢 CTA Section

- **Full-Width Banner** with golden gradient background
- **Pattern Overlay** for texture
- **Two Action Buttons**:
  - "Contact Us" - White button with golden text
  - "View Properties" - Amber button with border
- **Hover Scale Effects** - Buttons grow on hover

## 🎭 Animations

### Page Load

- **Fade In** - Smooth opacity transitions
- **Slide Up** - Elements animate from bottom
- **Stagger Children** - Cards appear sequentially (0.1s delay)

### Hover Interactions

- **Card Lift** - -8px transform on hover
- **Image Zoom** - 1.1x scale on image
- **Shadow Growth** - Amber-tinted shadow appears
- **Border Color** - Changes to golden
- **Social Icons** - Scale to 1.1x with color change

### Modal

- **Scale & Fade** - Smooth open/close animation
- **Backdrop Blur** - Elegant background blur effect

## 🛠️ Customization

### Adding Team Members

Edit the `teamMembers` array in `page.tsx`:

```typescript
{
  id: 7,
  name: "Your Name",
  role: "Your Role",
  image: "/images/users/user-07.png",
  bio: "Your bio description",
  email: "email@eliteproperty.pk",
  phone: "+92 300 1234567",
  socials: {
    linkedin: "https://linkedin.com/in/yourprofile",
    twitter: "#",
    facebook: "#",
    instagram: "#",
  },
  specialties: ["Specialty 1", "Specialty 2", "Specialty 3"],
  experience: "10+ Years",
}
```

### Changing Colors

The page uses Tailwind's amber color palette for golden theme:

- `amber-50` to `amber-950` - Various shades
- Primary hover: `amber-500`, `amber-600`
- Text accents: `amber-600` (light mode), `amber-500` (dark mode)

### Updating Statistics

Modify the statistics in the hero section:

```typescript
<div className="text-4xl font-bold text-amber-600">15+</div>
<div className="text-gray-600">Years Experience</div>
```

## 📂 File Structure

```
src/app/(site)/team/
└── page.tsx          # Main team page component
```

## 🎨 Color Palette

- **Primary Gold**: `#D97706` (amber-600)
- **Light Gold**: `#F59E0B` (amber-500)
- **Gold Accent**: `#FBBF24` (amber-400)
- **Dark Background**: `#111827` (gray-900)
- **Light Background**: `#F9FAFB` (gray-50)

## 🚀 Performance

- **Optimized Images** - Next.js Image component with lazy loading
- **Smooth Animations** - Hardware-accelerated transforms
- **Viewport Detection** - Animations trigger when scrolled into view
- **Modal Optimization** - Only renders when opened

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)
- **Max Width**: 1536px container (8xl)

## ✅ Features Checklist

- ✅ Luxury golden theme
- ✅ Smooth animations (Framer Motion)
- ✅ Fully responsive design
- ✅ Dark mode support
- ✅ Interactive hover effects
- ✅ Modal with detailed profiles
- ✅ Social media integration
- ✅ Contact information display
- ✅ Experience badges
- ✅ Specialties tags
- ✅ CTA section with buttons
- ✅ Statistics display
- ✅ SEO-friendly structure
- ✅ Accessibility features

## 🎯 Usage

Simply navigate to `/team` to view the page. The page will automatically display all team members from the `teamMembers` array.

## 🔗 Navigation Integration

Add to your main navigation menu:

```typescript
{ name: "Team", href: "/team" }
```

## 💡 Tips

1. Use high-quality professional photos (400x300px minimum)
2. Keep bios concise (1-2 sentences)
3. Update social links with real URLs
4. Add 3-5 specialties per member
5. Use consistent image dimensions for best results

---

**Built with Next.js 15, Tailwind CSS, Framer Motion, and lots of ❤️**
