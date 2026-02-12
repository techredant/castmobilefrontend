import { StyleSheet, View } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useLevel } from "@/context/LevelContext";
import { FloatingTabButton } from "@/components/Button/FloatingButton";
import { useTheme } from "@/context/ThemeContext";
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


// import { View, StyleSheet } from "react-native";
// import {
//   NativeTabs,
//   Icon,
//   Label,
//   VectorIcon,
// } from "expo-router/unstable-native-tabs";
// import { useRouter } from "expo-router";
// import {
//   FontAwesome,
//   MaterialCommunityIcons,
//   MaterialIcons,
// } from "@expo/vector-icons";
// import { Avatar } from "react-native-paper";
// import { useUser } from "@clerk/clerk-expo";

// import { useLevel } from "@/context/LevelContext";
// import { useTheme } from "@/context/ThemeContext";
// import { FloatingTabButton } from "@/components/Button/FloatingButton";
// import { DynamicColorIOS } from 'react-native';

// export default function TabsLayout() {
//   const router = useRouter();
//   const { theme } = useTheme();
//   const { userDetails } = useLevel();
//   const { user } = useUser();

//   return (
//     // <View style={{ flex: 1 }}>
//       <NativeTabs>
//         <NativeTabs.Trigger name="index">
//           <Icon
//             src={
//               <VectorIcon
//                 family={MaterialCommunityIcons}
//                 name="home"
//               />
//             }
//           />
//           <Label>Home</Label>
//         </NativeTabs.Trigger>

//         {/* Market */}
//         <NativeTabs.Trigger name="market/index">
//           <Icon
//             src={
//               <VectorIcon
//                 family={MaterialIcons}
//                 name="shopping-cart"
//               />
//             }
//           />
//           <Label>Market</Label>
//         </NativeTabs.Trigger>

//         {/* Placeholder for center spacing */}
//         {/* <NativeTabs.Trigger name="input" /> */}
//        <NativeTabs.Trigger name="input">
//   <Icon
//     src={
//       // <View
//       //   style={{
//       //     width: 56,
//       //     height: 56,
//       //     borderRadius: 28,
//       //     backgroundColor: "#1F2937",
//       //     justifyContent: "center",
//       //     alignItems: "center",
//       //     marginTop: -18, // 👈 lift it visually
//       //     elevation: 6,
//       //   }}
//       // >
//         <VectorIcon
//           family={FontAwesome}
//           name="plus-square-o"
//         />
//       // </View>
//     }
//   />
//   <Label>post</Label>
// </NativeTabs.Trigger>


//         {/* News */}
//         <NativeTabs.Trigger name="news/index">
//           <Icon
//             src={
//               <VectorIcon
//                 family={MaterialIcons}
//                 name="newspaper"
//               />
//             }
//           />
//           <Label>News</Label>
//         </NativeTabs.Trigger>

//         {/* Profile */}
//         <NativeTabs.Trigger name="profile/index">
//           <Icon
//             src={
//               <Avatar.Image
//                 size={28}
//                 source={{
//                   uri:
//                     userDetails?.image?.trim() ||
//                     user?.imageUrl,
//                 }}
//               />
//             }
//           />
//           <Label>You</Label>
//         </NativeTabs.Trigger>
//       </NativeTabs>
//   );
// }

// const styles = StyleSheet.create({
//   floating: {
//     position: "absolute",
//     bottom: 36, // sits above native tab bar
//     alignSelf: "center",
//     zIndex: 100,
//   },
// });
