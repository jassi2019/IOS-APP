const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

// ESLint v9 uses the new "flat config" format by default. This keeps our existing
// `.eslintrc.js` working without changing rules right now.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  // Keep lint fast by skipping platform/build outputs.
  {
    ignores: [
      '**/node_modules/**',
      'android/**',
      'ios/**',
      'ios-build/**',
      'dist/**',
      'web-build/**',
      'backend-main/**',
      'portal-main/**',
      'mobile-app-main/**',
    ],
  },
  ...compat.config(require('./.eslintrc.js')),
];
