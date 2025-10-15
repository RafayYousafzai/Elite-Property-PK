# 🔧 Vercel Build Error - Troubleshooting Guide

## ❌ The Error

```
Build failed because of webpack errors
Error: Command "npm run build" exited with 1
```

## 🎯 Root Cause

The error is likely related to one of these issues:

1. **Tailwind CSS v4** - Vercel might not fully support the new `@import` syntax yet
2. **CSS Plugin** - The `@plugin './hero.ts'` in globals.css
3. **Package Resolution** - Webpack can't resolve CSS modules properly

---

## ✅ Solutions to Try

### Solution 1: Clear Vercel Cache (Recommended)

In your Vercel project settings:

1. Go to **Settings** → **General**
2. Find **"Clear Cache"** button
3. Click it and redeploy

Or use CLI:

```bash
vercel --force
```

### Solution 2: Add Vercel Build Settings

Create/update `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Solution 3: Update Build Command

In Vercel dashboard:

1. Go to **Settings** → **General**
2. **Build Command**: `npm run build`
3. **Install Command**: `npm install --legacy-peer-deps`

### Solution 4: Downgrade Tailwind CSS (If urgent)

If you need to deploy immediately, temporarily downgrade to Tailwind v3:

```bash
npm uninstall @tailwindcss/postcss
npm install tailwindcss@3 postcss autoprefixer
```

Then update `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

And `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 🧪 Test Locally First

Before deploying to Vercel:

### 1. Test Production Build Locally

```bash
npm run build
```

If this works locally but fails on Vercel, it's a Vercel-specific issue.

### 2. Check Node Version

Ensure Vercel uses the same Node version as your local:

Add `.nvmrc` in project root:

```
20.11.0
```

Or specify in `package.json`:

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 3. Clean Install

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🔍 Debugging Steps

### Check Vercel Build Logs

Look for specific error messages:

1. **Module not found** → Missing dependency
2. **Cannot resolve** → Path issue
3. **Webpack error** → Build configuration issue

### Common Issues:

#### Issue 1: CSS Module Resolution

**Error**: `Cannot find module './globals.css'`

**Fix**: Already handled with `src/types/css.d.ts`

#### Issue 2: Tailwind v4 Plugin

**Error**: Related to `@plugin './hero.ts'`

**Fix**: Ensure hero.ts is in the same directory as globals.css

#### Issue 3: PostCSS Configuration

**Error**: PostCSS plugin errors

**Fix**: Update postcss.config.mjs to include all required plugins

---

## 📝 Quick Fix Checklist

- [ ] Run `npm run build` locally (should work)
- [ ] Clear Vercel cache and redeploy
- [ ] Check Node version matches (add .nvmrc)
- [ ] Verify all dependencies in package.json
- [ ] Check vercel.json exists with proper config
- [ ] Review build logs for specific errors

---

## 🎯 Recommended Approach

### Step 1: Verify Local Build

```bash
npm run build
```

If this succeeds, the issue is Vercel-specific.

### Step 2: Clear Vercel Cache

```bash
vercel --force
```

### Step 3: If Still Failing

Add `.nvmrc`:

```bash
echo "20.11.0" > .nvmrc
git add .nvmrc
git commit -m "Add Node version for Vercel"
git push
```

### Step 4: Last Resort

Temporarily use Tailwind v3 (see Solution 4 above)

---

## 🆘 Current Status

| Component       | Status   | Notes                                  |
| --------------- | -------- | -------------------------------------- |
| CSS Declaration | ✅ Fixed | Added `src/types/css.d.ts`             |
| Imports Order   | ✅ Fixed | CSS import first                       |
| Analytics       | ✅ Fixed | Moved to layout.tsx                    |
| Tailwind v4     | ⚠️ Issue | Might not be fully supported on Vercel |

---

## 💡 Why This Happens

Vercel's build environment might:

- Use different Node version
- Have cached old dependencies
- Not fully support Tailwind CSS v4 yet
- Have different webpack configuration

---

## 🚀 Next Steps

1. **Try local build first**: `npm run build`
2. **If local works**, clear Vercel cache
3. **If still fails**, check Node version
4. **If urgent**, use Tailwind v3 temporarily

---

## 📚 Additional Resources

- [Vercel Build Troubleshooting](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Next.js CSS Import](https://nextjs.org/docs/app/building-your-application/styling/css)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)

---

**Created**: October 15, 2025  
**Issue**: Webpack build error on Vercel  
**Status**: Troubleshooting in progress
