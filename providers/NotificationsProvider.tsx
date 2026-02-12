import { PropsWithChildren, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-expo";
import messaging, { AuthorizationStatus } from "@react-native-firebase/messaging";


// Your Stream client (singleton)
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const { user } = useUser();
  const [isReady, setIsReady] = useState(false);

  // Request permission (iOS)
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  console.log("Push notification permission:", authStatus);

  if (!enabled) {
    console.warn("Push permission not granted");
  }
};


  // Register device token with Stream
  const registerPushToken = async () => {
    if (!user?.id || !client.userID) return;

    const token = await messaging().getToken();

    await client.addDevice(token, "firebase", user.id, "Firebase");

    client.setLocalDevice({
      id: token,
      push_provider: "firebase",
      push_provider_name: "Firebase",
    });

    console.log("Push token registered:", token);
  };

  useEffect(() => {
    if (!user?.id) return;

    let interval: ReturnType<typeof setInterval>;

    const init = async () => {
      await requestPermission();

      // Wait until Stream client is connected
      if (!client.userID) {
        interval = setInterval(async () => {
          if (client.userID) {
            clearInterval(interval);
            await registerPushToken();
            setIsReady(true);
          }
        }, 500);
      } else {
        await registerPushToken();
        setIsReady(true);
      }
    };

    init();

    // Handle token refresh
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      if (!user?.id) return;

      await client.addDevice(newToken, "firebase", user.id, "Firebase");
      console.log("Push token refreshed:", newToken);
    });

    return () => {
      unsubscribeTokenRefresh();
      if (interval) clearInterval(interval);
    };
  }, [user?.id]);

  if (!isReady) return null;

  return <>{children}</>;
}
