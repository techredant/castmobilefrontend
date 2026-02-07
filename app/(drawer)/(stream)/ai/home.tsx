import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "stream-chat-expo";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

// ---------- CONFIG ----------
const STREAM_KEY = process.env.EXPO_PUBLIC_STREAM_CHAT_KEY!;
const BACKEND_URL = "https://cast-api-zeta.vercel.app";

// ---------- STREAM CLIENT ----------
const chatClient = StreamChat.getInstance(STREAM_KEY);

// ---------- MAIN COMPONENT ----------
const AIChatScreen = () => {
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const listenerAttached = useRef(false);

  // ---------------- CONNECT TO STREAM ----------------
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const connect = async () => {
      try {
        // 1️⃣ Get Stream token from backend
        const res = await fetch(`${BACKEND_URL}/api/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            name: user.fullName || "User",
          }),
        });

        const data = await res.json();
        if (!data.token) throw new Error("No Stream token");

        // 2️⃣ Connect user to Stream
        await chatClient.connectUser(
          {
            id: user.id,
            name: user.fullName || "User",
            image: user.imageUrl || "https://placekitten.com/200/200",
          },
          data.token
        );

        // 3️⃣ Create or get AI channel
        const aiChannel = chatClient.channel(
          "messaging",
          `ai-chat-${user.id}`,
          {
            name: "AI Assistant 🤖",
            members: [user.id, "ai-broad"],
          }
        );

        await aiChannel.watch();

        if (isMounted) {
          setChannel(aiChannel);
          setIsReady(true);
        }
      } catch (err) {
        console.error("Stream init error:", err);
      }
    };

    connect();

    return () => {
      isMounted = false;
      chatClient.disconnectUser();
    };
  }, [user?.id]);

  // ---------------- AI MESSAGE LISTENER ----------------
  useEffect(() => {
    if (!channel || listenerAttached.current) return;

    listenerAttached.current = true;

    const handleNewMessage = async (event: any) => {
      const message = event.message;

      // Ignore AI messages and empty messages
      if (
        !message ||
        !message.text?.trim() ||
        message.user?.id === "ai-broad"
      ) {
        return;
      }

      try {
        // Call backend AI route
        await fetch(`${BACKEND_URL}/api/ai-reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId: channel.id,
            text: message.text,
          }),
        });
      } catch (err) {
        console.error("AI reply failed:", err);
      }
    };

    channel.on("message.new", handleNewMessage);

    return () => {
      channel.off("message.new", handleNewMessage);
      listenerAttached.current = false;
    };
  }, [channel]);

  // ---------------- LOADING ----------------
  if (!isReady || !channel) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={{ marginTop: 10 }}>Connecting to AI chat…</Text>
      </SafeAreaView>
    );
  }

  // ---------------- UI ----------------
  return (
      <Chat client={chatClient}>
        <Channel channel={channel} keyboardVerticalOffset={100}>
          <MessageList />
          <TypingIndicator />
          <MessageInput placeholder="Ask the AI anything…" />
        </Channel>
      </Chat>
  );
};

export default AIChatScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
