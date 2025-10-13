# 🎯 Quick Reference - Event Tracking

## Current Events Being Tracked

### 1. **ViewContent** - Property Page Views ✅ NEW!

**Fires when**: User opens any property details page

**Data tracked**:

- Property name
- Property type (House, Plot, etc.)
- Property value (price)
- Property ID

**Use for**:

- Tracking popular properties
- Building retargeting audiences
- Understanding buyer interests

---

### 2. **Lead** - Contact Button Clicks ✅

**Fires when**: User clicks WhatsApp button

**Data tracked**:

- Property name
- Contact method (WhatsApp)
- Property value

**Use for**:

- Tracking conversions
- Measuring ad effectiveness
- Lead generation optimization

---

## 🧪 Quick Test

### Test ViewContent Event:

```bash
# 1. Start server
npm run dev

# 2. Open any property page
http://localhost:3000/explore/[property-slug]

# 3. Check server logs
Should see: ViewContent event received ✅
```

### Test Lead Event:

```bash
# 1. Open property page
# 2. Click WhatsApp button
# 3. Check server logs
Should see: Lead event received ✅
```

---

## 📊 View Events in Meta

1. Go to: https://business.facebook.com/events_manager2
2. Click **Test Events** (for testing) or **Overview** (production)
3. Look for:
   - **ViewContent** - Property views
   - **Lead** - Contact clicks

---

## 🎯 Event Flow

```
Property Page Opens
    ↓
ViewContent event sent ✅
    ↓
User scrolls, reads details
    ↓
User clicks WhatsApp
    ↓
Lead event sent ✅
```

---

## 📈 Both Events Use:

✅ Unique `event_id` (deduplication)  
✅ Browser Pixel tracking  
✅ Server CAPI tracking  
✅ IP address + User agent  
✅ Property details in custom data

---

**Status**: Both events working and production ready! 🚀
