import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    console.log("Signup request received:", { email, fullName });
    try {
        if (!email || !password || !fullName) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists , please use a different one",
            });
        }

        // Generate avatar using ui-avatars.com (reliable service)
        const colors = ['0D8ABC', '3498db', '9b59b6', 'e74c3c', '1abc9c', 'f39c12', '2ecc71'];
        const bgColor = colors[Math.floor(Math.random() * colors.length)];
        const randomAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=${bgColor}&color=fff&size=200&bold=true`;

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("error creating Stream user", error);
        }

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );

        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true, // prevent XSS attacks
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // none for cross-origin in production
            secure: process.env.NODE_ENV === "production", // require HTTPS in production
        });

        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        console.log("signup error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });

        if (!user)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
        res.cookie("jwt", token, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // none for cross-origin in production
            secure: process.env.NODE_ENV === "production", // require HTTPS in production
        });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("error in login Controller:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successfull" });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } =
            req.body;

        if (
            !fullName ||
            !bio ||
            !nativeLanguage ||
            !learningLanguage ||
            !location
        ) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body,
                isOnboarded: true,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ message: "User not found or update failed" });
        }

        // Update Stream user
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            });
            console.log(`Stream user updated for ${updatedUser.fullName}`);
        } catch (error) {
            console.log("error updating Stream user", error);
        }

        res.status(200).json({
            success: true,
            message: "Onboarding successful",
            user: updatedUser,
        });
    } catch (error) {
        console.log("Error in onboarding controller:", error);

        res.status(500).json({ message: "Internal Server Error" });
    }
}
