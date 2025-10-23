import React, { useState, useMemo } from 'react';
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
import { AppColors } from '@/constants/colors';
import { mockTrips, mockUser } from '@/data/mockData';
import { Trip, TripStatus } from '@/types';

type FilterType = 'all' | TripStatus;

export default function MyTripsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const myTrips = useMemo(() => {
    const trips = mockTrips.filter((trip) => trip.userId === mockUser.id);

    if (activeFilter === 'all') {
      return trips;
    }

    return trips.filter((trip) => trip.status === activeFilter);
  }, [activeFilter]);

  const handleEdit = (trip: Trip) => {
    console.log('Edit trip:', trip.id);
    setMenuOpenId(null);
    // In a real app, navigate to edit screen
  };

  const handleCancel = (trip: Trip) => {
    setMenuOpenId(null);
    Alert.alert('Cancel Trip', 'Are you sure you want to cancel this trip?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          console.log('Cancelling trip:', trip.id);
          // In a real app, update trip status
        },
      },
    ]);
  };

  const handleViewDetails = (trip: Trip) => {
    console.log('View details:', trip.id);
    setMenuOpenId(null);
    // In a real app, navigate to details screen
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'all' && styles.filterTabActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'active' && styles.filterTabActive]}
            onPress={() => setActiveFilter('active')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'active' && styles.filterTabTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, activeFilter === 'done' && styles.filterTabActive]}
            onPress={() => setActiveFilter('done')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'done' && styles.filterTabTextActive,
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'cancelled' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('cancelled')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'cancelled' && styles.filterTabTextActive,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.tripsList}
        contentContainerStyle={styles.tripsListContent}
        showsVerticalScrollIndicator={false}
      >
        {myTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={64} color={AppColors.textLight} />
            <Text style={styles.emptyStateText}>No trips found</Text>
            <Text style={styles.emptyStateSubtext}>
              {activeFilter === 'all'
                ? 'Create your first trip to get started'
                : `You have no ${activeFilter} trips`}
            </Text>
          </View>
        ) : (
          myTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              isMenuOpen={menuOpenId === trip.id}
              onMenuToggle={() => setMenuOpenId(menuOpenId === trip.id ? null : trip.id)}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface TripCardProps {
  trip: Trip;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onViewDetails: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onCancel: (trip: Trip) => void;
}

function TripCard({
  trip,
  isMenuOpen,
  onMenuToggle,
  onViewDetails,
  onEdit,
  onCancel,
}: TripCardProps) {
  const isDriver = trip.role === 'driver';
  const roleBadgeColor = isDriver ? AppColors.primary : AppColors.secondary;

  const getStatusBadgeColor = () => {
    switch (trip.status) {
      case 'active':
        return AppColors.statusActive;
      case 'done':
        return AppColors.statusDone;
      case 'cancelled':
        return AppColors.statusCancelled;
      default:
        return AppColors.textLight;
    }
  };

  return (
    <View style={styles.tripCard}>
      <View style={styles.tripCardHeader}>
        <View style={styles.badges}>
          <View style={[styles.roleBadge, { backgroundColor: roleBadgeColor }]}>
            <Ionicons
              name={isDriver ? 'car' : 'person'}
              size={12}
              color={AppColors.textWhite}
            />
            <Text style={styles.roleBadgeText}>
              {isDriver ? 'Driver' : 'Passenger'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBadgeColor() }]}>
            <Text style={styles.statusBadgeText}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuToggle}>
            <Ionicons name="ellipsis-vertical" size={20} color={AppColors.textSecondary} />
          </TouchableOpacity>

          {isMenuOpen && (
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onViewDetails(trip)}
              >
                <Ionicons name="eye-outline" size={18} color={AppColors.textPrimary} />
                <Text style={styles.menuItemText}>View Details</Text>
              </TouchableOpacity>

              {trip.status === 'active' && (
                <>
                  <TouchableOpacity style={styles.menuItem} onPress={() => onEdit(trip)}>
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color={AppColors.textPrimary}
                    />
                    <Text style={styles.menuItemText}>Edit Trip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, styles.menuItemDanger]}
                    onPress={() => onCancel(trip)}
                  >
                    <Ionicons name="close-circle-outline" size={18} color={AppColors.destructive} />
                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                      Cancel Trip
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </View>

      <View style={styles.routeSection}>
        <View style={styles.routeRow}>
          <Ionicons name="radio-button-on" size={16} color={AppColors.primary} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeText}>{trip.origin}</Text>
          </View>
        </View>

        <View style={styles.routeDivider} />

        <View style={styles.routeRow}>
          <Ionicons name="location" size={16} color={AppColors.accent} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeText}>{trip.destination}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tripDetails}>
        <View style={styles.tripDetailItem}>
          <Ionicons name="calendar-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.tripDetailText}>{trip.date}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Ionicons name="time-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.tripDetailText}>{trip.time}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Ionicons name="people-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.tripDetailText}>{trip.seats} seats</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Ionicons name="cash-outline" size={14} color={AppColors.accent} />
          <Text style={[styles.tripDetailText, { color: AppColors.accent, fontWeight: '600' }]}>
            ${trip.price}
          </Text>
        </View>
      </View>

      {isDriver && trip.carInfo && (
        <View style={styles.carInfo}>
          <Ionicons name="car-sport-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.carInfoText}>
            {trip.carInfo}
            {trip.carYear && ` (${trip.carYear})`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base,
  },
  header: {
    backgroundColor: AppColors.cardLight,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: AppColors.base,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: AppColors.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  filterTabTextActive: {
    color: AppColors.textWhite,
  },
  tripsList: {
    flex: 1,
  },
  tripsListContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: AppColors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  tripCard: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  tripCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textWhite,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.textWhite,
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 4,
  },
  menu: {
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 160,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemDanger: {
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  menuItemText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  menuItemTextDanger: {
    color: AppColors.destructive,
  },
  routeSection: {
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: AppColors.textLight,
    marginBottom: 2,
  },
  routeText: {
    fontSize: 15,
    color: AppColors.textPrimary,
    fontWeight: '500',
  },
  routeDivider: {
    width: 2,
    height: 16,
    backgroundColor: AppColors.border,
    marginLeft: 7,
    marginVertical: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  carInfoText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
