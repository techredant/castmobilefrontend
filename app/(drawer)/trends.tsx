import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLevel } from "../../context/LevelContext";
import { useColorScheme } from "nativewind";

// Mock trending data
const TRENDS = [
  { id: "1", level: "home", title: "#Elections2026", mentions: 12000 },
  { id: "2", level: "home", title: "#Budget2026", mentions: 8900 },
  { id: "3", level: "county", title: "#NairobiTraffic", mentions: 4500 },
  { id: "4", level: "county", title: "#MombasaBeachCleanUp", mentions: 3200 },
  { id: "5", level: "constituency", title: "#WestlandsProjects", mentions: 1800 },
  { id: "6", level: "ward", title: "#ParklandsSchoolEvent", mentions: 900 },
];

const levelLabels: Record<string, string> = {
  national: "National",
  county: "County",
  constituency: "Constituency",
  ward: "Ward",
};

export default function TrendsScreen() {
  const { level } = useLevel();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Filter trends by current level
  const filteredTrends = TRENDS.filter((trend) => trend.level === level);

  return (
    <View className={`${isDark ? "bg-black" : "bg-white"} flex-1 px-4 py-4`}>
      {/* Level Header */}
      <Text className={`${isDark ? "text-white" : "text-black"} text-2xl font-bold mb-4`}>
        {levelLabels[level] ?? level} Trends
      </Text>

      {/* Trends List */}
      <FlatList
        data={filteredTrends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => (
          <Pressable
            className={`${isDark ? "bg-gray-900" : "bg-gray-100"} p-4 rounded-lg`}
            onPress={() => console.log("Trend clicked:", item.title)}
          >
            <Text className={`${isDark ? "text-white" : "text-black"} text-lg font-semibold`}>
              {item.title}
            </Text>
            <Text className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>
              {item.mentions.toLocaleString()} mentions
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className={`${isDark ? "text-white" : "text-gray-500"}`}>
              No trends for this level yet
            </Text>
          </View>
        }
      />
    </View>
  );
}
