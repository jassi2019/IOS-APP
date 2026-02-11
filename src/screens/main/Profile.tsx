import { useAuth } from '@/contexts/AuthContext';
import { useRequestAccountDeletion } from '@/hooks/api/auth';
import { useGetProfile, useUpdateUser } from '@/hooks/api/user';
import { MaterialIcons } from '@expo/vector-icons';
import { Check, ChevronRight, Eye, EyeOff, Lock, LogOut, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header/Header';
import { isPaidSubscriptionActive } from '@/lib/subscription';

type AccountProps = {
  navigation: any;
};

export const Profile = ({ navigation }: AccountProps) => {
  const { user, setUser, isGuest } = useAuth();
  const { mutate, isPending } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedBio, setEditedBio] = useState(user?.bio || '');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [localProfilePicture, setLocalProfilePicture] = useState<string | null>(
    user?.profilePicture || null
  );
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch,
  } = useGetProfile({ enabled: !isGuest });

  const effectiveSubscription = user?.subscription || profile?.data?.subscription;
  const isPremiumUser = isPaidSubscriptionActive(effectiveSubscription);

  const { mutate: requestDeletion, isPending: isDeletingAccount } = useRequestAccountDeletion();
  const avatarOptions = Array.from({ length: 12 }, (_, index) => {
    const seed = index + 1;
    return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}`;
  });

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.innerContainer}>
          <Header title="My Account" onBack={() => navigation.goBack()} />
          <View style={styles.guestContainer}>
            <Text style={styles.guestTitle}>Guest Mode</Text>
            <Text style={styles.guestSubtitle}>
              Sign in or create account to access profile settings and progress.
            </Text>
            <TouchableOpacity style={styles.guestButton} onPress={() => setUser(null)}>
              <Text style={styles.guestButtonText}>Sign In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };


  const handleUpdateProfile = () => {
    mutate(
      { name: editedName, bio: editedBio, id: user?.id },
      {
        onSuccess: (data: any) => {
          setIsEditing(false);
          refetch();
          if (data?.data) {
            setUser(data.data);
          }
        },
        onError: (error: any) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const handleAvatarSelect = (profilePicture: string | null) => {
    if (!user?.id) {
      Alert.alert('Error', 'User not found. Please try again.');
      return;
    }

    setLocalProfilePicture(profilePicture);
    mutate(
      { id: user.id, profilePicture },
      {
        onSuccess: (data: any) => {
          setShowAvatarModal(false);
          refetch();
          if (data?.data) {
            setUser(data.data);
            setLocalProfilePicture(data.data.profilePicture || null);
          }
        },
        onError: (error: any) => {
          const errorMessage = error?.userMessage || error?.message || 'Failed to update avatar';
          Alert.alert('Error', errorMessage);
        },
      }
    );
  };

  const handleRandomAvatar = () => {
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
    handleAvatarSelect(avatarOptions[randomIndex]);
  };

  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow photo access to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.base64) {
      Alert.alert('Error', 'Unable to read selected image. Please try another one.');
      return;
    }

    const dataUri = `data:image/jpeg;base64,${asset.base64}`;
    handleAvatarSelect(dataUri);
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    mutate(
      { id: profile?.data?.id, password: newPassword, currentPassword },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Password updated successfully');
          setShowPasswordForm(false);
          setCurrentPassword('');
          setNewPassword('');
        },
        onError: (error: any) => {
          Alert.alert('Error', error.message);
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action will be processed after 60 days. You can cancel by logging in during this period.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            requestDeletion(
              { email: profile?.data?.email || '', password: deletePassword },
              {
                onSuccess: () => {
                  Alert.alert(
                    'Deletion Requested',
                    'Your account deletion has been scheduled. You have 60 days to cancel by logging in.',
                    [{ text: 'OK', onPress: () => setUser(null) }]
                  );
                },
                onError: (error: any) => {
                  let errorMessage = 'Failed to request account deletion';
                  if (error?.userMessage?.toLowerCase().includes('invalid credentials')) {
                    errorMessage = 'The password you entered is incorrect. Please try again.';
                  } else if (error?.userMessage) {
                    errorMessage = error.userMessage;
                  } else if (error?.message) {
                    errorMessage = error.message;
                  }
                  Alert.alert('Error', errorMessage);
                },
              }
            );
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const profileImageUri = localProfilePicture || profile?.data?.profilePicture || undefined;


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.innerContainer}>
        <Header title="My Account" onBack={handleBack} />

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageWrapper}>
              <View style={styles.profileImageContainer}>
                {profileImageUri ? (
                  <Image
                    source={{ uri: profileImageUri }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.initialsText}>{getInitials(profile?.data?.name || '')}</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={() => setShowAvatarModal(true)}
                disabled={isPending}
              >
                <Text style={styles.changePhotoText}>
                  {profile?.data?.profilePicture ? 'Change Photo' : 'Add Photo'}
                </Text>
              </TouchableOpacity>
            </View>

          <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                {isEditing ? (
                  <TextInput
                    style={[styles.nameInput, styles.nameInputInline]}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                  />
                ) : (
                  <Text style={styles.profileName} numberOfLines={1}>
                    {profile?.data?.name}
                  </Text>
                )}
              </View>
              <Text style={styles.profileEmail}>{profile?.data?.email}</Text>

              {!isEditing && (
                <View style={styles.subscriptionBadgeRow}>
                  <View
                    style={[
                      styles.subscriptionBadge,
                      isPremiumUser ? styles.subscriptionBadgePremium : styles.subscriptionBadgeFree,
                    ]}
                  >
                    <Text
                      style={[
                        styles.subscriptionBadgeText,
                        isPremiumUser
                          ? styles.subscriptionBadgeTextPremium
                          : styles.subscriptionBadgeTextFree,
                      ]}
                    >
                      {isPremiumUser ? 'Premium' : 'Freemium'}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.editPhotoLink}
                onPress={() => setShowAvatarModal(true)}
                disabled={isPending}
              >
                <Text style={styles.editPhotoLinkText}>Edit Photo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <View style={styles.bioHeader}>
              <Text style={styles.sectionTitle}>Bio</Text>
              {!isEditing && (
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
                  <MaterialIcons name="edit" size={20} color="#4A635D" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditing ? (
              <View>
                <TextInput
                  style={styles.bioInput}
                  value={editedBio}
                  onChangeText={setEditedBio}
                  multiline
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#999"
                  textAlignVertical="top"
                />

                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEditing(false);
                      setEditedName(profile?.data?.name || '');
                      setEditedBio(profile?.data?.bio || '');
                    }}
                    style={styles.cancelButton}
                  >
                    <MaterialIcons name="close" size={18} color="#666" />
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleUpdateProfile}
                    style={styles.saveButton}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialIcons name="check" size={18} color="white" />
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.bioText}>{user?.bio || 'No bio added yet'}</Text>
            )}
          </View>

          {!isPremiumUser && (
            <View style={styles.upgradeCard}>
              <Text style={styles.upgradeTitle}>Upgrade To Premium</Text>

              <View style={styles.upgradeFeatureRow}>
                <Check size={18} color="#E5E7EB" />
                <Text style={styles.upgradeFeatureText}>Access to all premium tutorials</Text>
              </View>
              <View style={styles.upgradeFeatureRow}>
                <Check size={18} color="#E5E7EB" />
                <Text style={styles.upgradeFeatureText}>Priority support</Text>
              </View>
              <View style={styles.upgradeFeatureRow}>
                <Check size={18} color="#E5E7EB" />
                <Text style={styles.upgradeFeatureText}>Quality content</Text>
              </View>

              <TouchableOpacity
                style={styles.upgradeCta}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Plans')}
              >
                <Text style={styles.upgradeCtaText}>Upgrade To Pro</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Information</Text>
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('AboutUs')}>
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="info-outline" size={20} color="#4A635D" />
                  <Text style={styles.settingsItemText}>About Us</Text>
                </View>
                <ChevronRight size={20} color="#4A635D" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('Privacy')}>
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="privacy-tip" size={20} color="#4A635D" />
                  <Text style={styles.settingsItemText}>Privacy Policy</Text>
                </View>
                <ChevronRight size={20} color="#4A635D" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoItem} onPress={() => navigation.navigate('ContactUs')}>
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="mail-outline" size={20} color="#4A635D" />
                  <Text style={styles.settingsItemText}>Contact Us</Text>
                </View>
                <ChevronRight size={20} color="#4A635D" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.infoItem, styles.infoItemNoBorder]}
                onPress={() => navigation.navigate('RefundPolicy')}
              >
                <View style={styles.settingsItemLeft}>
                  <MaterialIcons name="request-quote" size={20} color="#4A635D" />
                  <Text style={styles.settingsItemText}>Refund Policy</Text>
                </View>
                <ChevronRight size={20} color="#4A635D" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingsCard}>
              <TouchableOpacity
                onPress={() => setShowPasswordForm(!showPasswordForm)}
                style={styles.settingsItem}
              >
                <View style={styles.settingsItemLeft}>
                  <Lock size={20} color="#4A635D" />
                  <Text style={styles.settingsItemText}>Change Password</Text>
                </View>
                <ChevronRight size={20} color="#4A635D" />
              </TouchableOpacity>

              {showPasswordForm && (
                <View style={styles.passwordForm}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Current Password"
                    placeholderTextColor="#999"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                  />
                  <TextInput
                    style={[styles.passwordInput, styles.passwordInputSpacing]}
                    placeholder="New Password"
                    placeholderTextColor="#999"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity
                    onPress={handlePasswordUpdate}
                    style={styles.updatePasswordButton}
                    disabled={isPending}
                  >
                    <Text style={styles.updatePasswordButtonText}>
                      {isPending ? 'Updating...' : 'Update Password'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setShowDeleteForm(!showDeleteForm)}
                style={styles.settingsItem}
              >
                <View style={styles.settingsItemLeft}>
                  <Trash2 size={20} color="#EF4444" />
                  <Text style={styles.deleteText}>Delete Account</Text>
                </View>
                <ChevronRight size={20} color="#EF4444" />
              </TouchableOpacity>

              {showDeleteForm && (
                <View style={styles.deleteForm}>
                  <Text style={styles.deleteWarning}>
                    Enter your password to confirm account deletion. Your account will be deleted
                    after 60 days.
                  </Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passwordInputWithIcon}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      value={deletePassword}
                      onChangeText={setDeletePassword}
                      secureTextEntry={!showDeletePassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowDeletePassword(!showDeletePassword)}
                    >
                      {!showDeletePassword ? (
                        <EyeOff size={20} color="#666" />
                      ) : (
                        <Eye size={20} color="#666" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={handleDeleteAccount}
                    style={styles.deleteButton}
                    disabled={isDeletingAccount}
                  >
                    <Text style={styles.deleteButtonText}>
                      {isDeletingAccount ? 'Processing...' : 'Delete My Account'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity onPress={() => setUser(null)} style={styles.logoutItem}>
                <View style={styles.settingsItemLeft}>
                  <LogOut size={20} color="#EF4444" />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
                <ChevronRight size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showAvatarModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAvatarModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose an Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((url) => (
                <TouchableOpacity
                  key={url}
                  style={styles.avatarOption}
                  onPress={() => handleAvatarSelect(url)}
                  disabled={isPending}
                >
                  <Image source={{ uri: url }} style={styles.avatarImage} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.avatarActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleUploadPhoto}
                disabled={isPending}
              >
                <Text style={styles.secondaryButtonText}>Upload Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleRandomAvatar}
                disabled={isPending}
              >
                <Text style={styles.secondaryButtonText}>Random Avatar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAvatarSelect(null)}
                disabled={isPending}
              >
                <Text style={styles.secondaryButtonText}>Remove Photo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAvatarModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6F0',
  },
  innerContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  profileImageWrapper: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#4A635D',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    marginTop: 8,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changePhotoText: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '600',
  },
  editPhotoLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editPhotoLinkText: {
    color: '#4A635D',
    fontSize: 13,
    fontWeight: '600',
  },
  initialsText: {
    fontSize: 36,
    fontWeight: '500',
    color: '#000000',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  guestButton: {
    backgroundColor: '#1F2937',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subscriptionBadgeRow: {
    flexDirection: 'row',
    marginTop: 10,
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
  nameInput: {
    fontSize: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  nameInputInline: {
    flex: 1,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#4A635D',
    marginLeft: 4,
    fontSize: 14,
  },
  bioInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    color: '#374151',
  },
  bioText: {
    color: '#6B7280',
    fontSize: 14,
    minHeight: 50,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4A635D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  upgradeCard: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 20,
    padding: 20,
  },
  upgradeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  upgradeFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  upgradeFeatureText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  upgradeCta: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  upgradeCtaText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  infoSection: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemNoBorder: {
    borderBottomWidth: 0,
  },
  settingsSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    color: '#374151',
    marginLeft: 12,
    fontSize: 16,
  },
  passwordForm: {
    padding: 16,
  },
  passwordInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  passwordInputSpacing: {
    marginTop: 8,
  },
  updatePasswordButton: {
    backgroundColor: '#4A635D',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  updatePasswordButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  logoutText: {
    color: '#EF4444',
    marginLeft: 12,
    fontSize: 16,
  },
  deleteText: {
    color: '#EF4444',
    marginLeft: 12,
    fontSize: 16,
  },
  deleteForm: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  deleteWarning: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  passwordInputWithIcon: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#374151',
  },
  eyeButton: {
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '22%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 13,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Profile;
