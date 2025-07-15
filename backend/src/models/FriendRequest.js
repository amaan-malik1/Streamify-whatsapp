import mongoose, { mongo } from "mongoose";
import { Schema } from "mongoose";

const friendRequestSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted"],
            default: "pending"
        },
    }, { timestamps: true }
)

const friendRequestModel = mongoose.model('FriendRequest', friendRequestSchema);

export default friendRequestModel;
