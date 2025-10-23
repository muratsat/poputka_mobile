import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppColors } from '@/constants/colors';
import { mockUser } from '@/data/mockData';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          console.log('Logging out...');
          router.replace('/auth/phone');
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleMyVehicles = () => {
    console.log('My vehicles');
  };

  const handleSavedLocations = () => {
    console.log('Saved locations');
  };

  const handleSettings = () => {
    console.log('Settings');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(mockUser.name)}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userPhone}>{mockUser.phone}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={AppColors.accent} />
            <Text style={styles.ratingText}>{mockUser.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({mockUser.reviewCount} reviews)</Text>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="car" size={24} color={AppColors.primary} />
            <Text style={styles.statNumber}>{mockUser.tripsAsDriver}</Text>
            <Text style={styles.statLabel}>As Driver</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="person" size={24} color={AppColors.secondary} />
            <Text style={styles.statNumber}>{mockUser.tripsAsPassenger}</Text>
            <Text style={styles.statLabel}>As Passenger</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="analytics" size={24} color={AppColors.accent} />
            <Text style={styles.statNumber}>
              {mockUser.tripsAsDriver + mockUser.tripsAsPassenger}
            </Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: AppColors.primaryLight }]}>
                <Ionicons name="person-outline" size={20} color={AppColors.primary} />
              </View>
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={AppColors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleMyVehicles}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: AppColors.secondaryLight + '40' }]}>
                <Ionicons name="car-sport-outline" size={20} color={AppColors.secondary} />
              </View>
              <Text style={styles.menuItemText}>My Vehicles</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={AppColors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSavedLocations}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: AppColors.accentLight + '40' }]}>
                <Ionicons name="location-outline" size={20} color={AppColors.accentDark} />
              </View>
              <Text style={styles.menuItemText}>Saved Locations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={AppColors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: AppColors.textLight + '40' }]}>
                <Ionicons name="settings-outline" size={20} color={AppColors.textSecondary} />
              </View>
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={AppColors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={AppColors.destructive} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Poputka v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  userCard: {
    backgroundColor: AppColors.cardLight,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: AppColors.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: AppColors.textWhite,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  reviewCount: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: AppColors.cardLight,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.destructive,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.destructive,
  },
  versionText: {
    fontSize: 12,
    color: AppColors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
});
