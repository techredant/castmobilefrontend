import React, { useState, useEffect, useRef } from "react";
  import { Animated  } from 'react-native';
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import { Gesture } from "react-native-gesture-handler";
import { useTheme } from "../../context/ThemeContext";
import moment from "moment";
import { router } from "expo-router";
import { useLevel } from "@/context/LevelContext";
import { MediaViewerModal } from "./MediaViewModal";
import ReadMore from "@fawazahmed/react-native-read-more";
import axios from "axios";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export function PostCard({ post, onOpenComments, socket }: any) {
  const { theme } = useTheme();
  const { userDetails } = useLevel();

  if (!post) return null;

  const [reposted, setReposted] = useState(false);
  const [commentsCount, setCommentsCount] = useState(
    post.comments?.length || 0
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [postCard, setPostCard] = useState(post);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [loadingRecasts, setLoadingRecasts] = useState(false);

  const LIKE_COLOR = "#E0245E";
  const REPOST_COLOR = "#17BF63";

  const mediaList = Array.isArray(post.media) ? post.media : [];
  const mediaCount = mediaList.length;
  const [expandedStates, setExpandedStates] = useState<{[key: string]: boolean}>({});

  const isExpanded = expandedStates[post._id];
  
  const gridWidth = width - 24;
  const itemSize = gridWidth / 2 - 4;

    const isLiked = userDetails?.clerkId
    ? postCard.likes?.includes(userDetails.clerkId)
    : false;
  const isRecasted = userDetails?.clerkId
    ? postCard.recasts?.some((r: any) => r.userId === userDetails.clerkId)
    : false;

  const openMedia = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

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

  /* ---------------- BUTTON ANIMATIONS ---------------- */
  // Fix: Use Animated.Value from 'react-native' not 'react-native-reanimated'
  const animatedLike = useRef(new Animated.Value(1)).current;
  const animatedRepost = useRef(new Animated.Value(1)).current;

   const incrementViews = async () => {
    try {
      await axios.post(
        `https://cast-api-zeta.vercel.app/api/posts/${postCard._id}/view`
      );
      setPostCard((prev: any) => ({ ...prev, views: prev.views + 1 }));
    } catch (err) {
      console.error("View increment failed:", err);
    }
  };

    const handleLike = async () => {
    if (!userDetails.clerkId) return;

    // Optimistic UI update
    const alreadyLiked = postCard.likes?.includes(userDetails.clerkId);
    const updatedLikes = alreadyLiked
      ? postCard.likes.filter((id: string) => id !== userDetails.clerkId)
      : [...postCard.likes, userDetails.clerkId];

    setPostCard({ ...postCard, likes: updatedLikes });

      // Animate like button for feedback
      Animated.sequence([
      Animated.spring(animatedLike, { toValue: 1.3, useNativeDriver: true }),
      Animated.spring(animatedLike, { toValue: 1, useNativeDriver: true }),
    ]).start();

    try {
      await axios.post(
        `https://cast-api-zeta.vercel.app/api/posts/${postCard._id}/like`,
        { userId: userDetails.clerkId }
      );
        console.log("liked");
      await incrementViews(); // ✅ Increase views
    } catch (err) {
      console.error(err);
      // Rollback if backend fails
      setPostCard(postCard);
    }
  };

const handleRepost = async (quote = "") => {
  if (!userDetails.clerkId) return;
  setLoadingRecasts(true);

  // 1️⃣ Optimistically update local state
  const newRecast = {
    userId: userDetails.clerkId,
    nickname: userDetails?.nickName || "anon",
    quote: quote || null,
    recastedAt: new Date().toISOString(),
    _id: Math.random().toString(), // temporary ID for UI purposes
  };

  setPostCard((prev: { recasts: any; }) => ({
    ...prev,
    recasts: [...(prev.recasts || []), newRecast],
  }));
  setReposted(true);

  try {
    // 2️⃣ Send to server
    await axios.post(
      `https://cast-api-zeta.vercel.app/api/posts/${postCard._id}/recast`,
      {
        userId: userDetails?.clerkId,
        nickname: userDetails?.nickName || "anon",
        quoteText: quote,
      }
    );

    // 3️⃣ Increment views
    await incrementViews();    

    setQuoteVisible(false);
    setQuoteText("");
  } catch (err) {
    console.error(err);

    // 4️⃣ Rollback if server fails
    setPostCard((prev: { recasts: any[]; }) => ({
      ...prev,
      recasts: prev.recasts?.filter((r: { _id: string; }) => r._id !== newRecast._id),
    }));
    setReposted(false);
  } finally {
    setLoadingRecasts(false);
  }
};



  
  const pureRecasts = (postCard.recasts || []).filter((r: any) => !r.quote);
  const quoteRecasts = (postCard.recasts || []).filter((r: any) => r.quote);
  const recites = (postCard.recasts || []).filter((r: any) => r.quote);

  return (
    <>
      <View
        style={{
          backgroundColor: theme.card,
          paddingVertical: 12,
          marginBottom: 8,
          borderRadius: 12,
        }}
      >
        {/* HEADER */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 12,
          }}
        >
          <Pressable
            onPress={() => router.push(`/profileId/${postCard.user._id}`)}
            style={{ flex: 1, flexDirection: "row", gap: 10 }}
          >
            <Image
              source={{ uri: postCard.user.image }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <View>
              <Text style={{ color: theme.text, fontWeight: "bold" }}>
                {postCard.user.firstName}
              </Text>
              <Text style={{ color: theme.subtext, fontSize: 12 }}>
                @{postCard.user.nickName}
              </Text>
            </View>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 4,
              backgroundColor: theme.background,
              borderRadius: 50,
              padding: 4,
            }}
          >
            <Ionicons name="time-outline" size={14} color="gray" />
            <Text
              style={{
                color: theme.subtext,
                fontWeight: "600",
                fontSize: 10,
                fontStyle: "italic",
              }}
            >
              {moment(postCard.createdAt).fromNow()}
            </Text>
          </View>

          <TouchableOpacity>
            <Feather name="more-vertical" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        {/* MEDIA GRID */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 12 }}>
          {mediaList.slice(0, 4).map((uri: string, idx: number) => {
            const remaining = mediaCount - 4;
            const isLast = idx === 3 && remaining > 0;

            const isSingle = mediaCount === 1;
            const widthStyle = isSingle ? width - 28 : itemSize;
            const heightStyle = isSingle ? 400 : itemSize;

            return (
              <Pressable
                key={uri}
                onPress={() => openMedia(idx)}
                style={{
                  width: widthStyle,
                  height: heightStyle,
                  margin: 2,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {postCard.videos?.includes(uri) ? (
                  <Video
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                  />
                ) : (
                  <Image
                    source={{ uri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}

                {/* Overlay +X if more than 4 */}
                {isLast && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: "rgba(0,0,0,0.55)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#fff", fontSize: 32, fontWeight: "bold" }}>
                      +{remaining}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* COLLAPSIBLE CAPTION */}
        <Text
  numberOfLines={isExpanded ? undefined : 3}
  style={{ color: theme.text, paddingHorizontal: 12, marginTop: 6 }}
>
  {postCard.caption}
</Text>

<Pressable
  onPress={() =>
    setExpandedStates((prev) => ({
      ...prev,
      [postCard._id]: !isExpanded,
    }))
  }
>
  <Text style={{ color: "#1DA1F2", fontWeight: "600", marginLeft: 12 }}>
    {isExpanded ? "Less" : "More"}
  </Text>
</Pressable>


        {/* ACTIONS */}
        <View
          style={{
           flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 50,
    borderColor: theme.border,
            marginBottom: 8,
            padding: 2,
    marginHorizontal:12
          }}
        >
          {/* Comments */}
          <Pressable
            onPress={() => onOpenComments?.(postCard)}
            style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
          >
            <Feather name="message-circle" size={18} color={theme.subtext} />
            <Text style={{ color: theme.subtext }}>{commentsCount}</Text>
          </Pressable>

          {/* Repost */}
          <Animated.View style={[animatedRepost, { padding: 4}]}>
            <Pressable
              onPress={() => handleRepost()}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Feather
                name="repeat"
                size={18}
                color={reposted ? REPOST_COLOR : theme.subtext}
              />
              <Text style={{ color: reposted ? REPOST_COLOR : theme.subtext,minWidth: 8 }}>
                {pureRecasts.length}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Like */}
          <Animated.View style={[animatedLike, { padding: 4}]}>
            <Pressable
              onPress={handleLike}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Feather
                name="heart"
                size={18}
                color={isLiked ? LIKE_COLOR : theme.subtext}
              />
              <Text style={{ color: isLiked ? LIKE_COLOR : theme.subtext, minWidth: 8 }}>
                {postCard.likes?.length > 0 ? postCard.likes.length : " "}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Views */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Feather name="eye" size={18} color={theme.subtext} />
            <Text style={{ color: theme.subtext }}>{postCard.views}</Text>
          </View>
        </View>
      </View>

      {/* MEDIA MODAL */}
      <MediaViewerModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        mediaList={mediaList}
        selectedIndex={selectedIndex}
        post={postCard}
        pinchGesture={pinchGesture}
        pinchStyle={pinchStyle}
      />
    </>
  );
}


