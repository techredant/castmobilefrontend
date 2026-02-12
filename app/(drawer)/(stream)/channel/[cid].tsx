import { Ionicons } from "@expo/vector-icons";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Channel as ChannelType, ChannelMemberResponse } from "stream-chat";
import { Channel, MessageInput, MessageList, useChatContext } from "stream-chat-expo";
import { LoaderKitView } from "react-native-loader-kit";

interface MyChannelData {
  name?: string;
}

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType<MyChannelData> | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();
  const [isJoiningCall, setIsJoiningCall] = useState(false);

  useEffect(() => {
    if (!cid || !client) return;

    const fetchChannel = async () => {
      try {
        const channels = await client.queryChannels<MyChannelData>({ cid });
        if (channels.length > 0) setChannel(channels[0]);
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };

    fetchChannel();
  }, [cid, client]);

  const getHeaderTitle = () => {
    if (!channel || !client) return "Chat";

    if (channel.data?.name) return channel.data.name;

    const members = Object.values(channel.state.members) as ChannelMemberResponse[];
    const otherMember = members.find((m) => m.user_id !== client.userID);
    return otherMember?.user?.name || "";
  };

// const joinCall = async () => {
//   if (!channel || !videoClient) return;

//   try {
//     setIsJoiningCall(true);

//     const rawCid = channel.cid; 
//     const callId = rawCid.replace(/[^a-zA-Z0-9_-]/g, "_");

//     const call = videoClient.call("default", callId);
//     await call.getOrCreate({ ring: true });

//     router.push(`/call?callId=${callId}`);
//   } catch (err) {
//     console.error("Failed to join call:", err);
//   } finally {
//     setIsJoiningCall(false);
//   }
// };

const joinCall = async () => {
  if (isJoiningCall) return; // ⛔ blocks second call
  if (!channel || !videoClient) return;

  setIsJoiningCall(true);

  try {
    const rawCid = channel.cid;
    const callId = rawCid.replace(/[^a-zA-Z0-9_-]/g, "_");

    const call = videoClient.call("default", callId);
    await call.getOrCreate({ ring: true });

    router.replace(`/call?callId=${callId}`); // 👈 important
  } catch (err) {
    console.error("Failed to join call:", err);
    setIsJoiningCall(false);
  }
};


  if (!channel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoaderKitView
          style={{ width: 50, height: 50 }}
          name="BallScaleRippleMultiple"
          animationSpeedMultiplier={1}
          color="gray"
        />
      </View>
    );
  }

  return (
    <Channel channel={channel} audioRecordingEnabled>
      <Stack.Screen
        options={{
          title: getHeaderTitle(),
          headerLeft: () => (
            <Ionicons
              name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
              size={24}
              color="gray"
              onPress={() => router.replace("/(drawer)/(stream)/(chattabs)")}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 12 }}>
              {isJoiningCall ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                <Ionicons name="call" size={24} color="gray" onPress={joinCall} />
              )}
            </View>
          ),
        }}
      />
      <MessageList />
      <SafeAreaView edges={["bottom"]}>
        <MessageInput />
      </SafeAreaView>
    </Channel>
  );
}
