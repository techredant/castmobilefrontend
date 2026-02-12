// import { View, Text, Image, Pressable } from "react-native";

// export function StatusItem({ status }: any) {
//     return (
//         <Pressable className="items-center">
//             <View
//                 className={`p-[2px] rounded-full ${status.viewed ? "bg-gray-300" : "bg-red-600"
//                     }`}
//             >
//                 <Image
//                     source={{ uri: status.user.avatar }}
//                     className="w-14 h-14 rounded-full border-2 border-white"
//                 />
//             </View>
            

//             <Text
//                 numberOfLines={1}
//                 className="text-[11px] mt-1 max-w-[56px] text-center dark:text-gray-300"
//             >
//                 {status.user.name}
//             </Text>
//         </Pressable>
//     );
// }


import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

interface StatusItemProps {
  userStatus: {
    user: { name: string; avatar: string };
    statuses: { id: string; viewed: boolean }[];
  };
}

export function StatusItem({ userStatus }: StatusItemProps) {
  const router = useRouter();

  const hasUnviewed = userStatus.statuses.some(s => !s.viewed);

  return (
    <Pressable
      className="items-center"
      onPress={() =>
        router.push(
          `/status/Viewer?user=${userStatus.user.name}`
        )
      }
      hitSlop={10}
    >
      <View
        style={{
          padding: 2,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: hasUnviewed ? "#f43f5e" : "#ccc",
        }}
      >
        <Image
          source={{ uri: userStatus.user.avatar }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: "#fff",
          }}
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          fontSize: 11,
          marginTop: 4,
          maxWidth: 56,
          textAlign: "center",
          color: "#111",
        }}
      >
        {userStatus.user.name}
      </Text>
    </Pressable>
  );
}
