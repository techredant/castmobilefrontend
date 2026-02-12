import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
} from "react-native";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";
import { useChatContext } from "stream-chat-expo";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { LoaderKitView } from "react-native-loader-kit";


const BASE_URL = "https://cast-api-zeta.vercel.app/api/users";

interface Member {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  image: string;
}

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const { theme, isDark } = useTheme();
  const { client } = useChatContext();
  const { user } = useUser();
const [search, setSearch] = useState("");

  const currentUserId = user?.id;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(BASE_URL, {
          params: { clerkId: currentUserId },
        });

        // Filter out current user
        const otherUsers = res.data.filter(
          (member: Member) => member.clerkId !== currentUserId
        );

        setMembers(otherUsers);
      } catch (err) {
        console.error("❌ Fetch users error:", err);
      } 
    };

    if (currentUserId) fetchUsers();
  }, [currentUserId]);


  const filteredMembers =
  search.trim().length === 0
    ? [] // show nothing until user types
    : members.filter((member) => {
        const q = search.toLowerCase();

        return (
          member.firstName?.toLowerCase().includes(q) ||
          member.lastName?.toLowerCase().includes(q) ||
          member.nickName?.toLowerCase().includes(q)
        );
      });


  // Start a DM channel
  const startDM = async (member: Member) => {
    try {
      if (!client?.userID) return;

      // Prevent DM with yourself
      if (member.clerkId === client.userID) {
        console.warn("Cannot DM yourself");
        return;
      }

      const channel = client.channel("messaging", {
        members: [client.userID, member.clerkId],
        distinct: true,
      });

      await channel.watch();

      router.push(`/channel/${channel.cid}`);
    } catch (err) {
      console.error("❌ Failed to create DM:", err);
    }
  };

  const renderMember = ({ item }: { item: Member }) => {
    return (
      <TouchableOpacity onPress={() => startDM(item)} activeOpacity={0.7}>
        <View style={[styles.memberCard, { backgroundColor: theme.card }]}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  item.image?.trim() !== ""
                    ? item.image
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${item.firstName || "User"}`,
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: theme.text }]}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={[styles.username, { color: theme.subtext }]}>
                @{item.nickName || "unknown"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//              <LoaderKitView
//   style={{ width: 50, height: 50 }}
//    name={"BallScaleRippleMultiple"}
//   animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
//   color={'red'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
// />
//       </View>
//     );
//   }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <View className="flex-1 border-hairline mt-10 bg-red-200"><TextInput
  placeholder="Search members..."
  placeholderTextColor={theme.subtext}
  value={search}
  onChangeText={setSearch}
  style={{
    marginHorizontal: 12,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: theme.card,
    color: theme.text,
  }}
/></View>


{search.trim().length === 0 ? (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ color: theme.subtext, fontSize: 14 }}>
      Start typing to find members 🔍
    </Text>
  </View>
) : filteredMembers.length === 0 ? (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ color: theme.text, fontSize: 16 }}>
      No members found 😕
    </Text>
  </View>
) : (
  <FlatList
    data={filteredMembers}
    renderItem={renderMember}
    keyExtractor={(item) => item._id}
    contentContainerStyle={{ padding: 10, paddingBottom: 60 }}
    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    showsVerticalScrollIndicator={false}
  />
)}


    </View>
  );
}

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    padding: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  username: { fontSize: 14, marginTop: 2 },
});
