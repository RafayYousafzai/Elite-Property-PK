# 🧪 Meta CAPI Test Events Guide

## 📋 Overview

Meta provides a **Test Events** feature to verify your CAPI integration before going live. This guide shows you exactly how to test your implementation.

---

## 🎯 Step-by-Step Testing Instructions

### Step 1: Get Your Test Event Code

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your Pixel from the left sidebar
3. Click on **"Test Events"** tab
4. Copy your unique test code (looks like: `TEST99562`)

### Step 2: Add Test Code to Environment

1. **Open your `.env.local` file**
2. **Add the test code**:
   ```env
   PIXEL_ID=123456789012345
   META_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
   META_TEST_EVENT_CODE=TEST99562
   ```
   ⚠️ Replace `TEST99562` with YOUR actual test code from Meta!

### Step 3: Restart Development Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

**Important**: Next.js only reads environment variables on startup!

### Step 4: Keep Test Events Page Open

⚠️ **Critical**: Keep the **Test Events page open** in Meta Events Manager during testing. Meta needs this page to be active to receive test events.

### Step 5: Trigger a Test Event

1. **Open your website** in a browser
2. **Open browser console** (F12) to see any errors
3. **Navigate to a property page**:
   ```
   http://localhost:3000/explore/[property-slug]
   ```
4. **Click the WhatsApp button**

### Step 6: Verify in Meta Events Manager

Within **5-10 seconds**, you should see:

✅ **Event appears** in the Test Events list  
✅ **Event name**: "Lead"  
✅ **Source**: "Server"  
✅ **Status**: Green checkmark ✓

---

## 📊 What You Should See

### In Your Server Terminal

```bash
🧪 Running in TEST MODE with code: TEST99562

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

### In Browser Console (Network Tab)

```json
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

### In Meta Events Manager (Test Events Tab)

```
┌─────────────────────────────────────────────────┐
│ ✓ Lead                                          │
│   Server • Just now                             │
│   event_id: 550e8400-...                        │
│   Deduplication: Matched with browser event     │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Detailed Test Event Information

When you click on the event in Meta Events Manager, you should see:

### Event Details

- **Event Name**: Lead
- **Event Time**: Current timestamp
- **Event Source URL**: Your property page URL
- **Action Source**: website

### User Data

- **fbc**: Your click ID cookie (or null)
- **fbp**: Your browser ID cookie (or null)
- **client_user_agent**: Your browser's user agent string

### Custom Data

- **content_name**: Property name
- **content_category**: "WhatsApp Contact"
- **value**: Property price/rate
- **currency**: "PKR"

---

## ✅ Testing Checklist

Use this checklist to verify everything is working:

- [ ] Test code copied from Meta Events Manager
- [ ] `META_TEST_EVENT_CODE` added to `.env.local`
- [ ] Development server restarted
- [ ] Test Events page kept open in Meta Events Manager
- [ ] WhatsApp button clicked
- [ ] Event appears in Test Events within 10 seconds
- [ ] Event shows green checkmark (success)
- [ ] Event details match expected data
- [ ] Server logs show test mode message
- [ ] No errors in browser console
- [ ] No errors in server terminal

---

## 🐛 Troubleshooting

### Issue 1: Events Not Appearing in Test Events

**Symptoms**: Clicked button but nothing shows in Meta Events Manager

**Solutions**:

1. **Check Test Events page is open**:

   - Must be actively open in browser
   - Don't minimize or switch tabs

2. **Verify test code is correct**:

   ```bash
   # Check your .env.local
   cat .env.local | grep TEST
   ```

   Should show: `META_TEST_EVENT_CODE=TEST99562`

3. **Check server logs**:

   ```bash
   # Should see this line:
   🧪 Running in TEST MODE with code: TEST99562
   ```

   If missing, test code not loaded → restart server

4. **Wait a bit longer**:
   - Can take up to 30 seconds
   - Refresh the Test Events page

### Issue 2: "Invalid Test Event Code" Error

**Symptoms**: Meta returns error about invalid test code

**Solutions**:

1. **Get fresh test code**:

   - Test codes expire after some time
   - Go to Events Manager → Test Events
   - Copy the new code

2. **Check for typos**:

   - No spaces before/after code
   - Exact case match
   - Example: `TEST99562` not `test99562`

3. **Update .env.local**:

   ```env
   META_TEST_EVENT_CODE=TEST99562
   ```

4. **Restart server**:
   ```bash
   npm run dev
   ```

### Issue 3: Event Shows "Failed" or Red X

**Symptoms**: Event appears but marked as failed

**Solutions**:

1. **Check Meta API response in logs**:

   ```bash
   Meta CAPI Response: {
     status: 400,  # ← Error status
     result: { error: { message: "..." } }
   }
   ```

2. **Common errors**:

   - **Invalid access token**: Generate new one
   - **Wrong Pixel ID**: Verify in Events Manager
   - **Missing required fields**: Check payload structure

3. **Verify payload structure**:
   - Click on failed event in Test Events
   - Check "Event Details" section
   - Look for missing or invalid fields

### Issue 4: Test Mode Not Activating

**Symptoms**: No "🧪 Running in TEST MODE" message in logs

**Solutions**:

1. **Verify .env.local has test code**:

   ```env
   META_TEST_EVENT_CODE=TEST99562
   ```

2. **Check file is in correct location**:

   - Must be in project root
   - Same directory as `package.json`

3. **Restart server properly**:

   ```bash
   # Kill all Node processes
   # Then start fresh
   npm run dev
   ```

4. **Print env var to verify**:
   ```bash
   node -e "console.log('Test Code:', process.env.META_TEST_EVENT_CODE)"
   ```

---

## 🎓 Understanding Test Events

### What is a Test Event Code?

- A unique identifier (e.g., `TEST99562`)
- Used to mark events as "test" vs "production"
- Allows you to test without affecting real data
- Required for Test Events page to capture events

### How Test Events Work

```
Your Server
    ↓
Send event with test_event_code: "TEST99562"
    ↓
Meta receives event
    ↓
Meta checks: "This has a test code"
    ↓
Routes to Test Events (not production data)
    ↓
Shows in Test Events page (if open)
```

### Test vs Production

| Aspect               | Test Events             | Production Events |
| -------------------- | ----------------------- | ----------------- |
| Code included        | Yes (`test_event_code`) | No                |
| Affects real data    | ❌ No                   | ✅ Yes            |
| Shows in Test Events | ✅ Yes                  | ❌ No             |
| Shows in Overview    | ❌ No                   | ✅ Yes            |
| Affects ads          | ❌ No                   | ✅ Yes            |

---

## 🚀 After Testing: Remove Test Code

Once you've verified everything works:

### Step 1: Remove or Comment Out Test Code

**In `.env.local`**:

```env
# Test code - DISABLED for production
# META_TEST_EVENT_CODE=TEST99562
```

Or simply delete the line:

```env
PIXEL_ID=123456789012345
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
# META_TEST_EVENT_CODE removed for production
```

### Step 2: Restart Server

```bash
npm run dev
```

### Step 3: Verify Production Mode

**Check server logs** - should NOT see:

```bash
🧪 Running in TEST MODE with code: TEST99562
```

If you still see this message, the test code is still active!

### Step 4: Test Production Events

1. Click WhatsApp button
2. Check **Overview tab** (not Test Events)
3. Events should appear in production data

---

## 🔄 Quick Test Workflow

### Complete Test in 2 Minutes

```bash
# 1. Add test code to .env.local
echo "META_TEST_EVENT_CODE=TEST99562" >> .env.local

# 2. Restart server
npm run dev

# 3. Open Meta Events Manager → Test Events (keep open!)

# 4. Open your website and click WhatsApp button

# 5. Check Test Events page (should see event within 10 seconds)

# 6. Remove test code when done
# Edit .env.local and remove/comment the test code line

# 7. Restart server for production
npm run dev
```

---

## 📊 Test Event Payload Example

Here's what gets sent to Meta during testing:

```json
{
  "data": [
    {
      "event_name": "Lead",
      "event_time": 1697216400,
      "event_source_url": "http://localhost:3000/explore/villa-dha",
      "action_source": "website",
      "event_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_data": {
        "fbc": "fb.1.1697216400.IwAR0...",
        "fbp": "fb.1.1697216400.1234567890",
        "client_user_agent": "Mozilla/5.0..."
      },
      "custom_data": {
        "content_name": "Beautiful Villa in DHA",
        "content_category": "WhatsApp Contact",
        "value": 25000000,
        "currency": "PKR"
      }
    }
  ],
  "test_event_code": "TEST99562" // ← This makes it a test event
}
```

---

## ✅ Success Indicators

Your test is successful when you see:

1. ✅ **Server logs show**:

   - "🧪 Running in TEST MODE"
   - "Meta CAPI Response: { status: 200 }"

2. ✅ **Browser shows**:

   - Network request returns 200 OK
   - Response has `"success": true`

3. ✅ **Meta Events Manager shows**:
   - Event in Test Events list
   - Green checkmark ✓
   - All data fields populated correctly

---

## 🎉 Next Steps After Successful Test

Once your test events are working:

1. ✅ Remove test event code from `.env.local`
2. ✅ Deploy to production
3. ✅ Add production env vars to hosting platform
4. ✅ Monitor real events in Overview tab
5. ✅ Check deduplication is working
6. ✅ Verify match quality in Diagnostics

---

## 📚 Additional Resources

- [Meta Test Events Documentation](https://www.facebook.com/business/help/2040882565962601)
- [CAPI Troubleshooting Guide](https://developers.facebook.com/docs/marketing-api/conversions-api/troubleshooting)
- [Test Events Best Practices](https://www.facebook.com/business/help/444614543434054)

---

**Last Updated**: October 13, 2025  
**Status**: Ready for testing with Meta Test Events  
**Your Test Code**: TEST99562 (replace with your actual code!)
