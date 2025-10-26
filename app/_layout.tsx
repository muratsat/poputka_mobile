import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { isAuthenticated } from "@/utils/auth";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)/explore"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const setup = async () => {
      const authenticated = await isAuthenticated();
      if (!authenticated) router.replace("/auth/phone");
      else router.replace("/(tabs)");
    };

    void setup();
  });

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent"
          }
        }}
      >
        <Stack.Screen
          name="auth/phone"
          options={{
            headerShown: false,
            statusBarStyle: "light",
            statusBarTranslucent: Platform.OS === "android"
          }}
        />
        <Stack.Screen
          name="auth/verify"
          options={{
            headerShown: false,
            statusBarStyle: "light",
            statusBarTranslucent: Platform.OS === "android"
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            statusBarStyle: "dark"
          }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" translucent={Platform.OS === "android"} />
    </ThemeProvider>
  );
}
