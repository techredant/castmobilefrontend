import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Pressable,
    Image,
    Dimensions,
} from "react-native";
import { useColorScheme } from "nativewind";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");
const GAP = 12;
const ITEM_SIZE = (width - GAP * 4) / 3; // 👈 3 columns

const IMAGES = [
    { id: "1", uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f" },
    { id: "2", uri: "https://images.unsplash.com/photo-1503376780353-7e6692767b70" },
    { id: "3", uri: "https://images.unsplash.com/photo-1542362567-b07e54358753" },
];

const VIDEOS = [
    { id: "1", thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f" },
    { id: "2", thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    { id: "3", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085" },
];

export default function MediaScreen() {
    const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
    const { theme } = useTheme();

    const data = activeTab === "images" ? IMAGES : VIDEOS;

    return (
        <SafeAreaView className={`flex-1 px-3 pt-3`} style={{ backgroundColor: theme.background }}>
            {/* Tabs */}
            <View
                className="flex-row mb-4 rounded-full p-1"
                style={{ backgroundColor: theme.card }}
            >
                {["images", "videos"].map((tab) => {
                    const isActive = activeTab === tab;

                    return (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab as "images" | "videos")}
                            className="flex-1 py-2 rounded-full"
                            style={{
                                backgroundColor: isActive ? theme.background : "transparent",
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: isActive ? theme.text : theme.subtext,
                                }}
                            >
                                {tab === "images" ? "Images" : "Videos"}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Media Grid */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                numColumns={3} // ✅ 3 columns
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ gap: GAP }}
                contentContainerStyle={{ gap: GAP, paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View
                        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
                        className="rounded-xl overflow-hidden bg-gray-300 dark:bg-[#222]"
                    >
                        <Image
                            source={{
                                uri:
                                    activeTab === "images"
                                        ? (item as any).uri
                                        : (item as any).thumbnail,
                            }}
                            className="w-full h-full"
                        />

                        {/* Play icon for videos */}
                        {activeTab === "videos" && (
                            <View className="absolute inset-0 items-center justify-center bg-black/30">
                                <Feather name="play" size={28} color="white" />
                            </View>
                        )}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
