import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config({path: "./.env.local"})

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) console.error("Missing apiKey or apiSecret");

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const createStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.log("Error in stream-chat function");
    throw new Error(error);
  }
};

export const generateStreamToken = async (userId) => {};
