import "../global.css";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { UserOnboardingProvider } from "../context/UserOnBoardingContext";
import { LevelProvider } from "../context/LevelContext";
import { tokenCache } from "@/lib/auth";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <UserOnboardingProvider>
            <LevelProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                  </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </LevelProvider>
          </UserOnboardingProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}
