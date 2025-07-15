import express from "express";
import { login, logout, onboard, signup } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// defining the all routes 
// ('/route', method/function)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/onboarding', protectRoute, onboard);
router.get('/me', protectRoute, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    })
});





export default router;