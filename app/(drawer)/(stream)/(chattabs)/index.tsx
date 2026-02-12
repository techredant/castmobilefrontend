import { Link, Stack, router } from "expo-router";
import { ChannelList } from "stream-chat-expo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { StatusBar } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function MainTabScreen() {
  const { user } = useUser();
  const {isDark}= useTheme()
  

  return (
    <>
    <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={isDark ? "light-content" : "dark-content"}
          />
      <ChannelList
        onSelect={(channel) => router.push(`/channel/${channel.cid}`)}
      />
    </>
  );
}
