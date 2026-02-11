const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add CSS support for NativeWind
config.resolver.sourceExts.push('css');

// Keep Metro focused on app sources only. This repo also contains backend/portal
// and build artifacts that can cause high memory usage while bundling on Windows.
const ignoredFolders = [
  'android',
  'ios',
  'backend-main',
  'portal-main',
  'archive',
  'docs',
  'screenshots',
  '.git',
  '.github',
];

config.resolver.blockList = ignoredFolders.map((folder) =>
  new RegExp(
    `${path.resolve(__dirname, folder).replace(/[/\\\\]/g, '[/\\\\]')}[/\\\\].*`
  )
);

module.exports = config;
