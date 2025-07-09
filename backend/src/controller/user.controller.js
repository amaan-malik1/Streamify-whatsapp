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
                { $id: { $nin: currentUser.friends } }, //exclude the user friends $nin => not in 
                { isOnboraded: true }
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
        const userForFriend = await userModel.find(req.user._id).select("friends").populate("friends", "fullName profilePic learningLanguage nativeLanguage location");

        // response the user's friends from friends schema
        res.status(200).json(userForFriend.friends);

    } catch (error) {
        console.log("Error in getMyFriends controller: ", error);
        res.status(200).json({ success: false, message: "Internal server error in getMyFriends" })
    }

}

export async function sendFriendRequest(req, res) {
    
}