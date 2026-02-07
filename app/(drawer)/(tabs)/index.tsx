import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { useLevel } from "../../../context/LevelContext";
import { useTheme } from "../../../context/ThemeContext";
import { LevelHeader } from "../../../components/level/LevelHeader";
import { PostCard } from "../../../components/posts/PostCard";
import { Status } from "@/app/status/Status";
import { FloatingLevelButton } from "@/app/modals/LevelFloatingAction";
import { useFocusEffect } from "expo-router";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://cast-api-zeta.vercel.app";

export default function HomeScreen() {
  const { currentLevel, userDetails } = useLevel();
  const { theme, isDark } = useTheme();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigation = useNavigation();


  const snapPoints = ["50%", "85%"];

  /* ---------------- Reanimated values ---------------- */
  const lastScrollY = useSharedValue(0);
  const fabTranslateY = useSharedValue(0);

  const fabContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fabTranslateY.value }],
    opacity: fabTranslateY.value > 0 ? 0 : 1,
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;

      if (y > lastScrollY.value + 5) {
        // scrolling up → hide FAB
        fabTranslateY.value = withTiming(200, { duration: 200 });
      } else if (y < lastScrollY.value - 5) {
        // scrolling down → show FAB
        fabTranslateY.value = withTiming(0, { duration: 200 });
      }

      lastScrollY.value = y;
    },
  });

  /* ---------------- Fetch posts ---------------- */


const fetchPosts = useCallback(async () => {
  try {
    setLoading(true);
    const url = `${BASE_URL}/api/posts?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`;
    // console.log("Fetching posts from:", url);

    const res = await axios.get(url);
    // console.log("Posts received:", res.data);

    setPosts(res.data ?? []);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [currentLevel]);

// Fetch on mount or level change
useEffect(() => {
  fetchPosts();
}, [fetchPosts]);

// Pull-to-refresh
const onRefresh = () => {
  setRefreshing(true);
  fetchPosts();
};

  

  /* ---------------- Socket setup ---------------- */
  useEffect(() => {
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const room = `level-${currentLevel.type}-${currentLevel.value || "all"}`;
    socket.emit("joinRoom", room);

    socket.on("newPost", (post: any) => {
      setPosts((prev) => [post, ...prev]);
    });

    socket.on("deletePost", (deletedPostId: string) => {
      setPosts((prev) => prev.filter((p) => p._id !== deletedPostId));
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("newPost");
      socket.off("deletePost");
      socket.disconnect();
    };
  }, [currentLevel]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

    useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  /** Socket.io real-time */
  useEffect(() => {
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const room = `level-${currentLevel.type}-${currentLevel.value || "all"}`;
    socket.emit("joinRoom", room);

    socket.on("newPost", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("newPost");
      socket.disconnect();
    };
  }, [currentLevel]);


  // /* ---------------- Comments ---------------- */
  // const openComments = (post: any) => {
  //   setComments(post.comments ?? []);
  //   bottomSheetRef.current?.expand();
  // };

  // const handleAddComment = () => {
  //   if (!commentText.trim()) return;

  //   setComments((prev) => [
  //     ...prev,
  //     {
  //       id: Date.now().toString(),
  //       user: { name: "You" },
  //       text: commentText,
  //     },
  //   ]);
  //   setCommentText("");
  // };

  /* ---------------- Loading state ---------------- */
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={isDark ? "light-content" : "dark-content"}
        />
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  /* ---------------- Render ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
  
  <Pressable
  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
  style={{
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 100,
    backgroundColor: theme.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Ionicons name="menu" size={22} color="#fff" />
</Pressable>


      <Animated.FlatList
        data={posts}
          keyExtractor={(item) => item._id.toString()}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            // onOpenComments={openComments}
            socket={socketRef.current}
          />
        )}
        ListHeaderComponent={
          <>
            <LevelHeader />
            {/* <Status statuses={userDetails?.statuses || []} /> */}
          </>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPosts();
            }}
            tintColor={theme.subtext}
            colors={[theme.text]}
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 40 }}>
            <Text style={{ color: theme.subtext }}>
              No posts for this level yet
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <FloatingLevelButton containerAnimatedStyle={fabContainerStyle} />

      {/* Comments Bottom Sheet */}
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.background }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
            Comments
          </Text>

          <BottomSheetFlatList
            data={comments}
            keyExtractor={(item: { id: string }) => item.id}
            renderItem={({ item }: any) => (
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>{item.user.name}</Text>
                <Text>{item.text}</Text>
              </View>
            )}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderTopWidth: 1,
                borderColor: theme.border,
                paddingVertical: 8,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: theme.subtext,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  color: theme.text,
                }}
                placeholder="Write a comment..."
                placeholderTextColor={theme.subtext}
                value={commentText}
                onChangeText={setCommentText}
              />
              <Pressable onPress={handleAddComment} style={{ marginLeft: 8 }}>
                <Text style={{ color: "#1D4ED8", fontWeight: "bold" }}>
                  Send
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </BottomSheet> */}
    </View>
  );
}


