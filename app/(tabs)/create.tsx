import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppColors } from '@/constants/colors';
import { CreateTripData, UserRole } from '@/types';

const STEPS = ['Role', 'Route', 'Details', 'Additional'];

export default function CreateTripScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState<CreateTripData>({});

  const updateTripData = (data: Partial<CreateTripData>) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
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
        return !!tripData.origin && !!tripData.destination;
      case 2:
        return !!tripData.date && !!tripData.time && !!tripData.seats && !!tripData.price;
      case 3:
        return true; // Additional info is optional
      default:
        return false;
    }
  };

  const handleCreate = () => {
    console.log('Creating trip:', tripData);
    // In a real app, submit to backend
    router.push('/(tabs)/my-trips');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header with Progress */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Ionicons name="arrow-back" size={24} color={AppColors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>Create Trip</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {STEPS.map((step, index) => (
              <View key={step} style={styles.progressItem}>
                <View
                  style={[
                    styles.progressDot,
                    index <= currentStep && styles.progressDotActive,
                  ]}
                >
                  {index < currentStep ? (
                    <Ionicons name="checkmark" size={12} color={AppColors.textWhite} />
                  ) : (
                    <Text
                      style={[
                        styles.progressNumber,
                        index <= currentStep && styles.progressNumberActive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.progressLabel,
                    index <= currentStep && styles.progressLabelActive,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 0 && <StepRole tripData={tripData} updateTripData={updateTripData} />}
          {currentStep === 1 && <StepRoute tripData={tripData} updateTripData={updateTripData} />}
          {currentStep === 2 && (
            <StepDetails tripData={tripData} updateTripData={updateTripData} />
          )}
          {currentStep === 3 && (
            <StepAdditional tripData={tripData} updateTripData={updateTripData} />
          )}
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          {currentStep === STEPS.length - 1 ? (
            <TouchableOpacity
              style={[styles.button, !canProceed() && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={!canProceed()}
            >
              <Ionicons name="checkmark" size={20} color={AppColors.textWhite} />
              <Text style={styles.buttonText}>Create Trip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, !canProceed() && styles.buttonDisabled]}
              onPress={goNext}
              disabled={!canProceed()}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color={AppColors.textWhite} />
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
  updateTripData,
}: {
  tripData: CreateTripData;
  updateTripData: (data: Partial<CreateTripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Role</Text>
      <Text style={styles.stepSubtitle}>Are you offering or looking for a ride?</Text>

      <TouchableOpacity
        style={[styles.roleCard, tripData.role === 'driver' && styles.roleCardActive]}
        onPress={() => updateTripData({ role: 'driver' })}
      >
        <Ionicons
          name="car"
          size={40}
          color={tripData.role === 'driver' ? AppColors.primary : AppColors.textLight}
        />
        <Text style={styles.roleCardTitle}>I'm a Driver</Text>
        <Text style={styles.roleCardDescription}>
          I'm offering rides to share my journey
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleCard, tripData.role === 'passenger' && styles.roleCardActive]}
        onPress={() => updateTripData({ role: 'passenger' })}
      >
        <Ionicons
          name="person"
          size={40}
          color={tripData.role === 'passenger' ? AppColors.secondary : AppColors.textLight}
        />
        <Text style={styles.roleCardTitle}>I'm a Passenger</Text>
        <Text style={styles.roleCardDescription}>I'm looking for a ride to my destination</Text>
      </TouchableOpacity>
    </View>
  );
}

// Step 2: Route Information
function StepRoute({
  tripData,
  updateTripData,
}: {
  tripData: CreateTripData;
  updateTripData: (data: Partial<CreateTripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Where are you going?</Text>
      <Text style={styles.stepSubtitle}>Enter your departure and destination cities</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>From</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="location" size={20} color={AppColors.secondary} />
          <TextInput
            style={styles.input}
            placeholder="Origin city, state"
            placeholderTextColor={AppColors.textLight}
            value={tripData.origin}
            onChangeText={(text) => updateTripData({ origin: text })}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>To</Text>
        <View style={styles.inputWithIcon}>
          <Ionicons name="location" size={20} color={AppColors.primary} />
          <TextInput
            style={styles.input}
            placeholder="Destination city, state"
            placeholderTextColor={AppColors.textLight}
            value={tripData.destination}
            onChangeText={(text) => updateTripData({ destination: text })}
          />
        </View>
      </View>
    </View>
  );
}

// Step 3: Trip Details
function StepDetails({
  tripData,
  updateTripData,
}: {
  tripData: CreateTripData;
  updateTripData: (data: Partial<CreateTripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Trip Details</Text>
      <Text style={styles.stepSubtitle}>When are you traveling?</Text>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Date</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="calendar-outline" size={20} color={AppColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={AppColors.textLight}
              value={tripData.date}
              onChangeText={(text) => updateTripData({ date: text })}
            />
          </View>
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Time</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="time-outline" size={20} color={AppColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="HH:MM"
              placeholderTextColor={AppColors.textLight}
              value={tripData.time}
              onChangeText={(text) => updateTripData({ time: text })}
            />
          </View>
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>
            Seats {tripData.role === 'driver' ? 'Available' : 'Needed'}
          </Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="people-outline" size={20} color={AppColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="1-4"
              placeholderTextColor={AppColors.textLight}
              keyboardType="number-pad"
              value={tripData.seats?.toString()}
              onChangeText={(text) => updateTripData({ seats: parseInt(text) || 0 })}
            />
          </View>
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.inputLabel}>Price per Seat</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="cash-outline" size={20} color={AppColors.accent} />
            <TextInput
              style={styles.input}
              placeholder="$0"
              placeholderTextColor={AppColors.textLight}
              keyboardType="number-pad"
              value={tripData.price?.toString()}
              onChangeText={(text) => updateTripData({ price: parseInt(text) || 0 })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

// Step 4: Additional Information
function StepAdditional({
  tripData,
  updateTripData,
}: {
  tripData: CreateTripData;
  updateTripData: (data: Partial<CreateTripData>) => void;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Additional Information</Text>
      <Text style={styles.stepSubtitle}>Add optional details about your trip</Text>

      {tripData.role === 'driver' && (
        <>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Car Information (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="car-sport-outline" size={20} color={AppColors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Toyota Camry"
                placeholderTextColor={AppColors.textLight}
                value={tripData.carInfo}
                onChangeText={(text) => updateTripData({ carInfo: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Car Year (Optional)</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="calendar-outline" size={20} color={AppColors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="e.g., 2022"
                placeholderTextColor={AppColors.textLight}
                keyboardType="number-pad"
                value={tripData.carYear}
                onChangeText={(text) => updateTripData({ carYear: text })}
              />
            </View>
          </View>
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Comments (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Any additional information (luggage, stops, preferences, etc.)"
          placeholderTextColor={AppColors.textLight}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={tripData.comments}
          onChangeText={(text) => updateTripData({ comments: text })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.base,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: AppColors.cardLight,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: AppColors.primary,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  progressNumberActive: {
    color: AppColors.textWhite,
  },
  progressLabel: {
    fontSize: 12,
    color: AppColors.textLight,
  },
  progressLabelActive: {
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  roleCard: {
    backgroundColor: AppColors.cardLight,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: AppColors.border,
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: AppColors.primary,
    backgroundColor: AppColors.base,
  },
  roleCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  roleCardDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: AppColors.textPrimary,
  },
  textArea: {
    height: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: AppColors.cardLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    padding: 20,
    backgroundColor: AppColors.cardLight,
    borderTopWidth: 1,
    borderTopColor: AppColors.border,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: AppColors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: AppColors.textLight,
    opacity: 0.5,
  },
  buttonText: {
    color: AppColors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
});
