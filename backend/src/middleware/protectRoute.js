import jwt from 'jsonwebtoken';
import { userModel } from '../models/User.js';



export const protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (!token) {
            return res.json({
                message: "Unauthorized - No token provided"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid or token expired"
            })
        }

        const userPresent = await userModel.findById(decode.userId).select("-password");   //findByID MAI payload login  K WAT VALI AAYEGI and || select password remove karta password user ko dikhane se like we are hgetting in postman /me route

        if (!userPresent) {
            return res.status(401).json({
                message: "Unauthorized - User not found"
            })
        }

        req.user = userPresent;    // add the user to request ab isko jhaa bhi use karenge "req.user" k naam se krenge userId yhi hogi iske zariye requiest krenege || "isko use bhi unhee mai kr skte h jo is method ko use karega"

        next();
    } catch (error) {
        console.log("Error in authorizing/protectRoute middleware token: ", error);
        res.status(401).json({
            message: 'Internal server error'
        })

    }
}