import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppColors } from '@/constants/colors';

export default function PhoneEntryScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (phoneNumber.length >= 10) {
      router.push('/auth/verify');
    }
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[AppColors.gradientStart, AppColors.gradientEnd]}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="car" size={40} color={AppColors.textWhite} />
              <Ionicons
                name="people"
                size={24}
                color={AppColors.textWhite}
                style={styles.logoSecondary}
              />
            </View>
            <Text style={styles.appTitle}>Poputka</Text>
            <Text style={styles.appSubtitle}>Your ride-sharing companion</Text>
          </View>

          {/* Phone Entry Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome</Text>
            <Text style={styles.cardSubtitle}>
              Enter your phone number to receive a verification code
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="call-outline"
                size={24}
                color={AppColors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={AppColors.textLight}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                phoneNumber.length < 10 && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={phoneNumber.length < 10}
            >
              <Text style={styles.buttonText}>Send Code</Text>
              <Ionicons name="arrow-forward" size={20} color={AppColors.textWhite} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoSecondary: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.textWhite,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: AppColors.textWhite,
    opacity: 0.9,
  },
  card: {
    width: '100%',
    backgroundColor: AppColors.cardLight,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: AppColors.border,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: AppColors.base,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: AppColors.textPrimary,
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
  footer: {
    fontSize: 12,
    color: AppColors.textWhite,
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.8,
    paddingHorizontal: 40,
  },
});
