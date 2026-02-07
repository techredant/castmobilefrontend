import React from "react";
import { View, Text, FlatList, Image } from "react-native";
import { useLevel } from "../../../../context/LevelContext";
import { POSTS } from "../../../../assets/data/mockPosts";
import { LevelHeader } from "@/components/level/LevelHeader";
import { useTheme } from "@/context/ThemeContext";

const levelLabels: Record<string, string> = {
  national: "National",
  county: "County",
  constituency: "Constituency",
  ward: "Ward",
};

export default function NewsScreen() {
  const { level } = useLevel();
  const { theme } = useTheme();

  // Filter posts/news for the selected level
  const filteredPosts = POSTS.filter((post) => post.level === level);

  const renderItem = ({ item }: any) => (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 12,
        marginBottom: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      }}
    >
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image
          source={{ uri: item.author.avatar }}
          style={{ width: 40, height: 40, borderRadius: 999 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: theme.text }}>
            {item.author.name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.subtext }}>
            {item.createdAt}
          </Text>
        </View>
      </View>

      <Text
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontSize: 14,
          color: theme.text,
        }}
      >
        {item.text}
      </Text>

      {item.images?.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          style={{ width: "100%", height: 208, resizeMode: "cover" }}
        />
      )}

      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: theme.subtext }}>Likes: {item.likes}</Text>
        <Text style={{ color: theme.subtext }}>
          Comments: {item.commentsCount}
        </Text>
        <Text style={{ color: theme.subtext }}>Views: {item.views}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: 10 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 12,
          color: theme.text,
          paddingHorizontal: 12,
        }}
      >
        {levelLabels[level] ?? level} News
      </Text>

      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text style={{ color: theme.subtext }}>
            No news for this level yet
          </Text>
        </View>
      )}
    </View>
  );
}
