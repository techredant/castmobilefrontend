import {
  Call,
  RingingCallContent,
  StreamCall,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function CallScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [call, setCall] = useState<Call | null>(null);

  const client = useStreamVideoClient();

  useEffect(() => {
    let isMounted = true;

    const fetchCall = async () => {
      if (!id || !client) return;

      try {
        // Create or fetch the call
        const newCall = client.call("default", id);
        await newCall.getOrCreate(); // getOrCreate ensures the call exists
        if (isMounted) setCall(newCall);
      } catch (err) {
        console.error("❌ Failed to join call:", err);
        // fallback navigation
        if (router.canGoBack()) router.back();
        else router.push("/");
      }
    };

    fetchCall();

    return () => {
      isMounted = false;
      // Leave the call on unmount
      call?.leave();
    };
  }, [id, client]);

  if (!call) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <RingingCallContent />
      {/* You can replace RingingCallContent with CallContent to show actual call UI */}
    </StreamCall>
  );
}
