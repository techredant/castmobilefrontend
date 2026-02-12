import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export function AvatarWithStatus({
  imageUrl,
  label = "Your status",
  hasStatus = false,
  size = 56,
}) {
  const fallbackImage =
    "https://ui-avatars.com/api/?name=User&background=22c55e&color=fff";

  return (
    <Pressable
      onPress={() => router.push("/status/StatusInput")}
      hitSlop={10}
      style={styles.container}
    >
      <View style={[styles.avatarWrapper, { width: size, height: size }]}>
        {/* Ring */}
        <View
          style={[
            styles.ring,
            {
              borderColor: hasStatus ? "#22c55e" : "#E5E7EB",
              width: size + 6,
              height: size + 6,
              borderRadius: (size + 6) / 2,
            },
          ]}
        />

        {/* Avatar */}
        <Image
          source={{ uri: imageUrl || fallbackImage }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />

        {/* Plus badge */}
        {!hasStatus && (
          <View style={styles.plusBadge}>
            <Feather name="plus" size={12} color="#fff" />
          </View>
        )}
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
  },

  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    position: "absolute",
    borderWidth: 2,
  },

  avatar: {
    backgroundColor: "#eee",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  plusBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#22c55e",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
  },

  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
});
