import { extractPollEnrichedData } from "stream-chat";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import { createNotification } from "./notification.controller.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentID = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentID } }, // exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude friends
                { isOnboarded: true },
            ],
        });
        res.status(200).json({
            recommendedUsers,
        });
    } catch (error) {
        console.log("Error in getRecommendedUsers controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate(
                "friends",
                "fullName profilePic nativeLanguage learningLanguage"
            );

        res.status(200).json({
            friends: user.friends,
        });
    } catch (error) {
        console.log("Error in getMyFriends controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        //prevent sending friend request to self
        if (myId === recipientId) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself.",
            });
        }

        //check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }

        //check if recipient is already a friend
        if (recipient.friends.includes(myId)) {
            return res
                .status(400)
                .json({ message: "You are already friends with this user." });
        }

        //check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {
                    sender: myId,
                    recipient: recipientId,
                },
                {
                    sender: recipientId,
                    recipient: myId,
                },
            ],
        });

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "Friend request already exists." });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        // Create notification for the recipient
        await createNotification(
            recipientId,
            myId,
            "friend_request",
            `${req.user.fullName} sent you a friend request`,
            { friendRequestId: friendRequest._id }
        );

        res.status(201).json(friendRequest);
    } catch (error) {
        console.log("Error in sendFriendRequest controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId).populate('sender', 'fullName');

        if (!friendRequest) {
            return res
                .status(404)
                .json({ message: "Friend request not found." });
        }
        // verify that the recipient is the current user
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({
                message:
                    "You are not authorized to accept this friend request.",
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet adds only to an array only if they dont exist already
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        // Create notification for the sender (person who sent the request)
        await createNotification(
            friendRequest.sender,
            req.user.id,
            "friend_accepted",
            `${req.user.fullName} accepted your friend request`,
            { friendRequestId: friendRequest._id }
        );

        res.status(200).json({
            message: "friend request accepted successfully.",
        });
    } catch (err) {
        console.log("Error in acceptFriendRequest controller:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate(
            "sender",
            "fullName profilePic nativeLanguage learningLanguage"
        );
        const acceptedReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "accepted",
        }).populate(
            "recipient",
            "fullName profilePic nativeLanguage learningLanguage"
        );
        res.status(200).json({
            incomingRequests,
            acceptedReqs,
        });
    } catch (error) {
        console.log("Error in getFriendRequests controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate(
            "recipient",
            "fullName profilePic nativeLanguage learningLanguage"
        );
        res.status(200).json({ outgoingReqs });
    } catch (error) {
        console.log(
            "Error in getOutgoingFriendReqs controller:",
            error.message
        );
        res.status(500).json({ message: "Internal Server Error" });
    }
}
