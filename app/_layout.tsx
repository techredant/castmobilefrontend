import "../global.css";
import 'react-native-reanimated';

import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { UserOnboardingProvider } from "../context/UserOnBoardingContext";
import { LevelProvider } from "../context/LevelContext";
import { tokenCache } from "@/lib/auth";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ChatProvider from "@/providers/ChatProviders";
import NotificationsProvider from "@/providers/NotificationsProvider";
import CallProvider from "@/providers/CallProvider";
import { MenuProvider } from "react-native-popup-menu";
// SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  // const  user  = useAuth();
  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
                    <GestureHandlerRootView style={{ flex: 1 }}>

          <MenuProvider>
          <LevelProvider>
          {/* <NotificationsProvider>*/}
            {/* <ChatProvider>  */}
              <UserOnboardingProvider>
                      {/* <BottomSheetModalProvider> */}
                        {/* <Stack>
                          <Stack.Protected guard={!!user}>
                            <Stack.Screen name="/(auth)/sign-in" options={{ headerShown: false }} />
                          </Stack.Protected>
                           <Stack.Protected guard={user}>
                            <Stack.Screen name="/(drawer)/(tabs)" options={{ headerShown: false }} />
                          </Stack.Protected>
                        </Stack> */}
                        <Stack screenOptions={{ headerShown: false }} />
                      {/* </BottomSheetModalProvider> */}
              </UserOnboardingProvider>
          {/* </ChatProvider> */}
           {/*  </NotificationsProvider> */}
        </LevelProvider></MenuProvider></GestureHandlerRootView>
        </ClerkLoaded>
      </ClerkProvider>
    </ThemeProvider>
  );
}
