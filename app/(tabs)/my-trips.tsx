import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";

export default function MyTripsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои поездки</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.notImplementedCard}>
          <Ionicons
            name="construct-outline"
            size={80}
            color={AppColors.primary}
          />
          <Text style={styles.notImplementedTitle}>В разработке</Text>
          <Text style={styles.notImplementedText}>
            Функция "Мои поездки" еще не реализована на сервере.
          </Text>
          <Text style={styles.notImplementedSubtext}>
            API не предоставляет эндпоинты для получения, редактирования и
            удаления пользовательских поездок.
          </Text>
        </View>

        <View style={styles.featuresList}>
          <Text style={styles.featuresTitle}>Ожидаемые возможности:</Text>

          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={AppColors.textSecondary}
            />
            <Text style={styles.featureText}>Просмотр моих поездок</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={AppColors.textSecondary}
            />
            <Text style={styles.featureText}>
              Фильтрация по статусу (активные, завершенные, отмененные)
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={AppColors.textSecondary}
            />
            <Text style={styles.featureText}>Редактирование поездок</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={AppColors.textSecondary}
            />
            <Text style={styles.featureText}>Отмена поездок</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={AppColors.textSecondary}
            />
            <Text style={styles.featureText}>Детальная информация</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  notImplementedCard: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: AppColors.primary + "30",
    marginBottom: 32
  },
  notImplementedTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginTop: 20,
    marginBottom: 12
  },
  notImplementedText: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24
  },
  notImplementedSubtext: {
    fontSize: 13,
    color: AppColors.textLight,
    textAlign: "center",
    lineHeight: 20
  },
  featuresList: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 16
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  featureText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    flex: 1
  }
});
