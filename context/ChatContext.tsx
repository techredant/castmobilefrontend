// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import { useUser } from "@clerk/clerk-expo";
// import { StreamChat } from "stream-chat";

// type ChatContextType = {
//   client: StreamChat | null;
// };

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// type Props = {
//   children: ReactNode;
// };

// const API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY!;
// const STREAM_TOKEN_BASE_URL =
//   "https://cast-api-zeta.vercel.app/api/stream/token";

// export const ChatProvider = ({ children }: Props) => {
//   const { user } = useUser();
//   const [client, setClient] = useState<StreamChat | null>(null);

//   useEffect(() => {
//     if (!API_KEY || !user?.id) return;

//     let chatClient: StreamChat;

//     const initChat = async () => {
//       try {
//         chatClient = StreamChat.getInstance(API_KEY);

//         const res = await fetch(
//           `${STREAM_TOKEN_BASE_URL}/${user.id}`
//         );

//         if (!res.ok) {
//           console.error("Token fetch failed:", await res.text());
//           return;
//         }

//         const data: { token: string } = await res.json();

//         await chatClient.connectUser(
//           {
//             id: user.id,
//             name: user.fullName ?? "Anonymous",
//           },
//           data.token
//         );

//         setClient(chatClient);
//       } catch (err) {
//         console.error("Stream init error:", err);
//       }
//     };

//     initChat();

//     return () => {
//       chatClient?.disconnectUser();
//     };
//   }, [user?.id]);

//   if (!client) return null;

//   return (
//     <ChatContext.Provider value={{ client }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChatContext = () => {
//   const context = useContext(ChatContext);
//   if (!context)
//     throw new Error("useChatContext must be used within ChatProvider");
//   return context;
// };
