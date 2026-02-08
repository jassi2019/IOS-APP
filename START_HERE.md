# 🚀 Quick Start Guide - Fix Timeout Errors

## Your Current Setup ✅

- **Your IP Address**: `192.168.1.4`
- **Backend URL**: `http://192.168.1.4:8000`
- **Your .env file**: Already configured correctly!

## The Problem

You're getting timeout errors because either:

1. Backend server is not running, OR
2. Expo cache needs to be cleared, OR
3. Phone and computer are not on the same WiFi network

## Solution - Follow These Steps Exactly:

### Step 1: Start Backend Server

Open a **NEW terminal** (keep it running) and run:

```powershell
cd backend-main
npm start
```

**Expected Output:**

```
Server is running on port 8000
Local: http://localhost:8000
Network: http://192.168.1.4:8000
```

✅ **Keep this terminal running!** Don't close it.

---

### Step 2: Clear Expo Cache and Restart

In your **main terminal**, run:

```powershell
npx expo start --clear
```

Wait for the QR code to appear.

---

### Step 3: Test on Your Phone

1. **Make sure your phone is on the SAME WiFi as your computer**
2. Open Expo Go app
3. Scan the QR code
4. Wait for the app to load

---

### Step 4: Test the Registration

1. Go to Register screen
2. Enter an email address
3. Click Submit
4. **Watch both terminals for logs**

**What to look for:**

- In Expo terminal: You should see the API request
- In Backend terminal: You should see the incoming request
- Timeout should now be 30 seconds (not 15)

---

## Still Getting Errors?

### Quick Checks:

**Check 1: Is backend running?**

```powershell
# Open browser and go to:
http://192.168.1.4:8000
```

You should see the backend response.

**Check 2: Can your phone reach the backend?**

- Open Safari/Chrome on your phone
- Go to: `http://192.168.1.4:8000`
- If it doesn't load, your phone can't reach your computer

**Check 3: Are you on the same WiFi?**

- Computer WiFi: Check your WiFi name
- Phone WiFi: Check your phone's WiFi name
- They MUST be the same!

**Check 4: Is Windows Firewall blocking?**

```powershell
# Temporarily disable firewall to test
# Windows Security > Firewall > Turn off (for testing only)
```

---

## Alternative: Use Production Backend

If you can't get local backend working, use the production server:

1. Stop Expo (Ctrl+C)
2. Update `.env` file:

```
EXPO_PUBLIC_BACKEND_URL=https://api.taiyarineetki.com
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_6DyKHgPSSjdRTe
```

3. Restart Expo:

```powershell
npx expo start --clear
```

This will use the live production server instead.

---

## What Changed in the Code?

✅ **Timeout increased**: 15 seconds → 30 seconds
✅ **More retries**: 2 attempts → 3 attempts  
✅ **Better error messages**: Shows specific troubleshooting steps
✅ **Longer retry delays**: 2s, 4s, 8s between attempts

---

## Expected Behavior Now:

### Before Fix:

- ❌ Timeout after 15 seconds
- ❌ Generic error: "Network Error"
- ❌ No retry information

### After Fix:

- ✅ Timeout after 30 seconds
- ✅ Specific error: "Connection timeout. Please check your internet connection."
- ✅ Shows retry attempts in logs
- ✅ Better troubleshooting guidance

---

## Common Error Messages:

### "timeout of 30000ms exceeded"

✅ **Good!** This means the fix is working (30s timeout)
❌ **Problem:** Backend is not reachable
**Solution:** Check if backend is running and accessible

### "timeout of 15000ms exceeded"

❌ **Problem:** Changes didn't apply
**Solution:** Run `npx expo start --clear` to clear cache

### "Network Error"

❌ **Problem:** Cannot reach backend at all
**Solution:** Check WiFi connection and backend URL

---

## Need More Help?

1. **Copy the exact error message** from the terminal
2. **Check what URL** the app is trying to connect to (shown in logs)
3. **Verify backend is running** (check backend terminal)
4. **Test backend URL** in your phone's browser

---

## Quick Commands Reference:

```powershell
# Start backend (in separate terminal)
cd backend-main
npm start

# Start Expo with cache clear
npx expo start --clear

# Check your IP address
node scripts/setup-expo-go.js

# Test backend from command line
curl http://192.168.1.4:8000/health
```

---

**Still stuck?** Share the exact error message and I'll help you debug it!
