import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // Don't return null, let React Query handle the error state
    throw error;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data.friends || [];
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data.recommendedUsers || [];
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing/friend-requests");
  return response.data.outgoingReqs || [];
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return {
    incomingReqs: response.data.incomingRequests || [],
    acceptedReqs: response.data.acceptedReqs || []
  };
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

// Notification API functions
export async function getNotifications() {
  const response = await axiosInstance.get("/notifications");
  return response.data.notifications || [];
}

export async function getUnreadNotificationCount() {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data.unreadCount || 0;
}

export async function markNotificationAsRead(notificationId) {
  const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
  return response.data;
}

export async function markAllNotificationsAsRead() {
  const response = await axiosInstance.put("/notifications/mark-all-read");
  return response.data;
}