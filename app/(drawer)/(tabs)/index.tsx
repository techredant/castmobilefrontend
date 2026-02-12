import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StatusBar,
  RefreshControl,
  FlatList,
} from "react-native";
import axios from "axios";
import io, { Socket } from "socket.io-client";
import { useLevel } from "@/context/LevelContext";
import { useTheme } from "@/context/ThemeContext";
import { LevelHeader } from "@/components/level/LevelHeader";
import { PostCard } from "@/components/posts/PostCard";
import { Status } from "@/app/status/Status";
import { FloatingLevelButton } from "@/app/modals/LevelFloatingAction";
import { useFocusEffect } from "expo-router";
import { DrawerActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LoaderKitView } from "react-native-loader-kit";
import SAMPLE_STATUSES from "@/assets/data/SampleStatuses.json";
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";


const BASE_URL = "https://cast-api-zeta.vercel.app";

export default function HomeScreen() {
  const { currentLevel, userDetails, isLoadingUser } = useLevel();
  const { theme, isDark } = useTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [visiblePostId, setVisiblePostId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ---------------- Comments BottomSheet ----------------
  // const commentSheetRef = useRef<BottomSheetModal>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ["50%", "74%"], []);

  const handleOpen = useCallback( async(postId: string) => {
    bottomSheetRef.current?.expand();
     console.log("Opening comments for:", postId);
  setActivePostId(postId);
  try {
    const res = await axios.get(`${BASE_URL}/api/comments/${postId}`);
    setComments(res.data ?? []);

  } catch (err) {
    console.error(err);
  }
  }, []);





  const handleCommentSubmit = async (text: string) => {
    if (!activePostId || !text.trim()) return;
    try {
      const res = await axios.post(`${BASE_URL}/api/comments/${activePostId}`, { text });
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- FlatList viewability ----------------
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setVisiblePostId(viewableItems[0].item._id);
    }
  }).current;
  const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

  // ---------------- Fetch posts ----------------
  const fetchPosts = useCallback(async () => {
    if (!currentLevel?.type || !currentLevel?.value) return;
    setRefreshing(true);
    try {
      const postRes = await axios.get(`${BASE_URL}/api/posts?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`).catch(() => ({ data: [] }));
      const reciteRes = await axios.get(`${BASE_URL}/api/recites?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`).catch(() => ({ data: [] }));
      const recastRes = await axios.get(`${BASE_URL}/api/recasts?levelType=${currentLevel.type}&levelValue=${currentLevel.value}`).catch(() => ({ data: [] }));

      const merged = [...(postRes.data ?? []), ...(reciteRes.data ?? []), ...(recastRes.data ?? [])];
      merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(merged);
    } catch (err: any) {
      console.error("❌ Error fetching posts:", err.message);
      setPosts([]);
    } finally {
      setRefreshing(false);
    }
  }, [currentLevel]);

  useFocusEffect(useCallback(() => {
    fetchPosts();
  }, [fetchPosts]));

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // ---------------- Socket setup ----------------
  useEffect(() => {
    if (!currentLevel?.type || !currentLevel?.value) return;
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    const room = `level-${currentLevel.type}-${currentLevel.value}`;
    socket.emit("joinRoom", room);

    socket.on("newPost", (post) => {
      setPosts((prev) => (prev.some((p) => p._id === post._id) ? prev : [post, ...prev]));
    });
    socket.on("newRecite", (recite) => {
      setPosts((prev) => (prev.some((p) => p._id === recite._id) ? prev : [recite, ...prev]));
    });
    socket.on("newRecast", (recast) => {
      setPosts((prev) => {
        const others = prev.filter((p) => p._id !== recast.originalPostId);
        const original = prev.find((p) => p._id === recast.originalPostId);
        return original ? [original, ...others] : [recast, ...others];
      });
    });
    socket.on("deletePost", (deletedPostId) => {
      setPosts((prev) => prev.filter((p) => p._id !== deletedPostId));
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.disconnect();
    };
  }, [currentLevel]);

  // ---------------- Loading ----------------
  if (refreshing || isLoadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <LoaderKitView style={{ width: 50, height: 50 }} name="BallScaleRippleMultiple" animationSpeedMultiplier={1.0} color={theme.text} />
      </View>
    );
  }

  // ---------------- Render ----------------
  return (
    // <BottomSheetModalProvider>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
    

        {/* Drawer Button */}
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
        {/* Posts List */}
        <FlatList
          data={posts}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(item) => item._id.toString()}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isVisible={visiblePostId === item._id && isFocused}
              socket={socketRef.current}
              allPosts={posts}
              onOpenComments={() => handleOpen(item._id)}
              onDeletePost={(postId: any) => setPosts((prev) => prev.filter((p) => p._id !== postId))}
            />
          )}
          ListHeaderComponent={
            <>
              <LevelHeader />
              <Status statuses={SAMPLE_STATUSES} />
            </>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.subtext} colors={[theme.text]} />}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: theme.subtext }}>No posts for this level yet</Text>
            </View>
          }
        />
       
        {/* Comments BottomSheetModal */}
       <BottomSheet
        ref={bottomSheetRef}
        index={-1} // closed by default
        snapPoints={snapPoints}
        enablePanDownToClose
      >
          <BottomSheetView style={{ flex: 1 }}>
     <Text style={{ fontWeight: "700", fontSize: 16, padding: 12 }}>Comments</Text>
    
     <BottomSheetFlatList
      data={comments}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ccc" }}>
          <Text style={{ fontWeight: "600" }}>{item.userName}</Text>
          <Text>{item.text}</Text>
        </View>
      )}
    />

    <View style={{ flexDirection: "row", padding: 12 }}>
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Write a comment..."
        style={{ flex: 1, borderWidth: 1, borderRadius: 20, padding: 8 }}
      />
      <Pressable onPress={() => handleCommentSubmit(commentText)}>
        <Text style={{ padding: 8, color: "blue" }}>Post</Text>
      </Pressable>
    </View>
  </BottomSheetView>

      </BottomSheet>

        {/* Floating Action Button */}
        <FloatingLevelButton />
      </View>
    // </BottomSheetModalProvider>
  );
}

