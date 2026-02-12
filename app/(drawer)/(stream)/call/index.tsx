import { CallContent, StreamCall, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CallScreen() {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  const client = useStreamVideoClient();
  const router = useRouter();

  if (!client || !callId) return null;

  const call = client.call("default", callId);

  useEffect(() => {
    call.join({ create: true });

    return () => {
      call.leave();
    };
  }, [callId]);

    if (!call) {
    if(router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
    return null;
  }

  return (
    <SafeAreaView edges={["bottom"]}><StreamCall call={call}>
      <CallContent />
    </StreamCall></SafeAreaView>
    
  );
}
