import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { acceptFriendRequest, getAllFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommandedUsers, sendFriendRequest } from "../controller/user.controller.js";

const router = express.Router();
router.use(protectRoute)

router.get('/', getRecommandedUsers);
router.get('/friends', getMyFriends);
router.post('/sendFriendRequest/:requestedId', sendFriendRequest);
router.put('/acceptFriendRequest/:requestedId/accept', acceptFriendRequest);

router.get('/allFriendRequest', getAllFriendRequests);
router.get('/outgoingFriendReqs', getOutgoingFriendReqs);

export default router;