import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import { tokenProvider } from "../utils/tokenProvider";
import { useLevel } from "@/context/LevelContext";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { LoaderKitView } from "react-native-loader-kit";
import { useTheme } from "@/context/ThemeContext";


const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(true);

  const {userDetails}  = useLevel()
  const {user} = useUser()
  const router = useRouter()
  const {theme} = useTheme()

useEffect(() => {
  let isMounted = true;

  const connect = async () => {
    if (!userDetails || !userDetails.clerkId) {
      console.log("⏳ Waiting for userDetails...");
      return;
    }

    try {
      // Disconnect previous user if any
      if (client.userID) {
        await client.disconnectUser();
      }

      const token = await tokenProvider(userDetails.clerkId);

      await client.connectUser(
        {
          id: userDetails.clerkId,
          name: userDetails.firstName || "User",
          image: userDetails.image || undefined,
        },
        token
      );

      if (isMounted) {
        console.log("✅ Connected Stream user:", userDetails.clerkId);
        setIsReady(true);
      }
    } catch (err) {
      console.error("❌ Stream connection failed:", err);
    }
  };

  connect();

  return () => {
    isMounted = false;
    if (client.userID) {
      client.disconnectUser();
    }
    setIsReady(false);
  };
}, [userDetails?.clerkId]);


  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name={"BallScaleRippleMultiple"}
          animationSpeedMultiplier={1.0} 
          color={theme.text} 
        />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={client}>{children}</Chat>
    </OverlayProvider>
  );
}
