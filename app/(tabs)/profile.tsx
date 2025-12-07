import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppColors } from "@/constants/colors";
import { api } from "@/api";
import { setItem } from "@/secure-store";

export default function ProfileScreen() {
  const { data: user, isLoading } = api.useQuery(
    "get",
    "/api/auth/token/verify"
  );

  const handleLogout = async () => {
    Alert.alert("Выйти", "Вы уверены, что хотите выйти?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Выйти",
        style: "destructive",
        onPress: async () => {
          await setItem("accessToken", "");
          await setItem("refreshToken", "");
          router.replace("/auth/phone");
        }
      }
    ]);
  };

  const handleNotImplemented = (feature: string) => {
    Alert.alert("В разработке", `Функция "${feature}" пока не реализована`);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user?.name)}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || "Пользователь"}</Text>
          <Text style={styles.userPhone}>{user?.phone_number}</Text>
        </View>

        {/* Statistics - Not available in API */}
        <View style={styles.notImplementedSection}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={AppColors.textSecondary}
          />
          <Text style={styles.notImplementedSectionText}>
            Статистика поездок пока не доступна через API
          </Text>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNotImplemented("Редактировать профиль")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: AppColors.primary + "20" }
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={AppColors.primary}
                />
              </View>
              <Text style={styles.menuItemText}>Редактировать профиль</Text>
            </View>
            <View style={styles.notImplementedBadge}>
              <Text style={styles.notImplementedBadgeText}>Скоро</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNotImplemented("Мои автомобили")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: AppColors.secondary + "20" }
                ]}
              >
                <Ionicons
                  name="car-sport-outline"
                  size={20}
                  color={AppColors.secondary}
                />
              </View>
              <Text style={styles.menuItemText}>Мои автомобили</Text>
            </View>
            <View style={styles.notImplementedBadge}>
              <Text style={styles.notImplementedBadgeText}>Скоро</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNotImplemented("Сохраненные места")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: AppColors.accent + "20" }
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={AppColors.accentDark}
                />
              </View>
              <Text style={styles.menuItemText}>Сохраненные места</Text>
            </View>
            <View style={styles.notImplementedBadge}>
              <Text style={styles.notImplementedBadgeText}>Скоро</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNotImplemented("Настройки")}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: AppColors.textLight + "20" }
                ]}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={AppColors.textSecondary}
                />
              </View>
              <Text style={styles.menuItemText}>Настройки</Text>
            </View>
            <View style={styles.notImplementedBadge}>
              <Text style={styles.notImplementedBadgeText}>Скоро</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={AppColors.destructive}
          />
          <Text style={styles.logoutButtonText}>Выйти</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Попутка v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    fontSize: 16,
    color: AppColors.textSecondary
  },
  content: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 100
  },
  userCard: {
    backgroundColor: AppColors.cardLight,
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border
  },
  avatarContainer: {
    marginBottom: 16
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: AppColors.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: AppColors.textWhite
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 4
  },
  userPhone: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 12
  },
  notImplementedSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  notImplementedSectionText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 18
  },
  menuContainer: {
    backgroundColor: AppColors.cardLight,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: "hidden"
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  menuItemText: {
    fontSize: 16,
    color: AppColors.textPrimary,
    fontWeight: "500"
  },
  notImplementedBadge: {
    backgroundColor: AppColors.textLight + "40",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  notImplementedBadgeText: {
    fontSize: 11,
    color: AppColors.textSecondary,
    fontWeight: "600"
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: AppColors.destructive,
    gap: 8
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.destructive
  },
  versionText: {
    fontSize: 12,
    color: AppColors.textLight,
    textAlign: "center",
    marginBottom: 24
  }
});
