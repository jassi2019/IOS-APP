# API Debugging Guide

Complete guide for debugging backend connectivity issues and API timeout errors in your React Native/Expo app.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Common Issues & Solutions](#common-issues--solutions)
3. [Testing Backend Connectivity](#testing-backend-connectivity)
4. [VS Code Terminal Commands](#vs-code-terminal-commands)
5. [Network Troubleshooting](#network-troubleshooting)
6. [Backend Server Setup](#backend-server-setup)
7. [Environment Configuration](#environment-configuration)
8. [Advanced Debugging](#advanced-debugging)

---

## Quick Diagnostics

### Step 1: Run Built-in Diagnostics

The app includes a comprehensive diagnostic tool. You can run it from your code:

```typescript
import apiTester from '@/lib/apiTester';

// Run full diagnostics
const result = await apiTester.runDiagnostics();
apiTester.printDiagnosticReport(result);

// Or quick test
const isReachable = await apiTester.quickTest();
```

### Step 2: Check Environment Variables

Verify your `.env` file in the project root:

```bash
# View .env file
cat .env

# Should contain:
EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:8000
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_key_here
```

### Step 3: Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:8000/health

# Or with your IP
curl http://192.168.1.4:8000/health
```

---

## Common Issues & Solutions

### Issue 1: "Request timeout" or "Timeout of 15000ms exceeded"

**Cause:** Backend server is not running or not reachable.

**Solutions:**

1. **Start the backend server:**

   ```bash
   cd backend-main
   npm start
   ```

2. **Verify backend is running:**

   ```bash
   # Should return 200 OK
   curl -I http://localhost:8000/health
   ```

3. **Check backend logs** for errors in the terminal where backend is running.

### Issue 2: "Unable to connect to server" or "Network Error"

**Cause:** Network connectivity issues or wrong backend URL.

**Solutions:**

1. **Check your IP address:**

   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   # or
   ip addr show
   ```

2. **Update .env with correct IP:**

   ```
   EXPO_PUBLIC_BACKEND_URL=http://YOUR_ACTUAL_IP:8000
   ```

3. **Restart Expo with cache clear:**
   ```bash
   npx expo start --clear
   ```

### Issue 3: Works on Simulator but not on Physical Device

**Cause:** Device and backend are on different networks.

**Solutions:**

1. **Ensure both are on same WiFi network**

   - Backend computer and phone must be on same WiFi
   - Corporate/public WiFi may block device-to-device communication

2. **Check firewall settings:**

   - Windows: Allow port 8000 through Windows Defender Firewall
   - Mac: System Preferences → Security & Privacy → Firewall → Firewall Options

3. **Use ngrok for testing (temporary solution):**

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Expose backend
   ngrok http 8000

   # Use the ngrok URL in .env
   EXPO_PUBLIC_BACKEND_URL=https://abc123.ngrok.io
   ```

### Issue 4: "ECONNREFUSED" Error

**Cause:** Backend server is not listening on the specified port.

**Solutions:**

1. **Check if port 8000 is in use:**

   ```bash
   # Windows
   netstat -ano | findstr :8000

   # Mac/Linux
   lsof -i :8000
   ```

2. **Kill process using the port (if needed):**

   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /PID <PID> /F

   # Mac/Linux
   kill -9 <PID>
   ```

3. **Start backend on different port:**
   ```bash
   PORT=8001 npm start
   ```
   Then update .env: `EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:8001`

---

## Testing Backend Connectivity

### Method 1: Using curl (Command Line)

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test with verbose output
curl -v http://localhost:8000/health

# Test from your IP (as mobile device would see it)
curl http://192.168.1.4:8000/health

# Test specific API endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Method 2: Using Browser

Open in your browser:

- `http://localhost:8000/health`
- `http://YOUR_IP:8000/health`

Should return JSON response like: `{"status":"ok"}`

### Method 3: Using Postman or Insomnia

1. Create new request
2. Set URL: `http://localhost:8000/api/v1/auth/login`
3. Set method: POST
4. Set body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
5. Send request

### Method 4: Using Built-in API Tester

Add this to a test screen in your app:

```typescript
import { Button, View, Text } from 'react-native';
import apiTester from '@/lib/apiTester';

export default function TestScreen() {
  const [result, setResult] = useState('');

  const runTest = async () => {
    const diagnostics = await apiTester.runDiagnostics();
    setResult(JSON.stringify(diagnostics, null, 2));
  };

  return (
    <View>
      <Button title="Run Diagnostics" onPress={runTest} />
      <Text>{result}</Text>
    </View>
  );
}
```

---

## VS Code Terminal Commands

### Clear Expo Cache and Restart

```bash
# Clear cache and restart
npx expo start --clear

# Or clear specific caches
npx expo start --clear --reset-cache

# Clear node modules and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Check Network Configuration

```bash
# Windows - Get IP address
ipconfig

# Mac/Linux - Get IP address
ifconfig
# or
ip addr show

# Test connectivity to backend
ping YOUR_BACKEND_IP

# Test specific port
telnet YOUR_BACKEND_IP 8000
# or
nc -zv YOUR_BACKEND_IP 8000
```

### Backend Server Commands

```bash
# Navigate to backend
cd backend-main

# Install dependencies
npm install

# Start backend in development mode
npm run dev

# Start backend in production mode
npm start

# Check backend logs
# (logs will appear in the terminal where backend is running)

# Run backend with specific port
PORT=8001 npm start
```

### View App Logs

```bash
# View all logs
npx expo start

# Then press 'j' to open debugger
# Or check terminal output for logs

# View React Native logs
npx react-native log-android  # For Android
npx react-native log-ios      # For iOS
```

---

## Network Troubleshooting

### Check Internet Connectivity

```bash
# Ping Google DNS
ping 8.8.8.8

# Ping a website
ping google.com

# Check DNS resolution
nslookup google.com
```

### Check Local Network

```bash
# Check if you can reach your own machine
ping localhost

# Check if you can reach backend IP
ping YOUR_BACKEND_IP

# Trace route to backend
traceroute YOUR_BACKEND_IP  # Mac/Linux
tracert YOUR_BACKEND_IP     # Windows
```

### Firewall Configuration

#### Windows

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings"
4. Find Node.js or your backend app
5. Check both "Private" and "Public" boxes
6. Click OK

Or via command line:

```bash
# Allow port 8000
netsh advfirewall firewall add rule name="Backend API" dir=in action=allow protocol=TCP localport=8000
```

#### Mac

1. System Preferences → Security & Privacy
2. Click Firewall tab
3. Click lock icon to make changes
4. Click "Firewall Options"
5. Add Node.js or your backend app
6. Set to "Allow incoming connections"

Or via command line:

```bash
# Allow Node.js
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

---

## Backend Server Setup

### Initial Setup

```bash
# Navigate to backend directory
cd backend-main

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=8000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EOF

# Start the server
npm start
```

### Verify Backend is Working

```bash
# Check if server is listening
netstat -an | grep 8000  # Mac/Linux
netstat -an | findstr 8000  # Windows

# Test health endpoint
curl http://localhost:8000/health

# Check server logs
# (view terminal where backend is running)
```

### Common Backend Issues

1. **Port already in use:**

   ```bash
   # Find and kill process
   lsof -ti:8000 | xargs kill -9  # Mac/Linux
   ```

2. **Database connection failed:**

   - Check DATABASE_URL in .env
   - Ensure database is running
   - Check database credentials

3. **Missing environment variables:**
   - Verify all required variables in .env
   - Check backend logs for specific missing variables

---

## Environment Configuration

### Mobile App .env

Create/update `.env` in project root:

```bash
# Backend URL - MUST use your local IP, not localhost
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.4:8000

# Razorpay credentials
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**Important Notes:**

- ❌ Don't use `localhost` or `127.0.0.1` (won't work on physical devices)
- ✅ Use your actual local IP address
- ✅ Ensure no trailing slash in URL
- ✅ Use `http://` not `https://` for local development

### Backend .env

Create/update `backend-main/.env`:

```bash
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_here

# CORS (allow your mobile app)
CORS_ORIGIN=*
```

### Restart After Changes

```bash
# Stop Expo (Ctrl+C)
# Clear cache and restart
npx expo start --clear

# Restart backend
cd backend-main
# Stop backend (Ctrl+C)
npm start
```

---

## Advanced Debugging

### Enable Detailed Logging

Add to your app's entry point (App.tsx):

```typescript
// Enable detailed API logging
if (__DEV__) {
  console.log('🔧 Development mode - detailed logging enabled');

  // Log all API requests
  import('@/lib/api').then(({ axiosInstance }) => {
    axiosInstance.interceptors.request.use((request) => {
      console.log('📤 Request:', {
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.data,
      });
      return request;
    });
  });
}
```

### Monitor Network Requests

```typescript
import { useEffect } from 'react';
import apiTester from '@/lib/apiTester';

// Add to your root component
useEffect(() => {
  // Monitor backend every 5 seconds for 30 seconds
  apiTester.monitorBackend(5000, 30000);
}, []);
```

### Check Retry Statistics

```typescript
import api from '@/lib/api';

// Get retry stats
const stats = api.getRetryStats();
console.log('Retry Statistics:', stats);

// Reset stats
api.resetRetryStats();
```

### Test Custom Backend URL

```typescript
import apiTester from '@/lib/apiTester';

// Test different URL
await apiTester.testCustomUrl('http://192.168.1.5:8000');
```

### Network Diagnostics

```typescript
import { getNetworkDiagnostics } from '@/lib/networkUtils';

const diagnostics = await getNetworkDiagnostics();
console.log('Network Diagnostics:', diagnostics);
```

---

## Troubleshooting Checklist

Use this checklist to systematically debug issues:

- [ ] Backend server is running (`npm start` in backend-main)
- [ ] Backend health endpoint responds (`curl http://localhost:8000/health`)
- [ ] .env file exists with correct BACKEND_URL
- [ ] BACKEND_URL uses local IP, not localhost
- [ ] Mobile device and backend are on same WiFi network
- [ ] Firewall allows port 8000
- [ ] No other service is using port 8000
- [ ] Expo cache has been cleared (`npx expo start --clear`)
- [ ] node_modules are up to date (`npm install`)
- [ ] Backend .env has all required variables
- [ ] Database is running (if applicable)
- [ ] Can ping backend IP from mobile device network

---

## Getting Help

If you're still experiencing issues:

1. **Run diagnostics:**

   ```typescript
   import apiTester from '@/lib/apiTester';
   const result = await apiTester.runDiagnostics();
   apiTester.printDiagnosticReport(result);
   ```

2. **Collect information:**

   - Backend URL from .env
   - Error messages from app
   - Backend server logs
   - Network diagnostics output
   - Your local IP address
   - Device type (simulator/physical)

3. **Check logs:**

   - VS Code terminal (Expo logs)
   - Backend terminal (server logs)
   - Browser console (if using web)
   - Device logs (React Native debugger)

4. **Common solutions:**
   - Restart backend server
   - Clear Expo cache
   - Restart mobile app
   - Check firewall settings
   - Verify network connectivity
   - Update .env with correct IP

---

## Quick Reference

### Essential Commands

```bash
# Start backend
cd backend-main && npm start

# Start Expo (clear cache)
npx expo start --clear

# Get your IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Test backend
curl http://localhost:8000/health

# Check port usage
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux
```

### Essential Files

- `.env` - Mobile app environment variables
- `backend-main/.env` - Backend environment variables
- `src/lib/api.ts` - API configuration with retry logic
- `src/lib/networkUtils.ts` - Network connectivity utilities
- `src/lib/apiTester.ts` - Diagnostic tools

### Support Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Axios Documentation](https://axios-http.com/)
- [React Native Networking](https://reactnative.dev/docs/network)
