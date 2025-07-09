import express from "express";
import { protectRoute } from "../middleware/protectRoute";
import { getMyFriends, getRecommandedUsers } from "../controller/user.controller.js";

const router = express.Router();
router.use(protectRoute)

router.get('/', getRecommandedUsers);
router.get('/friends', getMyFriends);
router.post('/friendRequest/:id ', sendFriendRequest);

export default router;