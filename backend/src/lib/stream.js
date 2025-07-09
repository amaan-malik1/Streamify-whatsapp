import { StreamChat } from 'stream-chat';
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;


if (!apiKey || !apiSecret) {
    console.error("Stream api key or secret is missing");
}

const StreamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertUserToStream = async (userData) => {
    try {
        await StreamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.log("Error in upserting the User data: ", error);
    }
}




