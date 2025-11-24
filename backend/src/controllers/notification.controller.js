import Notification from "../models/Notification.js";

// Create a new notification
export async function createNotification(recipientId, senderId, type, message, data = {}) {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      data,
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.log("Error creating notification:", error);
    throw error;
  }
}

// Get notifications for a user
export async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("sender", "fullName profilePic")
      .populate("data.friendRequestId")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 notifications

    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log("Error in getNotifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mark notification as read
export async function markNotificationAsRead(req, res) {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient: req.user.id, // Ensure user can only update their own notifications
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(req, res) {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get unread notification count
export async function getUnreadCount(req, res) {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.log("Error getting unread count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}