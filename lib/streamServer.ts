import { StreamChat } from "stream-chat";

if (!process.env.EXPO_PUBLIC_STREAM_API_KEY) {
    throw new Error("EXPO_PUBLIC_STREAM_API_KEY is not set")
}

// if (!process.env.EXPO_PUBLIC_STREAM_API_SECRET_KEY) {
//     throw new Error("EXPO_PUBLIC_STREAM_API_SECRET_KEY is not set")
// }

const serverClient = StreamChat.getInstance(
    process.env.EXPO_PUBLIC_STREAM_API_KEY,
    // process.env.EXPO_PUBLIC_STREAM_API_SECRET_KEY,

)

export default serverClient;