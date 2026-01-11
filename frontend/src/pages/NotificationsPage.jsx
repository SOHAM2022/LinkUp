import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getFriendRequests,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, CheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { getAvatarUrl } from "../lib/utils";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading: loadingFriendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { data: notifications = [], isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    refetchInterval: 10000, // Refresh every 10 seconds
    refetchOnWindowFocus: true,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];
  const isLoading = loadingFriendRequests || loadingNotifications;

  // Filter unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);
  const hasUnreadNotifications = unreadNotifications.length > 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          {hasUnreadNotifications && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => markAllAsReadMutation()}
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Mark All Read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* GENERAL NOTIFICATIONS */}
            {notifications.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-primary" />
                  Recent Activity
                  {hasUnreadNotifications && (
                    <span className="badge badge-primary ml-2">{unreadNotifications.length}</span>
                  )}
                </h2>

                <div className="space-y-3">
                  {notifications.slice(0, 10).map((notification) => {
                    // Skip notifications with missing sender data
                    if (!notification?.sender) return null;

                    return (
                      <div
                        key={notification._id}
                        className={`card shadow-sm hover:shadow-md transition-shadow cursor-pointer ${notification.read ? "bg-base-200" : "bg-primary/10 border-primary/20"
                          }`}
                        onClick={() => !notification.read && markAsReadMutation(notification._id)}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={getAvatarUrl(notification.sender.profilePic, notification.sender.fullName)}
                                alt={notification.sender.fullName || 'User'}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{notification.sender.fullName || 'Unknown User'}</h3>
                                  <p className="text-sm my-1">{notification.message}</p>
                                  <p className="text-xs flex items-center opacity-70">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  )}
                                  <div className={`badge ${notification.type === 'friend_request' ? 'badge-primary' :
                                    notification.type === 'friend_accepted' ? 'badge-success' :
                                      'badge-secondary'
                                    }`}>
                                    {notification.type === 'friend_request' ? 'Friend Request' :
                                      notification.type === 'friend_accepted' ? 'Request Accepted' :
                                        'Notification'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => {
                    // Skip requests with missing sender data
                    if (!request?.sender) return null;

                    return (
                      <div
                        key={request._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                <img src={getAvatarUrl(request.sender.profilePic, request.sender.fullName)} alt={request.sender.fullName || 'User'} />
                              </div>
                              <div>
                                <h3 className="font-semibold">{request.sender.fullName || 'Unknown User'}</h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-secondary badge-sm">
                                    Native: {request.sender.nativeLanguage || 'N/A'}
                                  </span>
                                  <span className="badge badge-outline badge-sm">
                                    Learning: {request.sender.learningLanguage || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => {
                    // Skip notifications with missing recipient data
                    if (!notification?.recipient) return null;

                    return (
                      <div key={notification._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={getAvatarUrl(notification.recipient.profilePic, notification.recipient.fullName)}
                                alt={notification.recipient.fullName || 'User'}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification.recipient.fullName || 'Unknown User'}</h3>
                              <p className="text-sm my-1">
                                {notification.recipient.fullName || 'Someone'} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {notifications.length === 0 && incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;