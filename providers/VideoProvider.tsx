import {
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { tokenProvider } from "@/utils/tokenProvider";
import { useLevel } from "@/context/LevelContext";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export default function VideoProvider({ children }: PropsWithChildren) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const { userDetails } = useLevel();

  useEffect(() => {
    if (!userDetails || !apiKey) {
      return;
    }

    const initVideoClient = async () => {
      const user = {
        id: userDetails.id,
        name: userDetails.full_name,
        image: userDetails?.image
      };
      const client = new StreamVideoClient({ apiKey, user, tokenProvider });
      setVideoClient(client);
    };

    initVideoClient();
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [userDetails?.id]);

  if (!videoClient) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function async() {
  throw new Error("Function not implemented.");
}
