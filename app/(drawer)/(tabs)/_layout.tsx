import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useLevel } from "../../../context/LevelContext";
import { FloatingTabButton } from "@/components/Button/FloatingButton";
import { useColorScheme } from "nativewind";
import { useTheme } from "../../../context/ThemeContext";
import { FloatingLevelButton } from "../../modals/LevelFloatingAction";
import { useUser } from "@clerk/clerk-expo";
import {Avatar} from "react-native-paper"

export default function TabsLayout() {
   const { currentLevel, userDetails } = useLevel();

  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const {user} = useUser()

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
           tabBarHideOnKeyboard: false,
          tabBarActiveTintColor: theme.primary,
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            // bottom: 40,
            height: 100,
            // borderRadius: 999,
            backgroundColor: theme.background,
            borderTopWidth: 0,
            elevation: 10,
          },
        }}
      >
            <Tabs.Screen
            name="index"
            options={{
              title:
                currentLevel?.value
                  ? currentLevel.value.charAt(0).toUpperCase() +
                    currentLevel.value.slice(1)
                  : "Home",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="planet-outline" size={size} color={color} />
              ),
            }}
          />
        <Tabs.Screen
          name="market/index"
          options={{
            title: "Market",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="input"
          options={{
            title: "",
            tabBarButton: () => (
              <FloatingTabButton
                onPress={() => router.push("/(drawer)/(tabs)/input")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="news/index"
          options={{
            title: "News",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Avatar.Image
                size={32}
                source={{
                  uri:
                    userDetails?.image && userDetails.image.trim() !== ""
                      ? userDetails?.image
                      : user?.imageUrl || "",
                }}
                style={{ borderRadius: 50 }}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20,
    borderWidth: 3,
    borderColor: "gray"
  },
  fabRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "space-evenly", // 👈 evenly spaced
    alignItems: "center",

    paddingHorizontal: 40,
  },
});

