// app/index.tsx
import { Redirect } from "expo-router";
import { SignedIn, useAuth, useUser } from "@clerk/clerk-expo";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const { user, isLoaded } = useUser();

  const { theme, isDark } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);
  


  // Clerk still loading
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDark ? "light-content" : "dark-content"}
        />

        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />

        <ActivityIndicator size="large" color={theme.primary} />

        <Text style={styles.loadingText}>Loading BroadCast...</Text>
      </View>
    );
  }

  // User is signed in → redirect to NameScreen
  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;

  } else 

    return <Redirect href="/(drawer)/(tabs)" />;
  



}

/* ================= STYLES ================= */
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: theme.text,
    },
  });
