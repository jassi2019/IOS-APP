import { useAuth } from '@/contexts/AuthContext';
import { useAddToFavorites, useRemoveFromFavorites } from '@/hooks/api/favorites';
import { getRenderableThumbnailUrl } from '@/utils/media';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type TopicCardProps = {
  topicId: string;
  title: string;
  favoriteId?: string;
  description: string;
  thumbnailUrl?: string;
  isFree?: boolean;
  isFavorite?: boolean;
  onPress?: () => void;
  chapterNumber?: number;
  subjectName?: string;
};

const TopicCard = ({
  title,
  topicId,
  favoriteId,
  description,
  isFavorite,
  thumbnailUrl,
  isFree = false,
  onPress,
  chapterNumber,
  subjectName,
}: TopicCardProps) => {
  const { user, isGuest } = useAuth();
  const [hasImageError, setHasImageError] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const { mutate: addToFavorites, isPending: isAddingToFavorites } = useAddToFavorites();
  const { mutate: removeFromFavorites, isPending: isRemovingFromFavorite } =
    useRemoveFromFavorites();
  const queryClient = useQueryClient();

  const safeThumbnailUrl = React.useMemo(
    () => getRenderableThumbnailUrl(thumbnailUrl),
    [thumbnailUrl]
  );
  const imageSource = React.useMemo(
    () =>
      safeThumbnailUrl
        ? ({
            uri: safeThumbnailUrl,
            cache: 'force-cache',
          } as const)
        : null,
    [safeThumbnailUrl]
  );

  React.useEffect(() => {
    setHasImageError(false);
    setIsImageLoading(false);
  }, [safeThumbnailUrl]);

  const handleAddToFavorites = () => {
    if (isGuest) {
      Alert.alert('Sign in required', 'Please sign in to use favorites.');
      return;
    }

    if (!user?.id) return;

    if (!isFavorite) {
      addToFavorites(
        { topicId, userId: user?.id },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Topic added to favorites');
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
          },
          onError: (_error: unknown) => {
            Alert.alert('Error', 'Unable to add to favorites');
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
          },
        }
      );
    } else {
      removeFromFavorites(favoriteId || '', {
        onSuccess: () => {
          Alert.alert('Success', 'Topic removed from favorites');
          queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        onError: (_error: unknown) => {
          Alert.alert('Error', 'Unable to remove from favorites');
          queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
      });
    }
  };
  
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.thumbnailWrapper}>
          {imageSource && !hasImageError ? (
            <>
              <Image
                source={imageSource}
                style={styles.thumbnail}
                resizeMode="cover"
                onLoadStart={() => {
                  setIsImageLoading(true);
                  if (__DEV__) {
                    console.log('[TopicCard][ImageLoadStart]', {
                      topicId,
                      title,
                      url: safeThumbnailUrl,
                    });
                  }
                }}
                onLoadEnd={() => {
                  setIsImageLoading(false);
                }}
                onError={(event) => {
                  setHasImageError(true);
                  setIsImageLoading(false);
                  if (__DEV__) {
                    console.log('[TopicCard][ImageLoadError]', {
                      topicId,
                      title,
                      url: safeThumbnailUrl,
                      error: event?.nativeEvent?.error || 'unknown',
                    });
                  }
                }}
              />
              {isImageLoading ? (
                <View style={styles.thumbnailLoader}>
                  <ActivityIndicator size="small" color="#6B7280" />
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.noThumbnailContainer}>
              <Text style={styles.noThumbnailText}>Preview Unavailable</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View>
            <View style={styles.rowBetween}>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
              {!isGuest && (
                <TouchableOpacity
                  onPress={handleAddToFavorites}
                  disabled={isAddingToFavorites || isRemovingFromFavorite}
                  style={styles.favButton}
                >
                  {isAddingToFavorites || isRemovingFromFavorite ? (
                    <ActivityIndicator size="small" color="#FDB813" />
                  ) : isFavorite ? (
                    <MaterialCommunityIcons name="star-box-multiple" size={24} color="#FDB813" />
                  ) : (
                    <MaterialCommunityIcons
                      name="star-box-multiple-outline"
                      size={24}
                      color="#FDB813"
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>

            {chapterNumber && (
              <View style={styles.rowSpace}>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="book-open-variant" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>Ch. {chapterNumber}</Text>
                </View>
                {subjectName && (
                  <>
                    <Text style={styles.dot}>•</Text>
                    <View style={styles.row}>
                      <MaterialCommunityIcons name="school" size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{subjectName}</Text>
                    </View>
                  </>
                )}
              </View>
            )}

            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.badge, { backgroundColor: isFree ? '#10B981' : '#F59E0B' }]}>
              <Text style={styles.badgeText}>{isFree ? 'Free' : 'Premium'}</Text>
            </View>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  thumbnailWrapper: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    flexShrink: 0,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailLoader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noThumbnailContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noThumbnailText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  favButton: {
    padding: 4,
    marginRight: -4,
    marginTop: -4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  metaText: {
    color: '#6B7280',
    fontSize: 11,
    marginLeft: 4,
  },
  dot: {
    color: '#D1D5DB',
    marginHorizontal: 4,
    fontSize: 11,
  },
  description: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default TopicCard;
