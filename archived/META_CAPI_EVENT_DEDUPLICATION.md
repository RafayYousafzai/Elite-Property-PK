# Meta CAPI Event Deduplication Implementation

## 🎯 What We've Built

A complete event tracking system that prevents double-counting of user actions when using both Meta Pixel (browser-side) and Meta Conversions API (server-side).

---

## 🔑 The Key Concept: Event Deduplication

### The Problem

When a user clicks the WhatsApp button:

- **Browser Pixel** sends a "Lead" event to Meta → Counted as 1 lead
- **Server CAPI** sends the same "Lead" event to Meta → Counted as another lead
- **Result**: Meta counts 2 leads instead of 1 ❌

### The Solution: Unique Event ID

Both the browser and server send the **same unique `event_id`** with their events:

- Browser sends Lead event with `event_id: "abc-123-def"`
- Server sends Lead event with `event_id: "abc-123-def"`
- **Result**: Meta recognizes it's the same event and counts only 1 lead ✅

---

## 🛠️ Implementation Details

### 1. **UUID Generation** (Client-Side)

**Location**: `src/app/(site)/explore/[id]/page.tsx` (WhatsApp Button)

```typescript
const eventId = crypto.randomUUID();
```

**What is `crypto.randomUUID()`?**

- A built-in JavaScript method (available in all modern browsers)
- Generates a universally unique identifier (UUID)
- Example output: `"550e8400-e29b-41d4-a716-446655440000"`
- **Secure**: Cryptographically random, impossible to guess
- **Unique**: Practically guaranteed to never repeat

### 2. **Browser Pixel Event** (Client-Side)

```typescript
if (typeof window !== "undefined" && window.fbq) {
  window.fbq(
    "track",
    "Lead",
    {
      content_name: property.name,
      content_category: "WhatsApp Contact",
      value: parseFloat(property.rate.replace(/[^0-9.-]+/g, "")) || 0,
      currency: "PKR",
    },
    {
      eventID: eventId, // 🔑 Deduplication key
    }
  );
}
```

### 3. **Server CAPI Event** (Client-Side → Server)

```typescript
await fetch("/api/meta-events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    event_name: "Lead",
    event_id: eventId, // 🔑 Same ID for deduplication
    event_time: Math.floor(Date.now() / 1000),
    user_data: {
      client_user_agent: navigator.userAgent,
    },
    custom_data: {
      content_name: property.name,
      content_category: "WhatsApp Contact",
      value: parseFloat(property.rate.replace(/[^0-9.-]+/g, "")) || 0,
      currency: "PKR",
    },
  }),
});
```

### 4. **Route Handler** (Server-Side)

**Location**: `src/app/api/meta-events/route.js`

**Key Features**:

- ✅ Validates `event_id` is present
- ✅ Extracts Meta Pixel cookies (`_fbc`, `_fbp`)
- ✅ Logs complete event data
- ✅ Returns comprehensive response for verification

---

## 📊 Data Flow Diagram

```
User Clicks WhatsApp Button
         ↓
┌────────────────────────────────────────┐
│  1. Generate UUID                      │
│     event_id = crypto.randomUUID()     │
│     → "550e8400-e29b-41d4-a716..."     │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  2. Send to Browser Pixel              │
│     window.fbq('track', 'Lead', {...}, │
│       { eventID: eventId })            │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  3. Send to Server API                 │
│     POST /api/meta-events              │
│     { event_id: eventId, ... }         │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  4. Server Extracts Data               │
│     - Validates event_id               │
│     - Reads _fbc & _fbp cookies        │
│     - Prepares for CAPI                │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│  5. Both Events Reach Meta             │
│     Browser Event: eventID = "550e..." │
│     Server Event:  event_id = "550e..." │
│     → Meta sees same ID = 1 event! ✅  │
└────────────────────────────────────────┘
```

---

## 🧪 How to Test

### Test the Complete Flow

1. **Open Developer Console** in your browser (F12)

2. **Navigate to a property details page**:

   ```
   http://localhost:3000/explore/[property-slug]
   ```

3. **Click the WhatsApp button**

4. **Check Console for**:

   - Browser: Meta Pixel event fired with `eventID`
   - Network: POST request to `/api/meta-events` with `event_id`

5. **Check Server Terminal for**:
   ```
   Meta CAPI Event Received: {
     event_id: '550e8400-...',
     event_name: 'Lead',
     cookies: { _fbc: '...', _fbp: '...' }
   }
   ```

### Expected Response from API

```json
{
  "success": true,
  "message": "Event received and ready for CAPI",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_name": "Lead",
  "cookies": {
    "_fbc": "fb.1.1234567890.IwAR0...",
    "_fbp": "fb.1.1234567890.1234567890"
  },
  "user_data": {
    "client_user_agent": "Mozilla/5.0..."
  },
  "custom_data": {
    "content_name": "Beautiful Villa in DHA",
    "content_category": "WhatsApp Contact",
    "value": 25000000,
    "currency": "PKR"
  },
  "note": "This event is ready to be sent to Meta CAPI with proper deduplication"
}
```

---

## ✅ What's Working Now

1. ✅ **UUID Generation**: Using `crypto.randomUUID()` for secure, unique IDs
2. ✅ **Browser Pixel Tracking**: Sending events with `eventID`
3. ✅ **Server Event Capture**: Receiving events with `event_id`
4. ✅ **Cookie Extraction**: Reading `_fbc` and `_fbp` from cookies
5. ✅ **Data Validation**: Ensuring `event_id` is present
6. ✅ **Error Handling**: Comprehensive try-catch blocks
7. ✅ **TypeScript Safety**: Proper type declarations for Meta Pixel

---

## 🚀 Next Steps

To complete the CAPI implementation, you'll need to:

1. **Add Meta CAPI SDK** or make direct API calls to Meta
2. **Hash user identifiers** (email, phone) using SHA-256
3. **Send the complete event** to Meta's Conversions API
4. **Include the same `event_id`** in the CAPI request

---

## 📝 Important Notes

### Why `crypto.randomUUID()`?

- **Standard**: Part of Web Crypto API (built into browsers)
- **Secure**: Uses cryptographically strong random values
- **Fast**: No external library needed
- **Reliable**: Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- **Format**: Returns RFC 4122 UUID (v4) like `"550e8400-e29b-41d4-a716-446655440000"`

### Cookie Data Extracted

- **`_fbc`**: Click ID cookie (from Facebook ad clicks)
- **`_fbp`**: Browser ID cookie (identifies user's browser)
- These help Meta match server events to specific users

---

## 🔍 Troubleshooting

### If `event_id` is missing:

```json
{
  "success": false,
  "message": "event_id is required for deduplication"
}
```

**Fix**: Ensure client-side code generates and sends the `event_id`

### If cookies are null:

```json
{
  "cookies": {
    "_fbc": null,
    "_fbp": null
  }
}
```

**Possible reasons**:

- User hasn't visited the site with Meta Pixel active
- Cookies blocked by browser
- Meta Pixel not installed/configured

---

## 📚 Additional Resources

- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Deduplication Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Web Crypto API - randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)

---

**Status**: ✅ Phase 1 Complete - Event Deduplication Infrastructure Ready
**Next**: Integrate actual Meta CAPI calls with the collected data
