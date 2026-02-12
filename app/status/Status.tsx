import { ScrollView, View } from "react-native";
import { CreateStatus } from "./CreateStatus";
import { StatusItem } from "./StatusItem";
import { useTheme } from "../../context/ThemeContext";

// export function Status({ statuses }: { statuses: any[] }) {
//     const { theme } = useTheme();

//     return (
//         <View className="bg-white py-3 mb-2 shadow-sm" style={{ backgroundColor: theme.card }}>
//             <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerClassName="px-2 gap-2"
//             >
//                 <CreateStatus />

//                 {statuses.map((status) => (
//                     <StatusItem key={status.id} status={status} />
//                 ))}
//             </ScrollView>
//         </View>
//     );
// }


export function Status({ statuses }: { statuses: any[] }) {
  const { theme } = useTheme();

  const groupedStatuses = Object.values(
    statuses.reduce((acc, status) => {
      const key = status.user.name;

      if (!acc[key]) {
        acc[key] = {
          user: status.user,
          statuses: [],
        };
      }

      acc[key].statuses.push(status);
      return acc;
    }, {})
  );

  return (
    <View className="py-3 mb-2 shadow-sm" style={{ backgroundColor: theme.card }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 gap-2"
      >
        <CreateStatus />

        {groupedStatuses.map((userStatus: any) => (
          <StatusItem
            key={userStatus.user.name}
            userStatus={userStatus}
          />
        ))}
      </ScrollView>
    </View>
  );
}
