import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { AppColors } from "@/constants/colors";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  // Calculate proper tab bar height to accommodate larger icon
  const tabBarHeight = Platform.select({
    ios: 70 + insets.bottom,
    android: 70 + insets.bottom,
    default: 70
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.textLight,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: AppColors.cardLight,
          borderTopColor: AppColors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 8,
          paddingTop: 12
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4
        },
        tabBarIconStyle: {
          marginTop: 4
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="my-trips"
        options={{
          title: "Мои поездки",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Создать",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={28}
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          )
        }}
      />
      {/* Hide the old explore tab */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}
