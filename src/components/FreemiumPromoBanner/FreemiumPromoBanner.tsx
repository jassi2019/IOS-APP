import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sparkles, X, CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FreemiumPromoBannerProps {
  userName: string;
  onExplorePress: () => void;
}

const BANNER_DISMISSED_KEY = '@freemium_promo_banner_dismissed';

export const FreemiumPromoBanner = ({ userName, onExplorePress }: FreemiumPromoBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkBannerStatus();
  }, []);

  const checkBannerStatus = async () => {
    try {
      const dismissed = await AsyncStorage.getItem(BANNER_DISMISSED_KEY);
      setIsVisible(dismissed !== 'true');
    } catch (error) {
      setIsVisible(true);
    }
  };

  const handleDismiss = async () => {
    try {
      await AsyncStorage.setItem(BANNER_DISMISSED_KEY, 'true');
      setIsVisible(false);
    } catch (error) {
      console.error('Error dismissing banner:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FDF6F0', '#FFFBF0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <LinearGradient
          colors={['rgba(241, 187, 62, 0.15)', 'rgba(241, 187, 62, 0.05)']}
          style={styles.innerContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Sparkles size={20} color="#F1BB3E" />
              <Text style={styles.titleText}>Unlock Your Potential</Text>
            </View>
            <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
              <X size={18} color="#999" />
            </TouchableOpacity>
          </View>

          <Text style={styles.mainMessage}>
            Hi {userName}, Freemium access is now available for you!
          </Text>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <FeatureItem text="Personalized study material" />
            <FeatureItem text="Revision Recall Station" />
            <FeatureItem text="Selected Free Botany Topics" />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={onExplorePress}
            style={styles.ctaButton}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Explore Free Topics</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </TouchableOpacity>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <View style={styles.featureItem}>
    <CheckCircle2 size={16} color="#588157" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  gradientBorder: {
    borderRadius: 24,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(241, 187, 62, 0.3)',
  },
  innerContent: {
    borderRadius: 22,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1BB3E',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
  },
  mainMessage: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 28,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '600',
  },
  ctaButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
  },
});

export default FreemiumPromoBanner;
