# 📊 Property ViewContent Event Tracking

## ✅ What Was Implemented

I've added automatic **ViewContent** event tracking that fires whenever someone opens a property details page.

---

## 🎯 What Gets Tracked

### Event Details

| Field                | Value               | Purpose                            |
| -------------------- | ------------------- | ---------------------------------- |
| **Event Name**       | `ViewContent`       | Standard Meta event for page views |
| **Content Name**     | Property name       | Which property was viewed          |
| **Content Category** | Property type       | House, Apartment, Plot, etc.       |
| **Content IDs**      | Property ID         | Unique identifier                  |
| **Content Type**     | `product`           | Standard for e-commerce items      |
| **Value**            | Property price/rate | Property value in PKR              |
| **Currency**         | `PKR`               | Pakistani Rupee                    |

---

## 🔄 How It Works

### Flow Diagram

```
User opens property page
         ↓
Property data loads from database
         ↓
useEffect detects property loaded
         ↓
Generate unique event_id
         ↓
┌─────────────────────┐   ┌─────────────────────┐
│   Browser Pixel     │   │   Server CAPI       │
│   ViewContent       │   │   ViewContent       │
│   eventID: abc-123  │   │   event_id: abc-123 │
└─────────────────────┘   └─────────────────────┘
         ↓                         ↓
         └────────────┬────────────┘
                      ↓
              Meta deduplicates
                      ↓
         Counts as ONE page view ✅
```

---

## 📍 Where It's Implemented

**File**: `src/app/(site)/explore/[id]/page.tsx`

**Location**: New `useEffect` hook that runs when `property` state changes

```typescript
useEffect(() => {
  if (!property) return;

  // Send ViewContent event
  // ...
}, [property]);
```

---

## 🧪 How to Test

### Step 1: Open Developer Console

Press **F12** in your browser

### Step 2: Navigate to Any Property

```
http://localhost:3000/explore/[property-slug]
```

For example:

- `http://localhost:3000/explore/villa-in-dha`
- `http://localhost:3000/explore/apartment-bahria`

### Step 3: Check Console Logs

You should see:

- Network request to `/api/meta-events`
- Event name: `ViewContent`
- Property details in the payload

### Step 4: Check Server Logs

```bash
Meta CAPI Event Received: {
  event_id: '550e8400-...',
  event_name: 'ViewContent',  // ← New event type!
  cookies: { _fbc: null, _fbp: null },
  client_ip: '::1',
  user_agent: 'Mozilla/5.0...'
}

Meta CAPI Response: {
  status: 200,
  result: { events_received: 1 }
}
```

### Step 5: Verify in Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Click **Test Events** tab (if testing) or **Overview** (if production)
3. Look for **ViewContent** events
4. Should see property name and details

---

## 📊 Event Payload Example

### What Gets Sent to Meta

```json
{
  "event_name": "ViewContent",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_time": 1697216400,
  "event_source_url": "https://yoursite.com/explore/villa-dha",
  "user_data": {
    "client_user_agent": "Mozilla/5.0...",
    "client_ip_address": "123.456.789.0"
  },
  "custom_data": {
    "content_name": "Beautiful Villa in DHA Phase 5",
    "content_category": "House",
    "content_ids": ["prop-123"],
    "content_type": "product",
    "value": 25000000,
    "currency": "PKR"
  }
}
```

---

## 🎯 Use Cases & Benefits

### 1. **Track Popular Properties**

See which properties get the most views:

- Identify trending locations
- Understand buyer interests
- Optimize property listings

### 2. **Build Custom Audiences**

Create audiences of people who:

- Viewed any property
- Viewed properties > PKR 10M
- Viewed houses in DHA
- Viewed but didn't contact (retargeting!)

### 3. **Measure Funnel**

Track user journey:

1. **PageView** - Landed on site
2. **ViewContent** - Opened property details ✅ NEW!
3. **Lead** - Clicked WhatsApp/Call

### 4. **Optimize Ads**

Use ViewContent for:

- Conversion optimization
- Lookalike audiences
- Retargeting campaigns
- Value-based optimization

---

## 📈 Expected Results

### In Development

```bash
# Every time you open a property page:
✓ ViewContent event sent to Meta Pixel
✓ ViewContent event sent to server CAPI
✓ Events deduplicated by Meta
✓ Counted as 1 property view
```

### In Production

You'll see in Meta Events Manager:

- **ViewContent** events for each property page view
- Property names in event details
- Property values for optimization
- Geographic data (where viewers are from)

---

## 🔍 Events Now Tracked

| Event           | When                  | Purpose                |
| --------------- | --------------------- | ---------------------- |
| **PageView**    | Site visit            | Track traffic          |
| **ViewContent** | Property page opened  | Track interest ✅ NEW! |
| **Lead**        | WhatsApp/Call clicked | Track conversions      |

---

## 💡 Advanced: Create Custom Audiences

### Example 1: High-Value Property Viewers

In Meta Ads Manager:

1. Create Custom Audience
2. Choose "Website"
3. Select "ViewContent"
4. Filter: `value > 10000000` (10M PKR)
5. Time range: Last 30 days

**Result**: Audience of people interested in premium properties!

### Example 2: Property Type Interest

Filter by `content_category`:

- `content_category = House` → House viewers
- `content_category = Plot` → Plot viewers
- `content_category = Apartment` → Apartment viewers

**Result**: Target ads based on property type preference!

### Example 3: Viewed But Didn't Contact

1. **Include**: ViewContent in last 7 days
2. **Exclude**: Lead in last 7 days

**Result**: Retarget interested but uncommitted viewers!

---

## 🎓 Understanding the Code

### Why useEffect?

```typescript
useEffect(() => {
  if (!property) return; // Wait for property to load

  sendViewContentEvent();
}, [property]); // Run when property changes
```

- Runs **after** property data is fetched
- Ensures we have property details to send
- Only runs once per property load

### Why ViewContent vs PageView?

| Event           | Purpose                                       |
| --------------- | --------------------------------------------- |
| **PageView**    | General page visit                            |
| **ViewContent** | Specific content viewed (better for tracking) |

ViewContent is more useful because:

- Includes product details
- Better for conversion tracking
- Can filter by content attributes
- Higher quality signal for Meta

### Deduplication Still Works

```typescript
const eventId = crypto.randomUUID();

// Browser
fbq('track', 'ViewContent', {...}, { eventID: eventId });

// Server
fetch('/api/meta-events', {
  body: JSON.stringify({ event_id: eventId })
});
```

Same `event_id` → Meta counts as one event ✅

---

## 🚀 Testing Checklist

- [ ] Open any property page
- [ ] Check browser console (no errors)
- [ ] Check Network tab (POST to `/api/meta-events`)
- [ ] Check server logs (ViewContent received)
- [ ] Check Meta Events Manager (event appears)
- [ ] Open different property (another event sent)
- [ ] Refresh page (another event sent - this is normal)

---

## 🔧 Troubleshooting

### Issue: Events Firing Multiple Times

**Symptoms**: Multiple ViewContent events per page load

**Cause**: React development mode (strict mode)

**Solution**: Normal in development! In production, fires once.

---

### Issue: No Events Showing

**Symptoms**: No ViewContent in Meta Events Manager

**Checklist**:

1. ✓ Property loaded successfully?
2. ✓ Console errors?
3. ✓ Server logs show event received?
4. ✓ Meta Test Events page open (if testing)?

---

### Issue: Wrong Property Details

**Symptoms**: Event shows wrong property name/value

**Cause**: Stale data or race condition

**Solution**: Clear browser cache, refresh page

---

## 📊 Analytics Examples

### Track Most Viewed Properties

In Meta Events Manager:

1. Go to **Events** → **ViewContent**
2. Sort by **Event Count**
3. Group by **content_name**

See which properties are most popular!

### Track Average Property Value Viewed

1. Go to **Aggregated Event Measurement**
2. Select **ViewContent**
3. Look at **Average Value**

Understand your audience's budget range!

### Track Location Interest

1. Go to **Audience Insights**
2. Filter by **ViewContent** event
3. Group by **content_category**

See which property types are trending!

---

## 🎉 Benefits Summary

✅ **Automatic tracking** - No manual setup needed  
✅ **Property-level insights** - Know which properties are popular  
✅ **Audience building** - Create custom audiences for retargeting  
✅ **Ad optimization** - Meta optimizes for ViewContent  
✅ **Funnel tracking** - Understand user journey  
✅ **Value optimization** - Optimize for high-value viewers

---

## 📝 Next Steps (Optional)

Want to track more events? Consider adding:

### 1. **Search Event**

When user searches properties:

```typescript
fbq("track", "Search", {
  search_string: searchQuery,
  content_category: propertyType,
});
```

### 2. **AddToWishlist Event**

If you add favorites/wishlist:

```typescript
fbq("track", "AddToWishlist", {
  content_ids: [propertyId],
  value: propertyValue,
});
```

### 3. **Contact Event**

For phone calls:

```typescript
fbq("track", "Contact", {
  content_name: propertyName,
});
```

---

## 🎯 Summary

**What**: ViewContent event tracking added  
**When**: Fires when property page opens  
**Why**: Track property views, build audiences, optimize ads  
**Status**: ✅ Implemented and ready to use!

**Test it**: Open any property page and check Meta Events Manager!

---

**Implementation Date**: October 13, 2025  
**Event Type**: ViewContent (Standard Meta event)  
**Deduplication**: ✅ Enabled with unique event_id  
**Status**: ✅ Production ready
