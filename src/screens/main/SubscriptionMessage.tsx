import { Check, ChevronRight, Clock, RefreshCcw, XCircle } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, StatusBar, Text, TouchableOpacity, View } from 'react-native';

type SubscriptionMessageProps = {
  navigation: any;
  route: any;
};

const SubscriptionMessage = ({ navigation, route }: SubscriptionMessageProps) => {
  const { success } = route.params;
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    // Animate icon
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Animate content
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGoToProfile = () => {
    navigation.navigate('MainTabs', { screen: 'ProfileTab' });
  };

  const handleRetry = () => {
    navigation.navigate('Payment', { plan: route.params.plan });
  };

  const renderIcon = () => {
    if (success) {
      return (
        <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center">
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Check size={48} stroke="#22C55E" />
          </Animated.View>
        </View>
      );
    } else {
      return (
        <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center">
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <XCircle size={48} stroke="#EF4444" />
          </Animated.View>
        </View>
      );
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</Text>
          <Text className="text-gray-600 text-center mb-8">
            Your payment has been processed successfully.
          </Text>

          <View className="bg-yellow-50 p-4 rounded-2xl mb-8 flex-row items-center">
            <Clock size={20} stroke="#CA8A04" className="mr-3" />
            <View className="flex-1 ml-3">
              <Text className="text-yellow-800 font-medium mb-1">
                Subscription Under Verification
              </Text>
              <Text className="text-yellow-700 text-sm">
                Your subscription will be activated in a few minutes
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleGoToProfile}
            className="bg-[#F1BB3E] py-4 px-8 rounded-full flex-row items-center"
          >
            <Text className="text-white font-semibold text-lg mr-2">Go to Profile</Text>
            <ChevronRight size={20} stroke="#FFFFFF" />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</Text>
          <Text className="text-gray-600 text-center mb-8">
            We couldn't process your payment. Please try again.
          </Text>

          <View className="bg-red-50 p-4 rounded-2xl mb-8">
            <Text className="text-red-800 font-medium mb-1">Transaction Unsuccessful</Text>
            <Text className="text-red-700 text-sm">
              There might be an issue with your payment method or network connection.
            </Text>
          </View>

          <View className="space-y-4">
            <TouchableOpacity
              onPress={handleRetry}
              className="bg-[#F1BB3E] py-4 px-8 rounded-full flex-row items-center justify-center"
            >
              <RefreshCcw size={20} stroke="#FFFFFF" className="mr-2" />
              <Text className="text-white font-semibold text-lg">Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoToProfile}
              className="py-4 px-8 rounded-full flex-row items-center justify-center"
            >
              <Text className="text-gray-600 font-medium text-lg">Back to Profile</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <View className="mb-8">{renderIcon()}</View>

          <Animated.View
            className="items-center px-6"
            style={{
              opacity: fadeValue,
              transform: [
                {
                  translateY: fadeValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
            {renderContent()}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionMessage;
