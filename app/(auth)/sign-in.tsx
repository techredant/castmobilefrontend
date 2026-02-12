// app/(auth)/sign-up.tsx
import {
  ActivityIndicator,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useSignUp, useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignIn from "../../components/Button/GoogleSignIn";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LoaderKitView } from "react-native-loader-kit";


const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { theme, isDark } = useTheme();

  const onSignUpPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.log("Sign up error", err);
      setError(err?.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || loading) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Wait for Clerk to refresh user
        let retries = 0;
        let currentUser = user;
        while ((!currentUser || !currentUser.id) && retries < 5) {
          await new Promise((res) => setTimeout(res, 500));
          currentUser = useUser().user;
          retries++;
        }

        const hasNames = currentUser?.unsafeMetadata?.hasNames;

        if (!hasNames) router.replace("/nameScreen");
      }
    } catch (err: any) {
      console.log("Verification error", err);
      setError(err?.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --- Pending verification view ---
  if (pendingVerification) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDark ? "light-content" : "dark-content"}
        />
        <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={[styles.title, { color: theme.text }]}>Verify your email</Animated.Text>
        <TextInput
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          placeholderTextColor={theme.subtext}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          autoCapitalize="none"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={loading}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          {loading && 
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name={"BallScaleRippleMultiple"}
          animationSpeedMultiplier={1.0} 
          color={theme.text} 
        />}
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // --- Sign-up form ---
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={[styles.welcomeText, { color: theme.text }]}>
          Welcome to BroadCast
        </Text>
      </View>

      <Text style={[styles.label, { color: theme.text }]}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        placeholderTextColor={theme.subtext}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        keyboardType="email-address"
        autoCapitalize="none"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <Text style={[styles.label, { color: theme.text }]}>Password</Text>
      <TextInput
        placeholder="Enter your Password"
        placeholderTextColor={theme.subtext}
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        onPress={onSignUpPress}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        {loading && 
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name={"BallScaleRippleMultiple"}
          animationSpeedMultiplier={1.0} 
          color={theme.text} 
        />}
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <Pressable style={{ marginTop: 12 }}>
        <Text style={[styles.signInText, { color: theme.text }]}>
          Already have an account? <Text style={{ fontWeight: "bold" }}>Sign In</Text>
        </Text>
      </Pressable>

      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <GoogleSignIn />
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 24 },
  logo: { width: 120, height: 120, borderRadius: 60 },
  welcomeText: { fontSize: 20, fontWeight: "600", marginTop: 8 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12 },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 16, flexDirection: "row", justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center", marginLeft: 6 },
  error: { color: "red", marginTop: 4 },
  signInText: { fontSize: 14, textAlign: "center" },
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: "#ccc" },
  orText: { marginHorizontal: 8, color: "#888" },
  title: { fontSize: 14, fontWeight: "500", marginTop: 12 }
});
