const { withInfoPlist } = require('expo/config-plugins');

module.exports = function withRazorpayConfig(config) {
  return withInfoPlist(config, (config) => {
    config.modResults.CFBundleURLTypes = config.modResults.CFBundleURLTypes || [];
    // Add a sample URL scheme if not present
    if (!config.modResults.CFBundleURLTypes.some((t) => t.CFBundleURLSchemes && t.CFBundleURLSchemes.includes('razorpay')) ) {
      config.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: ['razorpay']
      });
    }

    config.modResults.LSApplicationQueriesSchemes = config.modResults.LSApplicationQueriesSchemes || [];
    if (!config.modResults.LSApplicationQueriesSchemes.includes('razorpay')) {
      config.modResults.LSApplicationQueriesSchemes.push('razorpay');
    }

    return config;
  });
};
