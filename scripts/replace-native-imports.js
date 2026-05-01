#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.js', '.jsx', '.ts', '.tsx'];
const scanDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      scanDir(full);
    } else if (exts.includes(path.extname(entry.name))) {
      processFile(full);
    }
  }
};

function processFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  let orig = code;
  // Replace import Razorpay default
  code = code.replace(/import\s+Razorpay\s+from\s+['"]react-native-razorpay['"];?/g, "import { openRazorpay } from '@\\/libs/razorpay';");
  // Replace require Razorpay
  code = code.replace(/require\(['\"]react-native-razorpay['\"]\)/g, "require('@/libs/razorpay')");
  // Replace import WebView
  code = code.replace(/import\s+WebView(.*)from\s+['"]react-native-webview['"];?/g, "import PlatformWebView$1 from '@/components/PlatformWebView';");
  code = code.replace(/const\s+\{\s*WebView\s*\}\s*=\s*require\(['\"]react-native-webview['\"]\);?/g, "const PlatformWebView = require('@/components/PlatformWebView').default;");

  if (code !== orig) {
    fs.writeFileSync(file, code, 'utf8');
    console.log('Patched:', file);
  }
}

console.log('Scanning project for native imports to replace...');
scanDir(root);
console.log('Done. Run `npm run lint` to verify.');
