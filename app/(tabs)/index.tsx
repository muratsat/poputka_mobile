import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';
import { mockTrips } from '@/data/mockData';
import { Trip, UserRole } from '@/types';

type FilterType = 'all' | 'drivers' | 'passengers';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTrips = useMemo(() => {
    let trips = mockTrips.filter((trip) => trip.status === 'active');

    // Apply role filter
    if (activeFilter === 'drivers') {
      trips = trips.filter((trip) => trip.role === 'driver');
    } else if (activeFilter === 'passengers') {
      trips = trips.filter((trip) => trip.role === 'passenger');
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      trips = trips.filter(
        (trip) =>
          trip.origin.toLowerCase().includes(query) ||
          trip.destination.toLowerCase().includes(query)
      );
    }

    return trips;
  }, [searchQuery, activeFilter]);

  const handleCall = (trip: Trip) => {
    // In a real app, this would use the actual phone number
    console.log(`Calling ${trip.userName}`);
    // Linking.openURL(`tel:+15551234567`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Ride</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={AppColors.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city..."
            placeholderTextColor={AppColors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={AppColors.textLight} />
            </TouchableOpacity>
          )}
        </View>

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
            style={[
              styles.filterTab,
              activeFilter === 'drivers' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('drivers')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'drivers' && styles.filterTabTextActive,
              ]}
            >
              Drivers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              activeFilter === 'passengers' && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter('passengers')}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === 'passengers' && styles.filterTabTextActive,
              ]}
            >
              Passengers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.tripsList}
        contentContainerStyle={styles.tripsListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color={AppColors.textLight} />
            <Text style={styles.emptyStateText}>No trips found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onCall={handleCall} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TripCard({ trip, onCall }: { trip: Trip; onCall: (trip: Trip) => void }) {
  const isDriver = trip.role === 'driver';
  const badgeColor = isDriver ? AppColors.primary : AppColors.secondary;

  return (
    <View style={styles.tripCard}>
      <View style={styles.tripCardHeader}>
        <View style={styles.tripCardHeaderLeft}>
          <View style={[styles.roleBadge, { backgroundColor: badgeColor }]}>
            <Ionicons
              name={isDriver ? 'car' : 'person'}
              size={12}
              color={AppColors.textWhite}
            />
            <Text style={styles.roleBadgeText}>
              {isDriver ? 'Driver' : 'Passenger'}
            </Text>
          </View>
          <Text style={styles.userName}>{trip.userName}</Text>
        </View>
        <Text style={styles.price}>${trip.price}</Text>
      </View>

      <View style={styles.routeContainer}>
        <Ionicons name="location" size={16} color={AppColors.accent} />
        <Text style={styles.routeText}>{trip.origin}</Text>
        <Ionicons
          name="arrow-forward"
          size={16}
          color={AppColors.textSecondary}
          style={styles.routeArrow}
        />
        <Text style={styles.routeText}>{trip.destination}</Text>
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

      <TouchableOpacity style={styles.callButton} onPress={() => onCall(trip)}>
        <Ionicons name="call" size={16} color={AppColors.primary} />
        <Text style={styles.callButtonText}>
          Call {isDriver ? 'driver' : 'passenger'}
        </Text>
      </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.base,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: AppColors.base,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: AppColors.primary,
  },
  filterTabText: {
    fontSize: 14,
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
    marginBottom: 12,
  },
  tripCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.accent,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  routeText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: '500',
    marginLeft: 4,
  },
  routeArrow: {
    marginHorizontal: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
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
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  carInfoText: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.base,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.primary,
  },
});
