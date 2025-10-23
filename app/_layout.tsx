import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: 'auth/phone',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen
          name="auth/phone"
          options={{
            headerShown: false,
            statusBarStyle: 'light',
            statusBarTranslucent: Platform.OS === 'android',
          }}
        />
        <Stack.Screen
          name="auth/verify"
          options={{
            headerShown: false,
            statusBarStyle: 'light',
            statusBarTranslucent: Platform.OS === 'android',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarStyle: 'dark',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" translucent={Platform.OS === 'android'} />
    </ThemeProvider>
  );
}
