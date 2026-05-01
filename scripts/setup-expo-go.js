/**
 * Setup Script for Expo Go Development
 *
 * This script helps configure the backend URL for Expo Go testing
 * Run: node scripts/setup-expo-go.js
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

console.log('🔧 Expo Go Setup Helper');
console.log('========================\n');

// Get network interfaces
const interfaces = os.networkInterfaces();
const addresses = [];

// Find all IPv4 addresses
Object.keys(interfaces).forEach((interfaceName) => {
  interfaces[interfaceName].forEach((iface) => {
    // Skip internal and non-IPv4 addresses
    if (iface.family === 'IPv4' && !iface.internal) {
      addresses.push({
        name: interfaceName,
        address: iface.address,
      });
    }
  });
});

console.log('📡 Found Network Addresses:\n');
addresses.forEach((addr, index) => {
  console.log(`   ${index + 1}. ${addr.name}: ${addr.address}`);
});

if (addresses.length === 0) {
  console.log('❌ No network addresses found!');
  console.log('   Make sure you are connected to WiFi or Ethernet.\n');
  process.exit(1);
}

// Recommend the first non-internal address
const recommendedAddress = addresses[0].address;

console.log(`\n✅ Recommended IP Address: ${recommendedAddress}`);
console.log(`   Use this in your .env file\n`);

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

console.log('📝 Configuration Steps:\n');
console.log('1. Open your .env file');
console.log('2. Update or add this line:');
console.log(`   EXPO_PUBLIC_BACKEND_URL=http://${recommendedAddress}:8000\n`);

// Try to read current .env
try {
  if (fs.existsSync(envPath)) {
    const currentEnv = fs.readFileSync(envPath, 'utf8');
    console.log('📄 Current .env file content:');
    console.log('----------------------------');
    console.log(currentEnv);
    console.log('----------------------------\n');

    // Check if it has the correct URL
    if (currentEnv.includes('localhost') || currentEnv.includes('127.0.0.1')) {
      console.log('⚠️  WARNING: Your .env file contains localhost or 127.0.0.1');
      console.log('   This will NOT work with Expo Go on a physical device!\n');

      // Offer to update
      console.log('💡 Suggested .env file content:');
      console.log('----------------------------');
      console.log(`EXPO_PUBLIC_BACKEND_URL=http://${recommendedAddress}:8000`);
      console.log('EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yKCG6OGi329xSM');
      console.log('----------------------------\n');

      console.log('To update automatically, you can:');
      console.log('1. Copy the suggested content above');
      console.log('2. Paste it into your .env file');
      console.log('3. Save the file');
      console.log('4. Restart Expo with: npx expo start --clear\n');
    } else if (currentEnv.includes(recommendedAddress)) {
      console.log('✅ Your .env file looks correct!');
      console.log('   It already uses your network IP address.\n');
    }
  } else {
    console.log('❌ .env file not found!');
    console.log('   Creating a new .env file...\n');

    const newEnvContent = `EXPO_PUBLIC_BACKEND_URL=http://${recommendedAddress}:8000
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_test_yKCG6OGi329xSM
`;

    fs.writeFileSync(envPath, newEnvContent);
    console.log('✅ Created .env file with correct configuration!');
    console.log('   Content:');
    console.log('----------------------------');
    console.log(newEnvContent);
    console.log('----------------------------\n');
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

console.log('🚀 Next Steps:\n');
console.log('1. Make sure your backend is running:');
console.log('   cd backend-main && npm start\n');
console.log('2. Restart Expo with cache clear:');
console.log('   npx expo start --clear\n');
console.log('3. Scan QR code with Expo Go\n');
console.log('4. Make sure your phone and computer are on the SAME WiFi network\n');

console.log('📱 Testing:');
console.log(`   Your backend should be accessible at: http://${recommendedAddress}:8000`);
console.log(`   Test it by opening this URL in your phone's browser\n`);

console.log('Need help? Check EXPO_GO_SETUP.md for detailed instructions.\n');
