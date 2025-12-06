import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { isAuthenticated } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const setup = async () => {
      try {
        const authenticated = await isAuthenticated();

        setIsReady(true);

        // Wait a tick for the navigation to be ready
        setTimeout(() => {
          if (!authenticated) {
            router.replace("/auth/phone");
          } else {
            router.replace("/(tabs)");
          }
        }, 0);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsReady(true);
        setTimeout(() => {
          router.replace("/auth/phone");
        }, 0);
      }
    };

    void setup();
  }, [router]);

  useEffect(() => {
    if (isReady) {
      // Small delay to ensure navigation completes before hiding splash
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }
  }, [isReady]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        {isReady && (
          <>
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
          </>
        )}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
