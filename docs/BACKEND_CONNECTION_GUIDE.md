# Backend Connection Guide

## Issue

The app is showing timeout errors when trying to login, register, or reset password because it cannot connect to the backend API server.

## Error Messages You'll See

- "Connection timeout. Please check your internet connection and try again."
- "Unable to connect to server. Please check your internet connection."

## Solution

### Step 1: Check Your Environment Variables

1. Open the `.env` file in the root directory of the mobile app
2. Make sure it contains:

   ```
   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000
   EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_here
   ```

3. **Important**: Replace `192.168.1.4` with your actual backend server IP address
   - If backend is on the same machine: Use your local IP (not `localhost` or `127.0.0.1`)
   - To find your IP:
     - **Windows**: Open Command Prompt and run `ipconfig`, look for "IPv4 Address"
     - **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`

### Step 2: Start Your Backend Server

1. Navigate to the backend directory:

   ```bash
   cd backend-main
   ```

2. Make sure you have a `.env` file in `backend-main/` with:

   ```
   PORT=8000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. Install dependencies (if not already done):

   ```bash
   npm install
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

5. Verify the server is running by opening a browser and going to:
   ```
   http://localhost:8000
   ```
   or
   ```
   http://YOUR_IP_ADDRESS:8000
   ```

### Step 3: Restart the Mobile App

1. Stop the Expo server (Ctrl+C in the terminal)

2. Clear the cache and restart:

   ```bash
   npx expo start --clear
   ```

3. Press `i` for iOS or `a` for Android to reload the app

### Step 4: Test the Connection

1. Try to login, register, or reset password
2. You should now see proper responses from the backend instead of timeout errors

## Troubleshooting

### Still Getting Timeout Errors?

1. **Check Firewall**: Make sure your firewall isn't blocking port 8000

   - Windows: Go to Windows Defender Firewall → Allow an app
   - Mac: System Preferences → Security & Privacy → Firewall

2. **Check Network**: Make sure both your phone/simulator and backend are on the same network

   - For iOS Simulator: Should work with localhost
   - For physical device: Must be on same WiFi network

3. **Check Backend Logs**: Look at the backend terminal for any errors

4. **Test Backend Directly**: Use a tool like Postman or curl to test the backend:
   ```bash
   curl -X POST http://YOUR_IP:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

### Backend Not Starting?

1. Check if port 8000 is already in use:

   ```bash
   # Windows
   netstat -ano | findstr :8000

   # Mac/Linux
   lsof -i :8000
   ```

2. Check database connection in backend logs

3. Verify all environment variables are set correctly

## What We Fixed

1. **Added timeout handling** (15 seconds) to prevent indefinite waiting
2. **Better error messages** that explain what went wrong
3. **Network error detection** to distinguish between timeout and connection issues
4. **User-friendly alerts** instead of technical error messages

## Next Steps

Once the backend is running and connected:

- Login should work
- Registration should work
- Password reset should work
- All API calls will have proper timeout and error handling

If you continue to have issues, please check:

1. Backend server logs
2. Mobile app console logs
3. Network connectivity between devices
