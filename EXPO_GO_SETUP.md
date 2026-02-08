# Expo Go Setup Guide - Fix Backend Connection

## Problem

When using Expo Go on a physical device, the app cannot connect to `localhost` or `127.0.0.1` because those addresses refer to the phone itself, not your computer.

## Solution

### Step 1: Find Your Computer's IP Address

**On Windows:**

1. Open Command Prompt (cmd)
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter (WiFi or Ethernet)
4. It will look like: `192.168.1.4` or `192.168.0.10` or similar

**Example Output:**

```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.4
```

### Step 2: Update Your Environment Configuration

You have two options:

#### Option A: Create/Update .env file (Recommended for Development)

1. Create a file named `.env` in the root directory (if it doesn't exist)
2. Add this line (replace with YOUR IP address):

```
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yKCG6OGi329xSM
```

3. **Important**: Replace `192.168.1.4` with YOUR actual IP address from Step 1

#### Option B: Update eas.json (Already configured)

Your `eas.json` already has the development configuration. Just make sure you're using the development build or update the URL there.

### Step 3: Restart Expo

1. Stop Expo (Ctrl+C in terminal)
2. Clear cache and restart:

```bash
npx expo start --clear
```

3. Scan the QR code again with Expo Go

### Step 4: Start Backend Server

Make sure your backend is running:

```bash
cd backend-main
npm start
```

You should see:

```
Server is running on port 8000
Local: http://localhost:8000
Network: http://192.168.1.4:8000
```

### Step 5: Test the Connection

1. Open the app in Expo Go
2. Try to register with an email
3. Check the terminal for logs

**Expected Behavior:**

- Request should take up to 30 seconds (not 15)
- You should see retry attempts if it fails
- Error messages should be more helpful

## Troubleshooting

### Still Getting Timeout Errors?

**Check 1: Are you on the same WiFi network?**

- Your phone and computer MUST be on the same WiFi network
- Disable mobile data on your phone
- Make sure you're not on a guest network

**Check 2: Is the backend running?**

```bash
# Test if backend is accessible
curl http://YOUR_IP:8000/health
# Example: curl http://192.168.1.4:8000/health
```

**Check 3: Firewall blocking?**

- Windows Firewall might be blocking port 8000
- Temporarily disable firewall to test
- Or add an exception for Node.js

**Check 4: Check the app logs**
In Expo Go terminal, you should see:

```
📤 [req_xxx] POST /api/v1/auth/register/email/verification
   timeout: 30000ms
```

If you see `timeout: 15000ms`, the changes didn't apply - restart Expo with `--clear`

### Quick Test Commands

**Test 1: Check if backend is reachable from your phone's network**

```bash
# On your computer
curl http://YOUR_IP:8000/health
```

**Test 2: Check what URL the app is using**
Look at the Expo terminal logs when you submit the form. It should show the request URL.

## Common Mistakes

❌ **Wrong**: `http://localhost:8000`
❌ **Wrong**: `http://127.0.0.1:8000`
✅ **Correct**: `http://192.168.1.4:8000` (your actual IP)

❌ **Wrong**: Phone on mobile data, computer on WiFi
✅ **Correct**: Both on same WiFi network

❌ **Wrong**: Backend not running
✅ **Correct**: Backend running and showing "Server is running on port 8000"

## Still Not Working?

If you've tried everything above and it still doesn't work:

1. **Copy the exact error message** from the terminal
2. **Check what URL** the app is trying to connect to (shown in logs)
3. **Verify your IP address** hasn't changed (run `ipconfig` again)
4. **Try using a different network** (mobile hotspot, different WiFi)

## Alternative: Use Production Backend

If you can't get local backend working, you can temporarily use the production backend:

1. Update `.env`:

```
EXPO_PUBLIC_BACKEND_URL=https://api.taiyarineetki.com
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_6DyKHgPSSjdRTe
```

2. Restart Expo:

```bash
npx expo start --clear
```

This will connect to the live production server instead of your local one.

---

**Need More Help?**
Share the exact error message and I can provide more specific guidance!
