import { generateStreamToken } from "../lib/stream.js";


export async function getStreamToken(req, res) {
    try {
        const streamToken = generateStreamToken(req.user._id);
        res.status(200).json(streamToken);
    } catch (error) {
        console.log("Error in getStreamToken controller: ", error);
        res.status(500).json({ message: "Internal server error" })
    }
}