import { View, Text, Image, Pressable } from "react-native";

export function StatusItem({ status }: any) {
    return (
        <Pressable className="items-center">
            <View
                className={`p-[2px] rounded-full ${status.viewed ? "bg-gray-300" : "bg-green-600"
                    }`}
            >
                <Image
                    source={{ uri: status.user.avatar }}
                    className="w-14 h-14 rounded-full border-2 border-white"
                />
            </View>
            

            <Text
                numberOfLines={1}
                className="text-[11px] mt-1 max-w-[56px] text-center dark:text-gray-300"
            >
                {status.user.name}
            </Text>
        </Pressable>
    );
}
