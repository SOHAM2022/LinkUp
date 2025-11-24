import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

// Get notifications for the current user
router.get("/", getNotifications);

// Get unread notification count
router.get("/unread-count", getUnreadCount);

// Mark a specific notification as read
router.put("/:notificationId/read", markNotificationAsRead);

// Mark all notifications as read
router.put("/mark-all-read", markAllNotificationsAsRead);

export default router;