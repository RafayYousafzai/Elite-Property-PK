# 🚀 Quick Test Guide - Meta CAPI

## Prerequisites Checklist

- [ ] `.env.local` file created
- [ ] `PIXEL_ID` added to `.env.local`
- [ ] `META_ACCESS_TOKEN` added to `.env.local`
- [ ] Dev server restarted after adding env vars

---

## 🧪 5-Minute Test

### 1. Terminal Setup

```bash
# Open terminal in project root
npm run dev
```

### 2. Open Browser Console (F12)

- Go to **Console** tab (for logs)
- Go to **Network** tab (to monitor API calls)

### 3. Navigate to Property Page

```
http://localhost:3000/explore/[any-property-slug]
```

### 4. Click WhatsApp Button

### 5. Check Results

#### ✅ Browser Console (Network Tab)

```
Request:
POST /api/meta-events

Response (200 OK):
{
  "success": true,
  "message": "Event successfully sent to Meta CAPI",
  "event_id": "550e8400-...",
  "events_received": 1
}
```

#### ✅ Server Terminal

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

#### ✅ Meta Events Manager

1. Go to: https://business.facebook.com/events_manager2
2. Click **Test Events** tab
3. Within 10-30 seconds, see:
   - Event: **Lead**
   - Source: **Server**
   - Status: **Received** ✅

---

## ❌ Common Issues & Quick Fixes

### Issue 1: "Missing Meta credentials"

```json
{
  "success": false,
  "message": "Server configuration error: Missing Meta credentials"
}
```

**Fix**:

```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. Verify contents
cat .env.local

# 3. Should contain:
PIXEL_ID=123456789012345
META_ACCESS_TOKEN=EAAxxxxxxxxx

# 4. Restart server
npm run dev
```

### Issue 2: "Invalid OAuth access token"

```json
{ "error": { "code": 190, "message": "Invalid OAuth access token" } }
```

**Fix**:

1. Go to Meta Events Manager → Settings → Conversions API
2. Generate new access token
3. Copy and paste into `.env.local`
4. Restart server

### Issue 3: Cookies are null

```json
{ "cookies": { "_fbc": null, "_fbp": null } }
```

**Impact**: Still works! Just less accurate user matching.

**Causes**:

- First-time visitor (normal)
- Ad blocker enabled
- Meta Pixel not installed on frontend

---

## 🎯 What Success Looks Like

### Perfect Response

```json
{
  "success": true,
  "message": "Event successfully sent to Meta CAPI",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "event_name": "Lead",
  "meta_response": {
    "events_received": 1,
    "fbtrace_id": "A1B2C3D4E5F6G7H8I9J0"
  },
  "events_received": 1
}
```

### Key Indicators

- ✅ `success: true`
- ✅ `events_received: 1`
- ✅ `fbtrace_id` present
- ✅ `event_id` matches across browser & server logs

---

## 📊 Deduplication Verification

### How to Verify It's Working

1. **Install Meta Pixel Helper** (Chrome Extension)
2. **Visit property page**
3. **Click WhatsApp button**
4. **In Meta Events Manager → Test Events**:
   - See **ONE** event (not two)
   - Badge says **"Deduplicated"** or **"Server Event"**

### What Deduplication Looks Like

```
Browser Pixel Event:
  event_name: Lead
  eventID: 550e8400-...

Server CAPI Event:
  event_name: Lead
  event_id: 550e8400-...

Meta's Result: ✅ Same event_id → Count as ONE
```

---

## 🔧 Environment Variable Reference

### .env.local Template

```env
# Meta Pixel ID (15-16 digits)
PIXEL_ID=123456789012345

# Meta Access Token (long string starting with EAA)
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Where to Find These

**PIXEL_ID**:

1. Meta Events Manager
2. Select your Pixel
3. Settings → Setup
4. Copy the number

**META_ACCESS_TOKEN**:

1. Meta Events Manager
2. Settings → Conversions API
3. Click "Generate Access Token"
4. Copy the token (starts with `EAA`)

---

## 📝 Test Checklist

- [ ] Environment variables configured
- [ ] Server restarted
- [ ] Browser console open
- [ ] Network tab monitoring
- [ ] WhatsApp button clicked
- [ ] Response status 200
- [ ] `events_received: 1` in response
- [ ] Server logs show event
- [ ] Meta Events Manager shows event
- [ ] Deduplication working (1 event, not 2)

---

## 🎉 Success!

If you see all ✅ above, your Meta CAPI is **fully functional**!

**What happens now**:

- Every WhatsApp click = 1 Lead event to Meta
- Browser + Server events deduplicated
- Accurate conversion tracking
- Better ad optimization

---

## 📞 Need Help?

### Debug Steps

1. Check server logs for errors
2. Verify environment variables
3. Test access token in Meta Events Manager
4. Check browser console for client errors
5. Review `META_CAPI_COMPLETE_SETUP.md` for details

### Quick Test Command

```bash
# Print environment variables (without showing values)
node -e "console.log('PIXEL_ID:', process.env.PIXEL_ID ? '✅ Set' : '❌ Missing')"
node -e "console.log('META_ACCESS_TOKEN:', process.env.META_ACCESS_TOKEN ? '✅ Set' : '❌ Missing')"
```

---

**Last Updated**: Implementation complete with full CAPI integration
**Status**: ✅ Ready for production deployment
