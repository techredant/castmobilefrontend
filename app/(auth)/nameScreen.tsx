// app/(auth)/nameScreen.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useUserOnboarding } from "../../context/UserOnBoardingContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

const accountOptions = [
  "Personal Account",
  "Business Account",
  "Non-profit and Community Account",
  "Public Figure Account",
  "Media and Publisher Account",
  "News and Media Outlet",
  "E-commerce and Retail Account",
  "Entertainment and Event Account",
];

const NamesScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { theme, isDark } = useTheme();

  const {
    firstName = "",
    setFirstName,
    lastName = "",
    setLastName,
    nickName = "",
    setNickName,
    image = user?.imageUrl,
    setImage,
  } = useUserOnboarding();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    nickName: "",
    accountType: "",
  });
  const [accountType, setAccountType] = useState(accountOptions[0]);
  const [isEditing, setIsEditing] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Validate form fields
  const validateFields = () => {
    const newErrors = { firstName: "", lastName: "", nickName: "", accountType: "" };
    let valid = true;

    if (accountType === "Personal Account") {
      if (!firstName.trim()) { newErrors.firstName = "First name is required"; valid = false; }
      if (!lastName.trim()) { newErrors.lastName = "Last name is required"; valid = false; }
      if (!nickName.trim()) { newErrors.nickName = "Nickname is required"; valid = false; }
    } else {
      if (!firstName.trim()) { newErrors.firstName = "Name is required"; valid = false; }
      if (!nickName.trim()) { newErrors.nickName = "Organization name is required"; valid = false; }
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch existing user (for editing)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user?.id) return;
        const res = await axios.get(`https://cast-api-zeta.vercel.app/api/users/${user.id}`);
        if (res.data) {
          setFirstName(res.data.firstName || "");
          setLastName(res.data.lastName || "");
          setNickName(res.data.nickName || "");
          setImage(res.data.image || "");
          setAccountType(res.data.accountType || accountOptions[0]);
          setIsEditing(true);
        }
      } catch {
        setIsEditing(false);
      }
    };
    fetchUser();
  }, [user]);

  // Submit handler
  const handleSubmit = async () => {
    if (!validateFields()) return;
    setLoading(true);

    try {
      const payload = {
        clerkId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress || "",
        firstName: accountType === "Personal Account" ? firstName : "",
        lastName: accountType === "Personal Account" ? lastName : "",
        nickName,
        image,
        accountType,
      };

      // Always POST to create-user; backend handles create vs update
      const res = await axios.post("https://cast-api-zeta.vercel.app/api/users/create-user", payload);

      if (res.data.success) {
        // ✅ Update Clerk metadata so index.tsx knows this step is done
        await user?.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            hasNames: "true",
            accountType,
          },
        });

        // Reload user to ensure updated metadata is accessible
        await user?.reload();

        router.replace("/(auth)/location");
      }
    } catch (err: any) {
      console.error(
        "❌ Error saving user:",
        err?.response?.data || err?.response?.status || err?.message || err
      );setErrors((prev) => ({ ...prev, accountType: "Failed to save profile" }));
    

      
    } finally {
      setLoading(false);
    }

        router.replace("/(auth)/location");

  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", color: theme.text }}>
            Complete Your Profile 🚀
          </Text>

          <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginVertical: 10 }}>
            <Image
              source={{ uri: image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNKfj6RsyRZqO4nnWkPFrYMmgrzDmyG31pFQ&s" }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </TouchableOpacity>

          <Text style={{ color: theme.text, fontWeight: "bold" }}>Account Type</Text>
          <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 8, backgroundColor: theme.background, marginBottom: 10 }}>
            <Picker
              selectedValue={accountType}
              onValueChange={setAccountType}
              dropdownIconColor={theme.text}
              style={{ color: theme.text, paddingHorizontal: 8 }}
            >
              {accountOptions.map((opt, idx) => (
                <Picker.Item key={idx} label={opt} value={opt} />
              ))}
            </Picker>
          </View>
          {errors.accountType ? <Text style={{ color: "red" }}>{errors.accountType}</Text> : null}

          {accountType === "Personal Account" ? (
            <>
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={{ borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 5, color: theme.text }}
                placeholderTextColor={theme.subtext}
              />
              {errors.firstName && <Text style={{ color: "red" }}>{errors.firstName}</Text>}

              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={{ borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 5, color: theme.text }}
                placeholderTextColor={theme.subtext}
              />
              {errors.lastName && <Text style={{ color: "red" }}>{errors.lastName}</Text>}

              <TextInput
                placeholder="Nickname"
                value={nickName}
                onChangeText={setNickName}
                style={{ borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 5, color: theme.text }}
                placeholderTextColor={theme.subtext}
              />
              {errors.nickName && <Text style={{ color: "red" }}>{errors.nickName}</Text>}
            </>
          ) : (
            <>
              <TextInput
                placeholder="Name"
                value={firstName}
                onChangeText={setFirstName}
                style={{ borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 5, color: theme.text }}
                placeholderTextColor={theme.subtext}
              />
              {errors.firstName && <Text style={{ color: "red" }}>{errors.firstName}</Text>}

              <TextInput
                placeholder="Organization Nickname"
                value={nickName}
                onChangeText={setNickName}
                style={{ borderWidth: 1, borderColor: theme.border, padding: 12, borderRadius: 8, marginBottom: 5, color: theme.text }}
                placeholderTextColor={theme.subtext}
              />
              {errors.nickName && <Text style={{ color: "red" }}>{errors.nickName}</Text>}
            </>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={{ backgroundColor: theme.primary, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 20 }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "bold" }}>Save & Continue</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NamesScreen;
