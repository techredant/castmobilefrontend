import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";

const posts = Array.from({ length: 12 }).map((_, i) => ({
  id: i.toString(),
  image: "https://picsum.photos/300?random=" + i,
}));

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.bio}>
        <Text style={styles.name}>Redant Tech</Text>
        <Text style={styles.username}>@redanttech</Text>
      </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>54</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>180</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Follow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>Message</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "column",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  stats: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  bio: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  username: {
    color: "#666",
  },
  bioText: {
    marginTop: 4,
  },
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
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  secondaryText: {
    fontWeight: "bold",
  },
  postImage: {
    width: "33.33%",
    aspectRatio: 1,
  },
});
