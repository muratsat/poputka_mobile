import { api } from "@/api";
import { components } from "@/api/paths";
import { AppColors } from "@/constants/colors";
import { env } from "@/constants/env";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Trip = components["schemas"]["TripResponse"];

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function HomeScreen() {
  const [wsTrips, setWsTrips] = useState<Trip[]>([]);

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    api.useInfiniteQuery(
      "get",
      "/api/trips/",
      {
        params: {
          query: {
            limit: 5
          }
        }
      },
      {
        pageParamName: "cursor_date",
        getNextPageParam: (lastPage) => lastPage.at(-1)?.created_at,
        initialPageParam: null
      }
    );

  useEffect(() => {
    const wsUrl =
      env.EXPO_PUBLIC_API_URL.replace("https://", "wss://") + "/api/trips/ws/";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected to", wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const trip: Trip = JSON.parse(event.data);
        console.log("Received trip update:", trip);

        // Configure smooth layout animation for all cards moving down
        LayoutAnimation.configureNext({
          duration: 400,
          create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity
          },
          update: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.scaleXY
          }
        });

        // Add new trip to the top of the list
        setWsTrips((prevTrips) => [trip, ...prevTrips]);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  const handleCall = (trip: Trip) => {
    // In a real app, this would use the actual phone number
    console.log(`Calling ${trip.user_id}`);
    // Linking.openURL(`tel:+15551234567`);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find a Ride</Text>
      </View>

      <ScrollView
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScroll}
        onScrollEndDrag={handleScroll}
        scrollEventThrottle={400}
        style={styles.tripsList}
        contentContainerStyle={styles.tripsListContent}
        showsVerticalScrollIndicator={false}
      >
        {data?.pages.length === 0 && wsTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="car-outline"
              size={64}
              color={AppColors.textLight}
            />
            <Text style={styles.emptyStateText}>No trips found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <>
            {/* WebSocket trips at the top */}
            {wsTrips.map((trip) => (
              <AnimatedTripCard
                key={`ws-${trip.id}`}
                trip={trip}
                onCall={handleCall}
                isNew={true}
              />
            ))}
            {/* API fetched trips */}
            {data?.pages.flatMap((page) =>
              page.map((trip) => (
                <AnimatedTripCard
                  key={trip.id}
                  trip={trip}
                  onCall={handleCall}
                  isNew={false}
                />
              ))
            )}
            {isFetchingNextPage && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={AppColors.primary} />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function AnimatedTripCard({
  trip,
  onCall,
  isNew
}: {
  trip: Trip;
  onCall: (trip: Trip) => void;
  isNew?: boolean;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isNew) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();

      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isNew, fadeAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.tripCard,
        isNew && styles.newTripCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }]
        }
      ]}
    >
      <TripCard trip={trip} onCall={onCall} />
    </Animated.View>
  );
}

function TripCard({
  trip,
  onCall
}: {
  trip: Trip;
  onCall: (trip: Trip) => void;
}) {
  const isDriver = trip.role === "driver";
  const badgeColor = isDriver ? AppColors.primary : AppColors.secondary;

  return (
    <View style={styles.tripCardContent}>
      <View style={styles.tripCardHeader}>
        <View style={styles.tripCardHeaderLeft}>
          <View style={[styles.roleBadge, { backgroundColor: badgeColor }]}>
            <Ionicons
              name={isDriver ? "car" : "person"}
              size={12}
              color={AppColors.textWhite}
            />
            <Text style={styles.roleBadgeText}>
              {isDriver ? "Driver" : "Passenger"}
            </Text>
          </View>
          <Text style={styles.userName}>
            {isDriver ? "Driver" : "Passenger"}
          </Text>
        </View>
        <Text style={styles.price}>${trip.suggested_price}</Text>
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
          <Ionicons
            name="calendar-outline"
            size={14}
            color={AppColors.textSecondary}
          />
          <Text style={styles.tripDetailText}>{trip.departure_date}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Ionicons
            name="time-outline"
            size={14}
            color={AppColors.textSecondary}
          />
          <Text style={styles.tripDetailText}>{trip.departure_time}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Ionicons
            name="people-outline"
            size={14}
            color={AppColors.textSecondary}
          />
          <Text style={styles.tripDetailText}>
            {trip.number_of_people} seats
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.callButton} onPress={() => onCall(trip)}>
        <Ionicons name="call" size={16} color={AppColors.primary} />
        <Text style={styles.callButtonText}>
          Call {isDriver ? "driver" : "passenger"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base
  },
  header: {
    backgroundColor: AppColors.cardLight,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.base,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: AppColors.base,
    alignItems: "center"
  },
  filterTabActive: {
    backgroundColor: AppColors.primary
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textSecondary
  },
  filterTabTextActive: {
    color: AppColors.textWhite
  },
  tripsList: {
    flex: 1
  },
  tripsListContent: {
    padding: 16,
    paddingBottom: 100
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.textSecondary,
    marginTop: 16
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: AppColors.textLight,
    marginTop: 8
  },
  tripCard: {
    marginBottom: 12,
    position: "relative"
  },
  newTripCard: {
    shadowColor: AppColors.accent,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  tripCardContent: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  tripCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  tripCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textWhite
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    flex: 1
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.accent
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap"
  },
  routeText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: "500",
    marginLeft: 4
  },
  routeArrow: {
    marginHorizontal: 8
  },
  tripDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  tripDetailText: {
    fontSize: 13,
    color: AppColors.textSecondary
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: AppColors.border
  },
  carInfoText: {
    fontSize: 13,
    color: AppColors.textSecondary
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.base,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.primary
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.primary
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center"
  }
});
