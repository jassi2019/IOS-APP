# Network Troubleshooting Guide

## Quick Diagnosis

If you're experiencing network timeout errors, follow these steps to diagnose and fix the issue.

## Step 1: Check Your Internet Connection

### On Mobile Device

1. Open Settings → WiFi or Mobile Data
2. Verify you're connected to a network
3. Try opening a web browser to test connectivity
4. Try toggling Airplane Mode on and off

### On Simulator/Emulator

1. Check your computer's internet connection
2. Verify the simulator has network access
3. Restart the simulator if needed

## Step 2: Verify Backend Server

### Check if Backend is Running

```bash
# Navigate to backend directory
cd backend-main

# Check if server is running
# You should see output indicating the server is running on port 8000
```

### Start Backend Server

```bash
cd backend-main
npm install  # If first time
npm start
```

### Verify Backend URL

Check your environment configuration:

- Development: Should use your local IP (e.g., `http://192.168.1.4:8000`)
- **NOT** `localhost` or `127.0.0.1` when testing on physical device
- Production: Should use `https://api.taiyarineetki.com`

## Step 3: Test Connection Quality

### Using the App

The app now includes built-in diagnostics. Check the console logs for:

```
📡 Internet connectivity: ✅ Connected / ❌ Disconnected
🖥️  Server reachability: ✅ Reachable / ❌ Unreachable
⚡ Server latency: XXXms
```

### Connection Quality Indicators

- **Excellent** (< 100ms): Everything should work smoothly
- **Good** (100-300ms): Normal performance
- **Fair** (300-1000ms): Requests may be slower
- **Poor** (> 1000ms): Expect significant delays
- **Offline**: No connection

## Step 4: Common Issues & Solutions

### Issue: "Request timed out after 30 seconds"

**Possible Causes:**

- Backend server is not running
- Backend server is overloaded
- Network connection is very slow
- Firewall blocking the connection

**Solutions:**

1. ✓ Verify backend server is running
2. ✓ Check backend server logs for errors
3. ✓ Test with a different network
4. ✓ Check firewall settings
5. ✓ Restart backend server

### Issue: "Unable to connect to server"

**Possible Causes:**

- No internet connection
- Wrong backend URL
- Backend server not accessible from your network

**Solutions:**

1. ✓ Check your WiFi/mobile data connection
2. ✓ Verify backend URL in environment settings
3. ✓ Ensure device and backend are on same network (for local development)
4. ✓ Check if backend port (8000) is open

### Issue: "Connection timeout - server took too long to respond (15s+)"

**Possible Causes:**

- Server is processing request but taking too long
- Database query is slow
- Server is under heavy load

**Solutions:**

1. ✓ Check backend server logs for slow queries
2. ✓ Optimize database queries
3. ✓ Increase server resources
4. ✓ Check for infinite loops or blocking operations

## Step 5: Network Configuration

### For Physical Device Testing

1. **Find Your Computer's IP Address:**

   **Windows:**

   ```bash
   ipconfig
   # Look for "IPv4 Address" under your active network adapter
   ```

   **Mac/Linux:**

   ```bash
   ifconfig
   # or
   ip addr
   # Look for inet address (e.g., 192.168.1.4)
   ```

2. **Update Environment Configuration:**

   - Use your computer's IP address, not `localhost`
   - Example: `http://192.168.1.4:8000`

3. **Ensure Same Network:**
   - Device and computer must be on the same WiFi network
   - Disable VPN if it's blocking local network access

### For iOS Simulator

- Can use `http://localhost:8000`
- Simulator shares network with host machine

### For Android Emulator

- Use `http://10.0.2.2:8000` (special alias for host machine)
- Or use your computer's IP address

## Step 6: Advanced Diagnostics

### Check Backend Health Endpoint

```bash
# Test if backend is responding
curl http://YOUR_IP:8000/health

# Should return 200 OK
```

### Test API Endpoint Directly

```bash
# Test registration endpoint
curl -X POST http://YOUR_IP:8000/api/v1/auth/register/email/verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Check Network Latency

```bash
# Ping your backend server
ping YOUR_IP

# Should show response times
```

## Step 7: Firewall & Security

### Windows Firewall

1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Ensure Node.js is allowed for both Private and Public networks

### Mac Firewall

1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Ensure Node is allowed

### Antivirus Software

- Temporarily disable to test if it's blocking connections
- Add exception for Node.js and your backend port

## Step 8: Still Having Issues?

### Collect Diagnostic Information

1. **App Console Logs:**

   - Look for error messages with request IDs
   - Note the exact error code and message

2. **Backend Server Logs:**

   - Check for incoming requests
   - Look for error stack traces

3. **Network Information:**

   - Connection type (WiFi/Mobile Data)
   - Connection quality
   - Latency measurements

4. **Environment Details:**
   - Backend URL being used
   - Device type (physical/simulator)
   - Operating system

### Report the Issue

Include the following information:

- Exact error message
- Steps to reproduce
- Console logs (app and backend)
- Network diagnostics output
- Environment configuration

## Timeout Settings Reference

Current timeout configurations:

- **Default**: 30 seconds
- **Auth endpoints**: 30 seconds
- **Data fetching**: 25 seconds
- **Mutations**: 30 seconds
- **Critical operations**: 20 seconds

Retry configuration:

- **Max retries**: 3 attempts
- **Initial delay**: 2 seconds
- **Max delay**: 10 seconds
- **Total possible time**: Up to ~134 seconds

## Prevention Tips

1. **Optimize Backend Performance:**

   - Use database indexes
   - Implement caching
   - Optimize queries
   - Monitor server resources

2. **Improve Network Reliability:**

   - Use stable WiFi connection
   - Avoid congested networks
   - Consider using mobile data as backup

3. **Monitor Connection Quality:**

   - Check connection quality before critical operations
   - Warn users about poor connections
   - Implement offline mode for poor connectivity

4. **Regular Maintenance:**
   - Keep backend server updated
   - Monitor server logs
   - Test on different networks
   - Profile slow endpoints

## Quick Reference

### Error Codes

- `ECONNABORTED`: Request was aborted (timeout)
- `ETIMEDOUT`: Connection timed out
- `ENOTFOUND`: DNS lookup failed
- `ENETUNREACH`: Network is unreachable
- `NETWORK_ERROR`: General network error

### Useful Commands

```bash
# Start backend
cd backend-main && npm start

# Start app with cache clear
npx expo start --clear

# Check backend health
curl http://localhost:8000/health

# Find your IP
ipconfig  # Windows
ifconfig  # Mac/Linux
```

## Contact Support

If you've tried all troubleshooting steps and still experience issues:

- Check existing issues on GitHub
- Create a new issue with diagnostic information
- Contact the development team

---

**Last Updated**: 2024
**Related Documents**:

- NETWORK_TIMEOUT_FIX_SUMMARY.md
- BACKEND_CONNECTION_GUIDE.md
- ERROR_HANDLING_IMPROVEMENTS.md
