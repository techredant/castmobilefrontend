import CallProvider from "@/providers/CallProvider";
// import NotificationsProvider from "@/providers/NotificationsProvider";
import VideoProvider from "@/providers/VideoProvider";
import { useUser } from "@clerk/clerk-expo";
import { Redirect, Stack, Link } from "expo-router"; // added Link
import { FontAwesome5 } from "@expo/vector-icons"; // added FontAwesome5
import ChatProvider from "@/providers/ChatProviders";

export default function HomeLayout() {
  const { user } = useUser();

  // Redirect to login if no user
  // if (!user) {
  //   return <Redirect href="/(auth)/login" />;
  // }

  return (
    <>
      {/* <NotificationsProvider> */}
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
              <Stack.Screen
                name="channel/[cid]"
                options={{ title: "Chats" }}
              />
              <Stack.Screen name="call/index" options={{ title: "Call" }} />
              <Stack.Screen name="ai" options={{ title: "AI" }} />
            </Stack>
          </CallProvider>
        </VideoProvider>
      </ChatProvider>
      {/* </NotificationsProvider> */}
    </>
  );
}
