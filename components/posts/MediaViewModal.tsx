import React from "react";
import {
  Modal,
  View,
  FlatList,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

type Props = {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  mediaList: string[];
  selectedIndex: number;
  post: any;
  pinchGesture: any;
  pinchStyle: any;
};

export function MediaViewerModal({
  modalVisible,
  setModalVisible,
  mediaList,
  selectedIndex,
  post,
  pinchGesture,
  pinchStyle,
}: Props) {
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setModalVisible(false)}
    >
      {/* Translucent backdrop */}
      <View style={styles.backdrop}>
        {/* Close button */}
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.closeBtn}
        >
          <Feather name="x" size={30} color="#fff" />
        </Pressable>

        <FlatList
          horizontal
          pagingEnabled
          data={mediaList}
          initialScrollIndex={selectedIndex}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <View style={styles.mediaContainer}>
              <GestureDetector gesture={pinchGesture}>
                {post?.videos?.includes(item) ? (
                  <Video
                    source={{ uri: item }}
                    style={styles.media}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                  />
                ) : (
                  <Animated.Image
                    source={{ uri: item }}
                    style={[styles.media, pinchStyle]}
                  />
                )}
              </GestureDetector>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)", // 🔥 translucent
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 20,
    padding: 6,
  },
  mediaContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  media: {
    width,
    height,
    resizeMode: "contain",
  },
});
