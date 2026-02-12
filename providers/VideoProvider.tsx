import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-native-sdk";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export function VideoProvider({ children }) {
  const { user } = useUser();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      const { data } = await axios.post("https://cast-api-zeta.vercel.app/api/stream/video-token", {
        userId: user.id,
      });

      const client = StreamVideoClient.getOrCreateInstance({
        apiKey: process.env.EXPO_PUBLIC_STREAM_API_KEY!,
        user: {
          id: user.id,
          name: user.fullName ?? user.username ?? "User",
          image: user.imageUrl,
        },
        token: data.token,
      });

      setVideoClient(client);
    };

    init();
  }, [user]);

  if (!videoClient) return null;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
