import friendRequestModel from "../models/FriendRequest.js";
import { userModel } from "../models/User.js";

export async function getRecommandedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        //"Find all users who are not me, not my friends, and who finished onboarding."
        const recommandedUser = await userModel.find({
            //only include users who pass all these checks.
            //$and to combine multiple conditions together.

            $and: [
                //$ne: Not equal. ye nahi hona chahiye and 
                { _id: { $ne: currentUserId } },    //exclude the current user

                // not even this
                //Not in this list.
                { _id: { $nin: currentUser.friends } }, //exclude the user friends $nin => not in 
                { isOnboard: true }
            ]
        })

        res.status(200).json({
            success: true,
            recommandedUser
        })
    } catch (error) {
        console.log("Error in getRecommandedUser controller: ", error);
        res.status(500).json({
            message: "Intenal sever error in getRecommandedUser controller."
        })

    }
}

export async function getMyFriends(req, res) {
    try {
        const getMyFriends = await userModel.findById(req.user._id).select("friends").populate("friends", "fullName profilePic learningLanguage nativeLanguage location");

        if (!getMyFriends) {
            return res.status(404).json({ message: "User not found" });
        }

        // response the user's friends from friends schema
        res.status(200).json(getMyFriends.friends);

    } catch (error) {
        console.log("Error in getMyFriends controller: ", error);
        res.status(200).json({ success: false, message: "Internal server error in getMyFriends" })
    }

}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { requestedId: recipientId } = req.params;

        //preventing sending request to my self
        if (myId === recipientId) {
            return res.status(400).json({
                message: "You can't send request to yourself"
            })
        }

        const recipient = await userModel.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ success: false, message: "Recipient not found" })
        }

        //if recipient check, if user is already friend
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({
                success: false,
                message: "You are already friend with this user"
            })
        }

        const existingRequest = await friendRequestModel.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if (existingRequest) {
            res.status(400).json({ message: "Request already existed" })
        }

        const sendFriendRequestTo = await friendRequestModel.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(sendFriendRequestTo)
    }
    catch (error) {
        console.error("Error in sendFriendRequest controller: ", error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { requestedId: acceptId } = req.params;
        const acceptingRequest = await friendRequestModel.findById(acceptId);
        if (!acceptingRequest) {
            return res.status(404).json({
                message: "Friend request not found!"
            })
        }

        //verify if the current user is recipient
        if (acceptingRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept this request!"
            })
        }

        acceptingRequest.status = "accepted";
        await acceptingRequest.save();

        //add users to each others friend list
        //$addToSet: add element toa rry only if they don't already existed.
        await userModel.findByIdAndUpdate(acceptingRequest.sender, { $addToSet: { friends: acceptingRequest.recipient } });

        await userModel.findByIdAndUpdate(acceptingRequest.recipient, { $addToSet: { friends: acceptingRequest.sender } });


        res.status(200).json({
            message: "Friend request accepted"
        })

    } catch (error) {
        console.log("Error in acceptFriendRequest controller: ", error);
        res.status(500).json({
            message: "Internal server error"
        })

    }
}

export async function getAllFriendRequests(req, res) {
    try {
        const incomingReqs = await friendRequestModel.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage location");       // populate => ('IsmeDaalo', "ye ye ye dalo")

        const acceptedReqs = await friendRequestModel.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")


        res.status(201).json({ incomingReqs, acceptedReqs })
    } catch (error) {
        console.log("Error in getAllFriendRequests controller", error);
        res.status(500).json({ message: "Internal server error!" })
    }

}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingReqs = await friendRequestModel.find({
            sender: req.user._id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingReqs)
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller: ", error);
        res.status(500).json({ message: "Internal server error" })
    }
}