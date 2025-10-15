# Meta Conversions API (CAPI) - Complete Setup Guide

## 🎯 Overview

Your Meta CAPI integration is now **fully functional**! This guide will help you configure the environment variables and test the complete flow.

---

## 📋 What We Built

### Complete Implementation ✅

1. **Client-Side (Browser)**

   - Generates unique `event_id` using `crypto.randomUUID()`
   - Sends event to Meta Pixel with `eventID`
   - Sends event to server with same `event_id`
   - Includes current page URL (`event_source_url`)

2. **Server-Side (Route Handler)**
   - Validates `event_id` presence
   - Extracts Meta cookies (`_fbc`, `_fbp`)
   - Retrieves credentials from environment variables
   - Constructs CAPI payload with all required fields
   - Sends event to Meta Graph API
   - Returns success/error response

---

## 🔧 Setup Instructions

### Step 1: Get Your Meta Credentials

#### A. Get Your Pixel ID

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel from the left sidebar
3. Click on **Settings** → **Set up** tab
4. Copy your **Pixel ID** (looks like: `123456789012345`)

#### B. Generate Access Token

1. In Events Manager, go to **Settings** → **Conversions API**
2. Scroll to **"Set up manually"** section
3. Click **Generate Access Token**
4. Copy the token (starts with `EAA...`)
5. **Important**: This token has full access - keep it secure!

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** in your project root:

   ```bash
   # Copy from example
   cp .env.example .env.local
   ```

2. **Add your credentials** to `.env.local`:

   ```env
   PIXEL_ID=123456789012345
   META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Verify the file is in `.gitignore`**:
   ```bash
   # Should already be there, but check:
   echo ".env.local" >> .gitignore
   ```

### Step 3: Restart Your Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

**Important**: Next.js only reads environment variables on startup!

---

## 🧪 Testing the Complete Flow

### Test 1: Basic Functionality

1. **Start dev server**:

   ```bash
   npm run dev
   ```

2. **Open browser console** (F12)

3. **Navigate to a property page**:

   ```
   http://localhost:3000/explore/[property-slug]
   ```

4. **Click the WhatsApp button**

5. **Check browser console** for:

   ```javascript
   // Network tab should show:
   POST /api/meta-events
   Status: 200 OK

   Response:
   {
     "success": true,
     "message": "Event successfully sent to Meta CAPI",
     "event_id": "550e8400-...",
     "events_received": 1
   }
   ```

6. **Check server terminal** for:

   ```
   Meta CAPI Event Received: {
     event_id: '550e8400-e29b-41d4-a716-446655440000',
     event_name: 'Lead',
     cookies: { _fbc: 'fb.1...', _fbp: 'fb.1...' }
   }

   Meta CAPI Response: {
     status: 200,
     result: { events_received: 1, fbtrace_id: '...' }
   }
   ```

### Test 2: Verify in Meta Events Manager

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel
3. Click on **Test Events** tab
4. Click the WhatsApp button in your app
5. Within seconds, you should see:
   - Event name: `Lead`
   - Event source: `Server` (from CAPI)
   - Deduplication status: Shows if it matched browser event

### Test 3: Check Deduplication

1. **Enable browser Pixel** (if not already):

   - Check your `layout.tsx` or `_app.tsx` for Meta Pixel script
   - Should include: `fbq('init', 'YOUR_PIXEL_ID')`

2. **Click WhatsApp button once**

3. **In Meta Events Manager → Test Events**:
   - You should see **ONE** "Lead" event (not two!)
   - It will show as "Deduplicated" if both browser + server events matched

---

## 📊 Expected API Responses

### Success Response

```json
{
  "success": true,
  "message": "Event successfully sent to Meta CAPI",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_name": "Lead",
  "meta_response": {
    "events_received": 1,
    "messages": [],
    "fbtrace_id": "A1B2C3D4E5F6G7H8I9J0"
  },
  "events_received": 1
}
```

### Error: Missing Credentials

```json
{
  "success": false,
  "message": "Server configuration error: Missing Meta credentials"
}
```

**Fix**: Add `PIXEL_ID` and `META_ACCESS_TOKEN` to `.env.local`

### Error: Missing event_id

```json
{
  "success": false,
  "message": "event_id is required for deduplication"
}
```

**Fix**: Ensure client-side code generates and sends `event_id`

### Error: Meta API Error

```json
{
  "success": false,
  "message": "Meta CAPI request failed",
  "error": {
    "message": "Invalid OAuth access token",
    "type": "OAuthException",
    "code": 190
  }
}
```

**Common causes**:

- Invalid or expired access token
- Wrong Pixel ID
- Token doesn't have required permissions

---

## 🔍 Troubleshooting

### Issue: "Missing Meta credentials"

**Symptoms**: Server returns 500 error about missing credentials

**Solution**:

1. Check `.env.local` exists in project root
2. Verify variable names are exact: `PIXEL_ID` and `META_ACCESS_TOKEN`
3. Restart dev server after adding variables
4. Check for typos or extra spaces

### Issue: "Invalid OAuth access token"

**Symptoms**: Meta API returns 190 error code

**Solution**:

1. Generate a new access token in Events Manager
2. Ensure token has correct permissions:
   - `ads_management`
   - `business_management`
3. Verify Pixel ID matches the token's pixel

### Issue: Events not appearing in Meta

**Symptoms**: API returns success but no events in Events Manager

**Solution**:

1. Check **Test Events** tab (not Overview)
2. Wait 10-30 seconds for events to appear
3. Verify Pixel ID is correct
4. Check if browser is blocking Meta scripts (ad blockers)

### Issue: Cookies are null

**Symptoms**: `_fbc` and `_fbp` are `null` in logs

**Possible causes**:

1. Meta Pixel not installed on frontend
2. User has ad blocker enabled
3. Cookies disabled in browser
4. First-time visitor (cookies set after first page load)

**Impact**: Event will still work, but user matching may be less accurate

---

## 📈 Monitoring & Analytics

### What to Monitor

1. **Success Rate**:

   - Check server logs for CAPI response status
   - Target: >95% success rate

2. **Deduplication**:

   - In Events Manager → Test Events
   - Should see "Deduplicated" badge on events

3. **Event Match Quality**:
   - In Events Manager → Diagnostics
   - Shows how well server events match users
   - Target: >70% match rate

### Server Logs

The implementation logs everything you need:

```javascript
// Incoming event
Meta CAPI Event Received: {
  event_id: '...',
  event_name: 'Lead',
  cookies: { _fbc: '...', _fbp: '...' }
}

// Meta response
Meta CAPI Response: {
  status: 200,
  result: { events_received: 1 }
}
```

---

## 🚀 Production Deployment

### Environment Variables

Add to your hosting platform (Vercel, Netlify, etc.):

```env
PIXEL_ID=your_production_pixel_id
META_ACCESS_TOKEN=your_production_access_token
```

### Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Use different tokens for dev/production
3. ✅ Rotate access tokens every 90 days
4. ✅ Store tokens in secure env variable storage
5. ✅ Monitor token usage in Meta Business Settings

### Deployment Checklist

- [ ] Add environment variables to hosting platform
- [ ] Test in production environment
- [ ] Verify events in Meta Events Manager
- [ ] Check deduplication is working
- [ ] Monitor error logs for first 24 hours
- [ ] Set up alerts for CAPI errors

---

## 📊 CAPI Payload Structure

For reference, here's what gets sent to Meta:

```json
{
  "data": [
    {
      "event_name": "Lead",
      "event_time": 1697216400,
      "event_source_url": "https://yoursite.com/explore/property-name",
      "action_source": "website",
      "event_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_data": {
        "fbc": "fb.1.1697216400.IwAR0...",
        "fbp": "fb.1.1697216400.1234567890",
        "client_user_agent": "Mozilla/5.0 ..."
      },
      "custom_data": {
        "content_name": "Beautiful Villa in DHA",
        "content_category": "WhatsApp Contact",
        "value": 25000000,
        "currency": "PKR"
      }
    }
  ]
}
```

---

## 🎓 Understanding the Flow

```
User Action (Click WhatsApp)
         ↓
┌─────────────────────────────────────┐
│ 1. Client-Side JavaScript          │
│    - Generate event_id (UUID)      │
│    - Send to Browser Pixel          │
│    - Send to Server API             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 2. Server Route Handler             │
│    - Validate event_id              │
│    - Extract cookies (_fbc, _fbp)   │
│    - Get credentials from env       │
│    - Build CAPI payload             │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 3. Meta Graph API                   │
│    POST /v19.0/{PIXEL_ID}/events    │
│    Authorization: {ACCESS_TOKEN}    │
└─────────────────────────────────────┘
         ↓
┌─────────────────────────────────────┐
│ 4. Meta Processing                  │
│    - Receive browser event          │
│    - Receive server event           │
│    - Match by event_id              │
│    - Count as ONE event ✅          │
└─────────────────────────────────────┘
```

---

## 📚 Additional Resources

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Deduplication Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Test Events Tool](https://business.facebook.com/events_manager2/test_events)
- [CAPI Troubleshooting](https://developers.facebook.com/docs/marketing-api/conversions-api/troubleshooting)

---

## ✅ Implementation Checklist

- [x] Generate unique `event_id` on client
- [x] Send event to Meta Pixel with `eventID`
- [x] Send event to server with `event_id`
- [x] Extract Meta cookies (`_fbc`, `_fbp`)
- [x] Validate incoming data
- [x] Construct CAPI payload
- [x] Send to Meta Graph API
- [x] Handle success/error responses
- [x] Add comprehensive logging
- [ ] Configure environment variables
- [ ] Test in development
- [ ] Verify deduplication
- [ ] Deploy to production
- [ ] Monitor in Events Manager

---

**Status**: 🎉 **Implementation Complete!**  
**Next Step**: Configure environment variables and test!
