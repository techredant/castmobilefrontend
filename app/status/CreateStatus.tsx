import { View, Text, Image, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {  useUser } from "@clerk/clerk-expo";
import { useLevel } from "@/context/LevelContext";

export function CreateStatus() {
    const {userDetails} = useLevel();
    const { user } = useUser();
    return (
        <Pressable className="items-center" onPress={() => router.push("/status/StatusInput")}>
            <View className="relative">
                <Image
                    source={{ uri:  user?.imageUrl || userDetails?.image }}
                    className="w-14 h-14 rounded-full"
                />

                <View className="absolute bottom-0 right-0 bg-green-600 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                    <Feather name="plus" size={12} color="white" />
                </View>
            </View>

            <Text className="text-[11px] mt-1">Your status</Text>
        </Pressable>
    );
}
