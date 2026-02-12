import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Pressable, Dimensions } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLevel } from "@/context/LevelContext";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import Video from "react-native-video";
import { MediaViewerModal } from "@/components/posts/MediaViewModal";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";

const BASE_URL = "https://cast-api-zeta.vercel.app";

const followers = Array.from({ length: 20 }).map((_, i) => ({
  id: "f" + i,
  name: "Follower " + (i + 1),
  avatar: "https://i.pravatar.cc/150?img=" + i,
}));

const following = Array.from({ length: 10 }).map((_, i) => ({
  id: "fo" + i,
  name: "Following " + (i + 1),
  avatar: "https://i.pravatar.cc/150?img=" + (i + 20),
}));

const SCREEN_WIDTH = Dimensions.get("window").width;
const POST_MARGIN = 2; // optional spacing between items
const NUM_COLUMNS = 3;
const POST_SIZE = (SCREEN_WIDTH - POST_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS;

export default function ProfileScreen() {
const { userId } = useLocalSearchParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
      const [modalVisible, setModalVisible] = useState(false);
      const [selectedIndex, setSelectedIndex] = useState(0);
      const { currentLevel, isLoadingUser } = useLevel();

 const openMedia = (index: number) => {
  setSelectedIndex(index);
  setModalVisible(true);
};
console.log("Profile userId from params:", userId);
// Flatten posts to all media
const mediaPosts = posts
  .filter(post => post.media && post.media.length > 0)
  .flatMap(post => post.media); // array of media URLs

const getData = () => {
  if (activeTab === "posts") return mediaPosts; // all media URLs
  if (activeTab === "followers") return followers;
  return following;
};

  const [activeTab, setActiveTab] = useState<
    "posts" | "followers" | "following"
  >("posts");

  const [profileUser, setProfileUser] = useState<any>(null);
const [loadingProfile, setLoadingProfile] = useState(false);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await axios.get(`${BASE_URL}/api/users/${userId}`);
      setProfileUser(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  if (userId) fetchProfile();
}, [userId]);


const fetchPosts = useCallback(async () => {
  if (!userId) return;

  try {
    const url = `${BASE_URL}/api/posts/${userId}?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;

    const res = await axios.get(url);
    setPosts(res.data ?? []);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
  } finally {
    setRefreshing(false);
  }
}, [currentLevel, userId]);

useEffect(() => {
  fetchPosts();
}, [fetchPosts]);



  // /* ---------------- PINCH ZOOM ---------------- */
  const pinchScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      pinchScale.value = e.scale;
    })
    .onEnd(() => {
      pinchScale.value = withSpring(1);
    });

  const pinchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pinchScale.value }],
  }));


// Pull-to-refresh
// const onRefresh = () => {
//   setRefreshing(true);
//   fetchPosts();
// };

console.log("currentlevel", currentLevel);

console.log("posts", posts);

  if (loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }


const renderItem = ({ item, index }: any) => {
  if (activeTab === "posts") {
    const isVideo = item.endsWith(".mp4") || item.endsWith(".mov");

    return (
      <Pressable onPress={() => openMedia(index)}>
        {isVideo ? (
          <Video
            source={{ uri: item }}
            style={styles.postImage}
            resizeMode="cover"
            repeat
            paused={false}
            muted
          />
        ) : (
          <Image source={{ uri: item }} style={styles.postImage} />
        )}
      </Pressable>
    );
  }

  return (
    <View style={styles.userRow}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );
};



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              profileUser?.image?.trim() !== ""
                ? profileUser?.image
                : "https://i.pravatar.cc/150?img=32",
          }}
          style={styles.avatar}
        />

        <View style={styles.bio}>
          <Text style={styles.name}>{profileUser?.firstName}</Text>
          <Text style={styles.username}>@{profileUser?.nickName}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={styles.statNumber}>54</Text>
            <Text
              style={[
                styles.statLabel,
                activeTab === "posts" && styles.activeLabel,
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setActiveTab("followers")}
          >
            <Text style={styles.statNumber}>1.2k</Text>
            <Text
              style={[
                styles.statLabel,
                activeTab === "followers" && styles.activeLabel,
              ]}
            >
              Followers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setActiveTab("following")}
          >
            <Text style={styles.statNumber}>180</Text>
            <Text
              style={[
                styles.statLabel,
                activeTab === "following" && styles.activeLabel,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
    <FlatList
  style={{ flex: 1 }}
  contentContainerStyle={{ paddingBottom: 140, flexDirection: "row", flexWrap: "wrap" }}
  data={getData()}
  key={activeTab}
  keyExtractor={(item, index) => index.toString()}
  numColumns={NUM_COLUMNS} // 3 columns
  renderItem={renderItem}
  showsVerticalScrollIndicator={false}
/>

  {/* MEDIA MODAL */}
      <MediaViewerModal
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  mediaList={mediaPosts}          // pass all media
  selectedIndex={selectedIndex}
  post={posts.find(p => p.media && p.media.includes(mediaPosts[selectedIndex]))} 
  pinchGesture={pinchGesture}
        pinchStyle={pinchStyle}
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
    width: POST_SIZE,
    height: POST_SIZE,
    margin: POST_MARGIN,
},

  userRow: {
  flexDirection: "row",
  alignItems: "center",
  padding: 12,
  borderBottomWidth: 1,
  borderColor: "#eee",
},
userAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
},
userName: {
  fontSize: 16,
  fontWeight: "500",
},
activeLabel: {
  color: "#1DA1F2",
  fontWeight: "bold",
},

});
