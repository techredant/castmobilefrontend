import CallProvider from "@/providers/CallProvider";
import { Redirect, Stack, Link, router } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import ChatProvider from "@/providers/ChatProviders";
import { Pressable } from "react-native";
import { VideoProvider } from "@/providers/VideoProvider";

export default function HomeLayout() {
  return (
    <ChatProvider>
      <VideoProvider>
        <CallProvider>
          <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen
              name="(chattabs)"
              options={{
                headerLeft: () => (
                  <Link
                    href="/(drawer)/(tabs)"
                    asChild
                    style={{ marginLeft: "auto", padding: 18 }}
                  >
                    <FontAwesome5
                      name="home"
                      size={24}
                      color="gray"
                      style={{ marginHorizontal: 15 }}
                    />
                  </Link>
                ),
                title: "",
                headerRight: () => (
                  <Link
                    href="/(drawer)/(stream)/users"
                    asChild
                    style={{ marginLeft: "auto", padding: 18 }}
                  >
                    <FontAwesome5
                      name="users"
                      size={24}
                      color="gray"
                      style={{ marginHorizontal: 15 }}
                    />
                  </Link>
                ),
              }}
            />
            <Stack.Screen name="channel/[cid]" options={{ title: "" }} />
            <Stack.Screen name="call/index" options={{ title: "Call" }} />
            <Stack.Screen name="ai/ai-index" options={{ title: "AI Assistant", headerLeft: () => (
            <Pressable
              onPress={() => router.push("/(drawer)/(stream)/(chattabs)")}
              style={{ marginLeft: "auto", padding: 18 }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="gray"
                style={{ marginHorizontal: 15 }}
              />
            </Pressable>
          ), }} />
            <Stack.Screen
              name="market/[id]"
              options={{
                title: "Broadcast shopping",
                headerLeft: () => (
                  <Pressable
                    onPress={() => router.push("/(drawer)/(tabs)/market")}
                    style={{ marginLeft: "auto", padding: 18 }}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color="gray"
                      style={{ marginHorizontal: 15 }}
                    />
                  </Pressable>
                ),
              }}
            />
          </Stack>
        </CallProvider>
      </VideoProvider>
    </ChatProvider>
  );
}
