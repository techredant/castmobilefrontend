import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const posts = Array.from({ length: 9 }).map((_, i) => ({
  id: i.toString(),
  image: "https://picsum.photos/300?random=" + i,
}));

export default function ProfileById() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=32" }}
          style={styles.avatar}
        />

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>820</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={styles.name}>User #{id}</Text>
        <Text style={styles.username}>@user_{id}</Text>
        <Text style={styles.bioText}>
          This is a public profile page 👋{"\n"}
          React Native dev | Stream Chat fan 🚀
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs (like X / Instagram) */}
      <View style={styles.tabs}>
        <Text style={styles.activeTab}>Posts</Text>
        <Text style={styles.tab}>Media</Text>
        <Text style={styles.tab}>Likes</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  stats: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center" },
  statNumber: { fontWeight: "bold", fontSize: 16 },
  statLabel: { fontSize: 12, color: "#666" },

  bio: { paddingHorizontal: 16, marginTop: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  username: { color: "#666" },
  bioText: { marginTop: 6 },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#1DA1F2",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "bold" },
  secondaryText: { fontWeight: "bold" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  tab: { color: "#666" },
  activeTab: { fontWeight: "bold", borderBottomWidth: 2 },

  postImage: {
    width: "33.33%",
    aspectRatio: 1,
  },
});
