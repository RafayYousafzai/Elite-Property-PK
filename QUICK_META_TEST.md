# 🧪 Quick Test - Meta CAPI

## ⚡ 2-Minute Setup

### 1. Add Test Code to `.env.local`

```env
PIXEL_ID=123456789012345
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
META_TEST_EVENT_CODE=TEST99562
```

👆 Replace `TEST99562` with YOUR test code from Meta Events Manager!

---

### 2. Restart Server

```bash
npm run dev
```

---

### 3. Keep Test Events Page Open

⚠️ **MUST keep this page open**: https://business.facebook.com/events_manager2/test_events

---

### 4. Test It!

1. Open your website: `http://localhost:3000/explore/[property]`
2. Click WhatsApp button
3. Wait 5-10 seconds
4. Check Test Events page

---

## ✅ Success Looks Like:

### In Server Terminal:

```
🧪 Running in TEST MODE with code: TEST99562
Meta CAPI Response: { status: 200 }
```

### In Meta Events Manager:

```
✓ Lead
  Server • Just now
  Status: Success
```

---

## ❌ Not Working?

### Events not appearing?

- [ ] Test Events page is open?
- [ ] Waited 30 seconds?
- [ ] Server restarted after adding test code?
- [ ] Test code copied correctly (no spaces)?

### Check server logs:

```bash
# Should see this:
🧪 Running in TEST MODE with code: TEST99562

# Not seeing it? Test code not loaded.
# Solution: Restart server
```

---

## 🎉 After Testing

### Remove test code from `.env.local`:

```env
PIXEL_ID=123456789012345
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
# META_TEST_EVENT_CODE=TEST99562  ← Comment out or delete
```

### Restart server:

```bash
npm run dev
```

---

## 📋 Quick Checklist

- [ ] Test code added to `.env.local`
- [ ] Server restarted
- [ ] Test Events page open in browser
- [ ] WhatsApp button clicked
- [ ] Event appears with green checkmark
- [ ] Test code removed after testing
- [ ] Server restarted for production

---

**Your Test Code**: `TEST99562` (get yours from Meta Events Manager)  
**Full Guide**: See `META_TEST_EVENTS_GUIDE.md` for details
