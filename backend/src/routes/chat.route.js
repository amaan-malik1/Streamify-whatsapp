import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getStreamToken } from "../controller/chat.controller.js";
const router = express.Router();


router.use(protectRoute);

router.get('/token',getStreamToken)


export default router;