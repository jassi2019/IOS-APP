module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // Prevent direct imports of native-only modules; use wrappers instead
    'no-restricted-imports': [
      'error',
      {
        'paths': [
          {
            'name': 'react-native-razorpay',
            'message': "Use '@/libs/razorpay' wrapper instead (openRazorpay)",
          },
          {
            'name': 'react-native-webview',
            'message': "Use '@/components/PlatformWebView' instead",
          }
        ]
      }
    ]
  }
};