// src/components/user-header/UserHeader.tsx
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface UserHeaderProps {
  name: string;
  imageUrl?: string;
  isPremium?: boolean;
}

export const UserHeader = ({ name, imageUrl, isPremium = false }: UserHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const badgeLabel = isPremium ? 'Premium' : 'Freemium';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hi, {name}</Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.subscriptionBadge,
                isPremium ? styles.subscriptionBadgePremium : styles.subscriptionBadgeFree,
              ]}
            >
              <Text
                style={[
                  styles.subscriptionBadgeText,
                  isPremium
                    ? styles.subscriptionBadgeTextPremium
                    : styles.subscriptionBadgeTextFree,
                ]}
              >
                {badgeLabel}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.7} style={styles.avatarContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getInitials(name)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    letterSpacing: -0.5,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  subscriptionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subscriptionBadgeFree: {
    backgroundColor: '#4E9982',
  },
  subscriptionBadgePremium: {
    backgroundColor: '#FFF7E6',
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subscriptionBadgeTextFree: {
    color: '#FFFFFF',
  },
  subscriptionBadgeTextPremium: {
    color: '#F1BB3E',
  },
  avatarContainer: {
    marginLeft: 16,
    borderRadius: 28,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#EEE',
  },
  initialsContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default UserHeader;
