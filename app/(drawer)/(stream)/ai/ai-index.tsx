import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  TypingIndicator,
  useChatContext,
} from "stream-chat-expo";
import { useUser } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKEND_URL = "https://cast-api-zeta.vercel.app";

export default function AIChatScreen() {
  const { user } = useUser();
  const { client } = useChatContext();

  const [isReady, setIsReady] = useState(false);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [aiTyping, setAiTyping] = useState(false);

  const aiLock = useRef(false);

 useEffect(() => {
  if (!user?.id || !client?.user) return; // 👈 wait until Stream user is connected

  const init = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/upsertai`, { method: "POST" });

      const aiChannel = client.channel("messaging", `ai-chat-${user.id}`, {
        members: [user.id, "ai-assistant"],
      });

      await aiChannel.watch();
      setChannel(aiChannel);
      setIsReady(true);
    } catch (err) {
      console.error("AI chat init failed:", err);
    }
  };

  init();
}, [user?.id, client?.user]); // 👈 depend on client.user, not just client


  useEffect(() => {
    if (!channel) return;

    const handleMessage = async (event: any) => {
      const msg = event.message;
      if (!msg?.text) return;
      if (msg.user?.id === "ai-assistant") return;
      if (aiLock.current) return;

      try {
        aiLock.current = true;
        setAiTyping(true);

        const res = await fetch(`${BACKEND_URL}/api/ai-reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "message.new",
            message: msg,
            channel_id: channel.id,
          }),
        });

        const data = await res.json();
        console.log("AI reply:", data);
      } catch (err) {
        console.error("AI fetch error:", err);
      } finally {
        setAiTyping(false);
        aiLock.current = false;
      }
    };

    channel.on("message.new", handleMessage);
    return () => channel.off("message.new", handleMessage);
  }, [channel]);

  if (!isReady) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Connecting to AI chat…</Text>
      </SafeAreaView>
    );
  }

  return (
    <Chat client={client}>
      <Channel channel={channel} keyboardVerticalOffset={100}>
        <MessageList />
        {aiTyping && (
          <View style={{ padding: 8, alignItems: "center" }}>
            <Text style={{ fontStyle: "italic", color: "#666" }}>AI is typing...</Text>
            <TypingIndicator />
          </View>
        )}
        <SafeAreaView edges={["bottom"]}>
          <MessageInput />
        </SafeAreaView>
      </Channel>
    </Chat>
  );
}
