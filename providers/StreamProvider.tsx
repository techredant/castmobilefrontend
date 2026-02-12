import { PropsWithChildren, useEffect, useState, useMemo } from "react";
import { View } from "react-native";
import { StreamChat } from "stream-chat";
import { Chat, OverlayProvider } from "stream-chat-expo";
import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { useLevel } from "@/context/LevelContext";
import { LoaderKitView } from "react-native-loader-kit";
import { useTheme } from "@/context/ThemeContext";

const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

export default function StreamProvider({ children }: PropsWithChildren) {
  const { userDetails } = useLevel();
  const { theme } = useTheme();

  const [ready, setReady] = useState(false);

  const chatClient = useMemo(
    () => StreamChat.getInstance(API_KEY),
    []
  );

  const videoClient = useMemo(() => {
    if (!userDetails?.clerkId) return null;

    return new StreamVideoClient({
      apiKey: API_KEY,
      user: {
        id: userDetails.clerkId,
        name: userDetails.firstName || "User",
        image: userDetails.image,
      },
      tokenProvider: async () => {
        const res = await fetch(
          "https://cast-api-zeta.vercel.app/api/stream/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userDetails.clerkId }),
          }
        );
        const { token } = await res.json();
        return token;
      },
    });
  }, [userDetails?.clerkId]);

  useEffect(() => {
    if (!userDetails?.clerkId || !videoClient) return;

    let mounted = true;

    const connect = async () => {
      try {
        const tokenRes = await fetch(
          "https://cast-api-zeta.vercel.app/api/stream/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userDetails.clerkId }),
          }
        );
        const { token } = await tokenRes.json();

        await chatClient.connectUser(
          {
            id: userDetails.clerkId,
            name: userDetails.firstName || "User",
            image: userDetails.image,
          },
          token
        );

        if (mounted) setReady(true);
      } catch (e) {
        console.error("❌ Stream connect failed", e);
      }
    };

    connect();

    return () => {
      mounted = false;
      chatClient.disconnectUser();
      videoClient.disconnectUser();
      setReady(false);
    };
  }, [userDetails?.clerkId]);

  if (!ready || !videoClient) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name="BallScaleRippleMultiple"
          color={theme.text}
        />
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <StreamVideo client={videoClient}>{children}</StreamVideo>
      </Chat>
    </OverlayProvider>
  );
}
