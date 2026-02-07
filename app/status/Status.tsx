import { ScrollView, View } from "react-native";
import { CreateStatus } from "./CreateStatus";
import { StatusItem } from "./StatusItem";
import { useTheme } from "../../context/ThemeContext";

export function Status({ statuses }: { statuses: any[] }) {
    const { theme } = useTheme();

    return (
        <View className="bg-white py-3 mb-2 shadow-sm" style={{ backgroundColor: theme.card }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="px-2 gap-2"
            >
                <CreateStatus />

                {statuses.map((status) => (
                    <StatusItem key={status.id} status={status} />
                ))}
            </ScrollView>
        </View>
    );
}
