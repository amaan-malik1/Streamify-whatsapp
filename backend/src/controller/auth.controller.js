import { compare } from "bcrypt";
import { userModel } from "../models/User.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { upsertUserToStream } from "../lib/stream.js";


export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(401).json({ messgae: "ALL fiels are required" })
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be atleat 8 characters "
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "Email already existed, Please use a different email."
            })

        }

        const avatarIndex = Math.floor(Math.random() * 100) + 1; // generate a number between 1-100

        const randomAvatar = `https://avatar.iran.liara.run/public/${avatarIndex}.png`;

        // creating new user and feeding it to DB
        const newUser = await userModel.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar
        })

        // TODO: Create user in stream 

        try {
            await upsertUserToStream({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic
            })
            console.log(`Stream user created for ${newUser.fullName}`);

        } catch (error) {
            console.log("Error creating stream user: ", error)
        }

        const payload = { userId: newUser._id };//this is similar to the decode 
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,    // time in milisec
            httpOnly: true,  // prevent xss attacks
            sameSite: "strict",  // prevent csrf attacks
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            success: true,
            user: newUser
        })
    } catch (error) {
        console.log("Error in signUp controller: ", error);
        res.json({
            message: "Internal server error in signup"
        })
    }
}


export async function login(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required"
            })
        }

        const userExistLogin = await userModel.findOne({ email });
        if (!userExistLogin) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, userExistLogin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // assigning the jwt
        const payload = { userId: userExistLogin._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({
            success: true,
            userExistLogin,
            // token
        })
    } catch (error) {
        console.log("Error in login controller: ", error);
        res.json({
            success: false,
            message: "Internal server error in login controller"
        })

    }
}


export function logout(req, res) {
    try {
        res.clearCookie("jwt")
        res.json({
            success: true,
            message: "Logout succesfully"
        })
    } catch (error) {
        console.log("Error while logout: ", error);
        res.status(401).json({
            success: false,
            message: "Internal server error in logout"
        })
    }
}

export async function onboard(req, res) {
    // like we're going to use req.user from authMiddleware into this adn in protectRoute
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, location, learningLanguage } = req.body;

    try {
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missinFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        //storing the updated user data to "updatedUser" and check whether its done or not.
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            // or we can use 
            //  ...req.body //for above data or below
            fullName,
            bio,
            nativeLanguage,
            location,
            learningLanguage,
            isOnboard: true,
        })

        if (!updatedUser) {
            return res.status(404).json({
                message: "updated user not found"
            })
        }

        //Update to stream
        try {
            await upsertUserToStream({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            })
            console.log(`Stream user updated after onboraing set: ${updatedUser.fullName} `);

        } catch (error) {
            console.log("Error in updating stream after onboarding: ", error);
        }

        //if done 
        res.status(200).json({
            success: true,
            user: updatedUser
        }, { new: true })   //{new:true} Move here — ensures we get updated document back

    } catch (error) {
        console.log("Error i onboarding: ", error);
        res.status(500).json({ message: "Internal server error in Onboard" })
    }
}
