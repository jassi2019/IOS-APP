// SkeletonLoader.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const SkeletonLoader = ({
  width,
  height,
  style,
}: {
  width: string;
  height: number;
  style: any;
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E0E0E0',
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );
};

// SubjectCardSkeleton.tsx
export const SubjectCardSkeleton = () => {
  return (
    <View className="w-full aspect-square rounded-3xl bg-white p-4">
      <SkeletonLoader width="100%" height={120} style={{ borderRadius: 16 }} />
      <View className="mt-4">
        <SkeletonLoader width="80%" height={20} style={{ borderRadius: 16 }} />
      </View>
    </View>
  );
};

// TopicCardSkeleton.tsx
export const TopicCardSkeleton = () => {
  return (
    <View className="mx-4 flex-row items-center bg-white rounded-3xl p-4">
      <SkeletonLoader width="120" height={80} style={{ borderRadius: 16 }} />
      <View className="flex-1 ml-4 space-y-2">
        <SkeletonLoader width="60%" height={20} style={{ borderRadius: 16 }} />
        <SkeletonLoader width="90%" height={16} style={{ borderRadius: 16 }} />
        <SkeletonLoader width="40%" height={16} style={{ borderRadius: 16 }} />
      </View>
    </View>
  );
};

// ContinueReadingSkeleton.tsx
export const ContinueReadingSkeleton = () => {
  return (
    <View className="mx-4 bg-white rounded-3xl p-6 h-36">
      <SkeletonLoader width="40%" height={20} style={{ borderRadius: 16 }} />
      <View className="mt-4">
        <SkeletonLoader width="80%" height={24} style={{ borderRadius: 16 }} />
        <View className="mt-2">
          <SkeletonLoader width="90%" height={16} style={{ borderRadius: 16 }} />
        </View>
      </View>
    </View>
  );
};

export default SkeletonLoader;
