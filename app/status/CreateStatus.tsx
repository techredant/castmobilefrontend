import { View, Text, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {  useUser } from "@clerk/clerk-expo";
import { useLevel } from "@/context/LevelContext";
import { AvatarWithStatus } from "./AvatarsWithStatus";

export function CreateStatus() {
    const {userDetails} = useLevel();
    const { user } = useUser();
    return (
        <Pressable className="items-center" onPress={() => router.push("/status/StatusInput")}>
            <View className="relative">
                 <AvatarWithStatus
      imageUrl={user?.imageUrl || userDetails?.image}
      hasStatus={userDetails?.hasActiveStatus} // 🔥 backend-driven
      label="Your status"
    />

                <View className="absolute bottom-0 right-0 bg-red-600 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                    <Feather name="plus" size={12} color="white" />
                </View>
            </View>

        </Pressable>
    );
}
