import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AppColors } from "@/constants/colors";
import { components } from "@/api/paths";
import { api } from "@/api";

type TripRole = components["schemas"]["TripRole"];
type TripType = components["schemas"]["TripType"];

const KYRGYZ_CITIES = [
  "Бишкек",
  "Ош",
  "Джалал-Абад",
  "Каракол",
  "Токмок",
  "Узген",
  "Балыкчы",
  "Кара-Балта",
  "Талас",
  "Нарын",
  "Баткен",
  "Кызыл-Кия"
];

const STEPS = [
  "Роль",
  "Тип",
  "Откуда",
  "Куда",
  "Дата",
  "Время",
  "Места",
  "Цена",
  "Комментарий"
];

interface TripData {
  role?: TripRole;
  type?: TripType | null;
  origin?: string;
  destination?: string;
  departure_date?: string;
  departure_time?: string | null;
  departure_now?: boolean;
  number_of_people?: number;
  suggested_price?: number | null;
  comment?: string | null;
}

export default function CreateTripScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);
  const [tripData, setTripData] = useState<TripData>({
    departure_now: false,
    type: null,
    suggested_price: null,
    comment: null
  });

  const { mutate: createTrip, isPending } = api.useMutation(
    "post",
    "/api/trips/"
  );

  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const goToStep = (step: number) => {
    // Allow navigation to any previously visited step or current step
    if (step <= highestStep) {
      setCurrentStep(step);
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Track the highest step reached
      if (nextStep > highestStep) {
        setHighestStep(nextStep);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!tripData.role;
      case 1:
        return true; // Type is optional
      case 2:
        return !!tripData.origin;
      case 3:
        return !!tripData.destination;
      case 4:
        return !!tripData.departure_date;
      case 5:
        return tripData.departure_now || !!tripData.departure_time;
      case 6:
        return !!tripData.number_of_people && tripData.number_of_people > 0;
      case 7:
        return true; // Price is optional
      case 8:
        return true; // Comment is optional
      default:
        return false;
    }
  };

  const getStepSummary = (step: number): string | null => {
    switch (step) {
      case 0:
        return tripData.role
          ? tripData.role === "driver"
            ? "Водитель"
            : "Пассажир"
          : null;
      case 1:
        return tripData.type
          ? tripData.type === "salon"
            ? "Салон"
            : tripData.type === "hitch_ride"
              ? "Попутка"
              : "Доставка"
          : "Не указано";
      case 2:
        return tripData.origin || null;
      case 3:
        return tripData.destination || null;
      case 4:
        return tripData.departure_date || null;
      case 5:
        return tripData.departure_now
          ? "Сейчас"
          : tripData.departure_time || null;
      case 6:
        return tripData.number_of_people
          ? `${tripData.number_of_people} мест`
          : null;
      case 7:
        return tripData.suggested_price
          ? `${tripData.suggested_price} сом`
          : "Не указано";
      case 8:
        return tripData.comment ? "Добавлено" : "Не добавлено";
      default:
        return null;
    }
  };

  const handleCreate = () => {
    if (!tripData.role || !tripData.origin || !tripData.destination) {
      Alert.alert("Ошибка", "Заполните все обязательные поля");
      return;
    }

    const payload: components["schemas"]["TripCreate"] = {
      role: tripData.role,
      type: tripData.type || null,
      origin: tripData.origin,
      destination: tripData.destination,
      departure_date: tripData.departure_date!,
      departure_time: tripData.departure_time || null,
      departure_now: tripData.departure_now || false,
      number_of_people: tripData.number_of_people || 1,
      suggested_price: tripData.suggested_price || null,
      comment: tripData.comment || null
    };

    createTrip(
      { body: payload },
      {
        onSuccess: () => {
          Alert.alert("Успех", "Поездка создана!", [
            {
              text: "OK",
              onPress: () => router.push("/(tabs)/my-trips")
            }
          ]);
        },
        onError: (error) => {
          Alert.alert("Ошибка", "Не удалось создать поездку");
          console.error(error);
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header with Breadcrumb Navigation */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={AppColors.textPrimary}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>Создать поездку</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Breadcrumb Navigation */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.breadcrumbContainer}
            contentContainerStyle={styles.breadcrumbContent}
          >
            {STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isAccessible = index <= highestStep;
              const summary = getStepSummary(index);

              return (
                <TouchableOpacity
                  key={step}
                  style={[
                    styles.breadcrumbItem,
                    isCurrent && styles.breadcrumbItemActive,
                    !isAccessible && styles.breadcrumbItemDisabled
                  ]}
                  onPress={() => goToStep(index)}
                  disabled={!isAccessible}
                >
                  <View style={styles.breadcrumbIcon}>
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={AppColors.primary}
                      />
                    ) : (
                      <View
                        style={[
                          styles.breadcrumbDot,
                          isCurrent && styles.breadcrumbDotActive
                        ]}
                      >
                        <Text
                          style={[
                            styles.breadcrumbNumber,
                            isCurrent && styles.breadcrumbNumberActive
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.breadcrumbText}>
                    <Text
                      style={[
                        styles.breadcrumbLabel,
                        isCurrent && styles.breadcrumbLabelActive
                      ]}
                    >
                      {step}
                    </Text>
                    {summary && (
                      <Text style={styles.breadcrumbSummary}>{summary}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 0 && (
            <StepRole tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 1 && (
            <StepType tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 2 && (
            <StepOrigin tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 3 && (
            <StepDestination
              tripData={tripData}
              updateTripData={updateTripData}
            />
          )}
          {currentStep === 4 && (
            <StepDate tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 5 && (
            <StepTime tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 6 && (
            <StepSeats tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 7 && (
            <StepPrice tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 8 && (
            <StepComment tripData={tripData} updateTripData={updateTripData} />
          )}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          {currentStep === STEPS.length - 1 ? (
            <TouchableOpacity
              style={[
                styles.button,
                (!canProceed() || isPending) && styles.buttonDisabled
              ]}
              onPress={handleCreate}
              disabled={!canProceed() || isPending}
            >
              <Ionicons name="checkmark" size={20} color={AppColors.textWhite} />
              <Text style={styles.buttonText}>
                {isPending ? "Создание..." : "Создать поездку"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, !canProceed() && styles.buttonDisabled]}
              onPress={goNext}
              disabled={!canProceed()}
            >
              <Text style={styles.buttonText}>Далее</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={AppColors.textWhite}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Step 1: Role Selection
function StepRole({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Выберите вашу роль</Text>
      <Text style={styles.stepSubtitle}>
        Вы предлагаете или ищете поездку?
      </Text>

      <TouchableOpacity
        style={[
          styles.roleCard,
          tripData.role === "driver" && styles.roleCardActive
        ]}
        onPress={() => updateTripData({ role: "driver" })}
      >
        <Ionicons
          name="car"
          size={40}
          color={
            tripData.role === "driver" ? AppColors.primary : AppColors.textLight
          }
        />
        <Text style={styles.roleCardTitle}>Я водитель</Text>
        <Text style={styles.roleCardDescription}>
          Я предлагаю места в своей машине
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleCard,
          tripData.role === "passenger" && styles.roleCardActive
        ]}
        onPress={() => updateTripData({ role: "passenger" })}
      >
        <Ionicons
          name="person"
          size={40}
          color={
            tripData.role === "passenger"
              ? AppColors.secondary
              : AppColors.textLight
          }
        />
        <Text style={styles.roleCardTitle}>Я пассажир</Text>
        <Text style={styles.roleCardDescription}>Я ищу поездку</Text>
      </TouchableOpacity>
    </View>
  );
}

// Step 2: Trip Type
function StepType({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Тип поездки (необязательно)</Text>
      <Text style={styles.stepSubtitle}>Выберите тип вашей поездки</Text>

      <TouchableOpacity
        style={[
          styles.typeCard,
          tripData.type === "salon" && styles.typeCardActive
        ]}
        onPress={() => updateTripData({ type: "salon" })}
      >
        <Ionicons
          name="car-sport"
          size={32}
          color={
            tripData.type === "salon" ? AppColors.primary : AppColors.textLight
          }
        />
        <View style={styles.typeCardText}>
          <Text style={styles.typeCardTitle}>Салон такси</Text>
          <Text style={styles.typeCardDescription}>
            Комфортная поездка на такси
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeCard,
          tripData.type === "hitch_ride" && styles.typeCardActive
        ]}
        onPress={() => updateTripData({ type: "hitch_ride" })}
      >
        <Ionicons
          name="car"
          size={32}
          color={
            tripData.type === "hitch_ride"
              ? AppColors.primary
              : AppColors.textLight
          }
        />
        <View style={styles.typeCardText}>
          <Text style={styles.typeCardTitle}>Попутка</Text>
          <Text style={styles.typeCardDescription}>
            Поездка с попутчиками
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeCard,
          tripData.type === "delivery" && styles.typeCardActive
        ]}
        onPress={() => updateTripData({ type: "delivery" })}
      >
        <Ionicons
          name="cube"
          size={32}
          color={
            tripData.type === "delivery"
              ? AppColors.primary
              : AppColors.textLight
          }
        />
        <View style={styles.typeCardText}>
          <Text style={styles.typeCardTitle}>Доставка</Text>
          <Text style={styles.typeCardDescription}>Доставка груза</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeCard,
          tripData.type === null && styles.typeCardActive
        ]}
        onPress={() => updateTripData({ type: null })}
      >
        <Ionicons
          name="help-circle-outline"
          size={32}
          color={
            tripData.type === null ? AppColors.primary : AppColors.textLight
          }
        />
        <View style={styles.typeCardText}>
          <Text style={styles.typeCardTitle}>Не указывать</Text>
          <Text style={styles.typeCardDescription}>Пропустить этот шаг</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// Step 3: Origin
function StepOrigin({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const [customCity, setCustomCity] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Откуда</Text>
      <Text style={styles.stepSubtitle}>Выберите город отправления</Text>

      <View style={styles.cityGrid}>
        {KYRGYZ_CITIES.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityButton,
              tripData.origin === city && styles.cityButtonActive
            ]}
            onPress={() => {
              updateTripData({ origin: city });
              setShowCustomInput(false);
            }}
          >
            <Text
              style={[
                styles.cityButtonText,
                tripData.origin === city && styles.cityButtonTextActive
              ]}
            >
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons name="add-circle-outline" size={20} color={AppColors.primary} />
        <Text style={styles.customCityButtonText}>Другой город</Text>
      </TouchableOpacity>

      {showCustomInput && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.customInput}
            placeholder="Введите название города"
            placeholderTextColor={AppColors.textLight}
            value={customCity}
            onChangeText={setCustomCity}
            onSubmitEditing={() => {
              if (customCity.trim()) {
                updateTripData({ origin: customCity.trim() });
                setCustomCity("");
                setShowCustomInput(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Step 4: Destination
function StepDestination({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const [customCity, setCustomCity] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Куда</Text>
      <Text style={styles.stepSubtitle}>Выберите город назначения</Text>

      <View style={styles.cityGrid}>
        {KYRGYZ_CITIES.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityButton,
              tripData.destination === city && styles.cityButtonActive
            ]}
            onPress={() => {
              updateTripData({ destination: city });
              setShowCustomInput(false);
            }}
          >
            <Text
              style={[
                styles.cityButtonText,
                tripData.destination === city && styles.cityButtonTextActive
              ]}
            >
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons name="add-circle-outline" size={20} color={AppColors.primary} />
        <Text style={styles.customCityButtonText}>Другой город</Text>
      </TouchableOpacity>

      {showCustomInput && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.customInput}
            placeholder="Введите название города"
            placeholderTextColor={AppColors.textLight}
            value={customCity}
            onChangeText={setCustomCity}
            onSubmitEditing={() => {
              if (customCity.trim()) {
                updateTripData({ destination: customCity.trim() });
                setCustomCity("");
                setShowCustomInput(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Step 5: Date
function StepDate({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const getDatePreset = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  const getDateLabel = (daysFromNow: number): string => {
    if (daysFromNow === 0) return "Сегодня";
    if (daysFromNow === 1) return "Завтра";
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long"
    });
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setPickerDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split("T")[0];
      updateTripData({
        departure_date: formattedDate,
        departure_now: false
      });

      if (Platform.OS === "ios") {
        // For iOS, we'll close it manually with a button
      }
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Когда</Text>
      <Text style={styles.stepSubtitle}>Выберите дату отправления</Text>

      <TouchableOpacity
        style={[
          styles.dateButton,
          tripData.departure_now && styles.dateButtonActive
        ]}
        onPress={() => {
          updateTripData({
            departure_now: true,
            departure_date: getDatePreset(0),
            departure_time: null
          });
          setShowDatePicker(false);
        }}
      >
        <Ionicons
          name="flash"
          size={24}
          color={
            tripData.departure_now ? AppColors.textWhite : AppColors.accent
          }
        />
        <Text
          style={[
            styles.dateButtonText,
            tripData.departure_now && styles.dateButtonTextActive
          ]}
        >
          Сейчас
        </Text>
      </TouchableOpacity>

      <View style={styles.dateGrid}>
        {[0, 1, 2, 3, 4].map((days) => {
          const date = getDatePreset(days);
          const isSelected = tripData.departure_date === date && !tripData.departure_now;

          return (
            <TouchableOpacity
              key={days}
              style={[
                styles.datePresetButton,
                isSelected && styles.datePresetButtonActive
              ]}
              onPress={() => {
                updateTripData({ departure_date: date, departure_now: false });
                setShowDatePicker(false);
              }}
            >
              <Text
                style={[
                  styles.datePresetText,
                  isSelected && styles.datePresetTextActive
                ]}
              >
                {getDateLabel(days)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowDatePicker(!showDatePicker)}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={AppColors.primary}
        />
        <Text style={styles.customCityButtonText}>Другая дата</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
            textColor={AppColors.textPrimary}
          />
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.datePickerDoneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneButtonText}>Готово</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {tripData.departure_date && !tripData.departure_now && (
        <View style={styles.selectedDateDisplay}>
          <Ionicons
            name="calendar"
            size={16}
            color={AppColors.primary}
          />
          <Text style={styles.selectedDateText}>
            Выбрано: {new Date(tripData.departure_date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric"
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

// Step 6: Time
function StepTime({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const [customTime, setCustomTime] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (tripData.departure_now) {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Время</Text>
        <Text style={styles.stepSubtitle}>
          Вы выбрали отправление "Сейчас", время не требуется
        </Text>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={48} color={AppColors.primary} />
          <Text style={styles.infoText}>Время отправления: сейчас</Text>
        </View>
      </View>
    );
  }

  const timePresets = [
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00"
  ];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Время</Text>
      <Text style={styles.stepSubtitle}>Выберите время отправления</Text>

      <View style={styles.timeGrid}>
        {timePresets.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              tripData.departure_time === time && styles.timeButtonActive
            ]}
            onPress={() => {
              updateTripData({ departure_time: time });
              setShowCustomInput(false);
            }}
          >
            <Text
              style={[
                styles.timeButtonText,
                tripData.departure_time === time && styles.timeButtonTextActive
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons name="time-outline" size={20} color={AppColors.primary} />
        <Text style={styles.customCityButtonText}>Другое время</Text>
      </TouchableOpacity>

      {showCustomInput && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.customInput}
            placeholder="ЧЧ:МM (например, 15:30)"
            placeholderTextColor={AppColors.textLight}
            value={customTime}
            onChangeText={setCustomTime}
            onSubmitEditing={() => {
              if (customTime.trim()) {
                updateTripData({ departure_time: customTime.trim() });
                setCustomTime("");
                setShowCustomInput(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Step 7: Seats
function StepSeats({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const [customSeats, setCustomSeats] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Количество мест</Text>
      <Text style={styles.stepSubtitle}>
        {tripData.role === "driver"
          ? "Сколько мест вы предлагаете?"
          : "Сколько мест вам нужно?"}
      </Text>

      <View style={styles.seatsGrid}>
        {[1, 2, 3, 4, 5, 6].map((seats) => (
          <TouchableOpacity
            key={seats}
            style={[
              styles.seatButton,
              tripData.number_of_people === seats && styles.seatButtonActive
            ]}
            onPress={() => {
              updateTripData({ number_of_people: seats });
              setShowCustomInput(false);
            }}
          >
            <Text
              style={[
                styles.seatButtonText,
                tripData.number_of_people === seats && styles.seatButtonTextActive
              ]}
            >
              {seats}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons name="add-circle-outline" size={20} color={AppColors.primary} />
        <Text style={styles.customCityButtonText}>Другое количество</Text>
      </TouchableOpacity>

      {showCustomInput && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.customInput}
            placeholder="Введите количество мест"
            placeholderTextColor={AppColors.textLight}
            keyboardType="number-pad"
            value={customSeats}
            onChangeText={setCustomSeats}
            onSubmitEditing={() => {
              const seats = parseInt(customSeats);
              if (!isNaN(seats) && seats > 0) {
                updateTripData({ number_of_people: seats });
                setCustomSeats("");
                setShowCustomInput(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Step 8: Price
function StepPrice({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  const [customPrice, setCustomPrice] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const pricePresets = [100, 200, 300, 500, 700, 1000, 1500, 2000];

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Цена (необязательно)</Text>
      <Text style={styles.stepSubtitle}>
        {tripData.role === "driver"
          ? "Сколько стоит одно место?"
          : "Сколько вы готовы заплатить?"}
      </Text>

      <TouchableOpacity
        style={[
          styles.priceSkipButton,
          tripData.suggested_price === null && styles.priceSkipButtonActive
        ]}
        onPress={() => {
          updateTripData({ suggested_price: null });
          setShowCustomInput(false);
        }}
      >
        <Ionicons
          name="close-circle-outline"
          size={24}
          color={
            tripData.suggested_price === null
              ? AppColors.textWhite
              : AppColors.textSecondary
          }
        />
        <Text
          style={[
            styles.priceSkipButtonText,
            tripData.suggested_price === null && styles.priceSkipButtonTextActive
          ]}
        >
          Не указывать цену
        </Text>
      </TouchableOpacity>

      <View style={styles.priceGrid}>
        {pricePresets.map((price) => (
          <TouchableOpacity
            key={price}
            style={[
              styles.priceButton,
              tripData.suggested_price === price && styles.priceButtonActive
            ]}
            onPress={() => {
              updateTripData({ suggested_price: price });
              setShowCustomInput(false);
            }}
          >
            <Text
              style={[
                styles.priceButtonText,
                tripData.suggested_price === price && styles.priceButtonTextActive
              ]}
            >
              {price} сом
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.customCityButton}
        onPress={() => setShowCustomInput(!showCustomInput)}
      >
        <Ionicons name="cash-outline" size={20} color={AppColors.primary} />
        <Text style={styles.customCityButtonText}>Другая цена</Text>
      </TouchableOpacity>

      {showCustomInput && (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.customInput}
            placeholder="Введите цену в сомах"
            placeholderTextColor={AppColors.textLight}
            keyboardType="number-pad"
            value={customPrice}
            onChangeText={setCustomPrice}
            onSubmitEditing={() => {
              const price = parseInt(customPrice);
              if (!isNaN(price) && price >= 0) {
                updateTripData({ suggested_price: price });
                setCustomPrice("");
                setShowCustomInput(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Step 9: Comment
function StepComment({
  tripData,
  updateTripData
}: {
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Комментарий (необязательно)</Text>
      <Text style={styles.stepSubtitle}>
        Добавьте дополнительную информацию о поездке
      </Text>

      <TextInput
        style={styles.commentInput}
        placeholder="Например: есть место для багажа, можно с питомцами, остановка в Токмоке..."
        placeholderTextColor={AppColors.textLight}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        value={tripData.comment || ""}
        onChangeText={(text) => updateTripData({ comment: text || null })}
      />

      <Text style={styles.commentHint}>
        Этот комментарий увидят другие пользователи
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base
  },
  keyboardView: {
    flex: 1
  },
  header: {
    backgroundColor: AppColors.cardLight,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: AppColors.textPrimary
  },
  breadcrumbContainer: {
    maxHeight: 80
  },
  breadcrumbContent: {
    paddingHorizontal: 20,
    gap: 12
  },
  breadcrumbItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: AppColors.base,
    minWidth: 120
  },
  breadcrumbItemActive: {
    backgroundColor: AppColors.primary + "20"
  },
  breadcrumbItemDisabled: {
    opacity: 0.5
  },
  breadcrumbIcon: {
    width: 20,
    alignItems: "center"
  },
  breadcrumbDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: AppColors.border,
    justifyContent: "center",
    alignItems: "center"
  },
  breadcrumbDotActive: {
    backgroundColor: AppColors.primary
  },
  breadcrumbNumber: {
    fontSize: 11,
    fontWeight: "600",
    color: AppColors.textSecondary
  },
  breadcrumbNumberActive: {
    color: AppColors.textWhite
  },
  breadcrumbText: {
    flex: 1
  },
  breadcrumbLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.textSecondary
  },
  breadcrumbLabelActive: {
    color: AppColors.primary
  },
  breadcrumbSummary: {
    fontSize: 11,
    color: AppColors.textLight,
    marginTop: 2
  },
  content: {
    flex: 1
  },
  contentContainer: {
    paddingBottom: 100
  },
  stepContainer: {
    padding: 20
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 8
  },
  stepSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 24,
    lineHeight: 20
  },
  roleCard: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: AppColors.border,
    alignItems: "center"
  },
  roleCardActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + "10"
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginTop: 12,
    marginBottom: 8
  },
  roleCardDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center"
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: AppColors.border,
    gap: 16
  },
  typeCardActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.primary + "10"
  },
  typeCardText: {
    flex: 1
  },
  typeCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4
  },
  typeCardDescription: {
    fontSize: 13,
    color: AppColors.textSecondary
  },
  cityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  cityButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: AppColors.cardLight,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  cityButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary
  },
  cityButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.textPrimary
  },
  cityButtonTextActive: {
    color: AppColors.textWhite
  },
  customCityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderStyle: "dashed"
  },
  customCityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.primary
  },
  inputGroup: {
    marginTop: 16
  },
  customInput: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: AppColors.cardLight,
    borderWidth: 2,
    borderColor: AppColors.border,
    marginBottom: 16
  },
  dateButtonActive: {
    backgroundColor: AppColors.accent,
    borderColor: AppColors.accent
  },
  dateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary
  },
  dateButtonTextActive: {
    color: AppColors.textWhite
  },
  dateGrid: {
    gap: 8,
    marginBottom: 16
  },
  datePresetButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: AppColors.cardLight,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  datePresetButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary
  },
  datePresetText: {
    fontSize: 15,
    fontWeight: "500",
    color: AppColors.textPrimary,
    textAlign: "center"
  },
  datePresetTextActive: {
    color: AppColors.textWhite
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: AppColors.cardLight,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  timeButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary
  },
  timeButtonTextActive: {
    color: AppColors.textWhite
  },
  seatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16
  },
  seatButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: AppColors.cardLight,
    borderWidth: 2,
    borderColor: AppColors.border,
    justifyContent: "center",
    alignItems: "center"
  },
  seatButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary
  },
  seatButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: AppColors.textPrimary
  },
  seatButtonTextActive: {
    color: AppColors.textWhite
  },
  priceSkipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: AppColors.cardLight,
    borderWidth: 2,
    borderColor: AppColors.border,
    marginBottom: 16
  },
  priceSkipButtonActive: {
    backgroundColor: AppColors.textSecondary,
    borderColor: AppColors.textSecondary
  },
  priceSkipButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.textSecondary
  },
  priceSkipButtonTextActive: {
    color: AppColors.textWhite
  },
  priceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16
  },
  priceButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: AppColors.cardLight,
    borderWidth: 1,
    borderColor: AppColors.border
  },
  priceButtonActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary
  },
  priceButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary
  },
  priceButtonTextActive: {
    color: AppColors.textWhite
  },
  commentInput: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: AppColors.textPrimary,
    borderWidth: 1,
    borderColor: AppColors.border,
    minHeight: 120,
    marginBottom: 12
  },
  commentHint: {
    fontSize: 12,
    color: AppColors.textLight,
    fontStyle: "italic"
  },
  infoCard: {
    backgroundColor: AppColors.primary + "10",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.primary + "30"
  },
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.primary,
    marginTop: 16
  },
  datePickerContainer: {
    marginTop: 16,
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: "hidden"
  },
  datePickerDoneButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: AppColors.border
  },
  datePickerDoneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textWhite
  },
  selectedDateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: AppColors.primary + "10",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColors.primary + "30"
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.primary
  },
  footer: {
    padding: 20,
    backgroundColor: AppColors.cardLight,
    borderTopWidth: 1,
    borderTopColor: AppColors.border
  },
  button: {
    flexDirection: "row",
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  buttonDisabled: {
    backgroundColor: AppColors.textLight,
    opacity: 0.5
  },
  buttonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: "600"
  }
});
