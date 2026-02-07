import { Ionicons } from "@expo/vector-icons";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Channel as ChannelType,
  ChannelMemberResponse,
} from "stream-chat";
import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-expo";
import * as Crypto from "expo-crypto";

// Extend channel data type to include optional name
interface MyChannelData {
  name?: string;
}

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType<MyChannelData> | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();

  // Fetch the channel from Stream
  useEffect(() => {
    if (!cid || !client) return;

    const fetchChannel = async () => {
      try {
        const channels = await client.queryChannels<MyChannelData>({ cid });
        if (channels.length > 0) {
          setChannel(channels[0]);
        }
      } catch (error) {
        console.error("Error fetching channel:", error);
      }
    };

    fetchChannel();
  }, [cid, client]);

  // Compute the header title
  const getHeaderTitle = () => {
    if (!channel || !client) return "Chat";

    // 1️⃣ If it's a group channel with a name
    if (channel.data?.name) return channel.data.name;

    // 2️⃣ Otherwise, for DM, show other member's name
    const members = Object.values(channel.state.members) as ChannelMemberResponse[];
    const otherMember = members.find(m => m.user_id !== client.userID);
    return otherMember?.user?.name || "Chat";
  };

  // Join a Stream Video call
  const joinCall = async () => {
    if (!channel || !videoClient) return;

    const members = Object.values(channel.state.members)
      .filter((member) => member.user_id)
      .map((member) => ({
        user_id: member.user_id as string,
      }));

    const call = videoClient.call("default", Crypto.randomUUID());
    await call.getOrCreate({
      ring: true,
      data: { members },
    });

    // Navigate to call screen if needed
    router.push(`/call`);
  };

  if (!channel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <Channel channel={channel} audioRecordingEnabled>
      <Stack.Screen
        options={{
          title: getHeaderTitle(),
          headerRight: () => (
            <Ionicons name="call" size={24} color="gray" onPress={joinCall} />
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
