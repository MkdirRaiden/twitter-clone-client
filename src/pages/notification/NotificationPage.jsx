import { useGetData } from "@/hooks/customHooks.js";
import { useAuth } from "@/hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { del } from "@/lib/api";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";

const NotificationPage = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [deletingAll, setDeletingAll] = useState(false);
  const [deletingOneId, setDeletingOneId] = useState(null);

  const { data, isLoading, refetch } = useGetData({
    qKey: ["notifications", authUser.username],
    url: "/notifications/",
  });

  const notifications = Array.isArray(data?.notifications)
    ? data.notifications
    : [];

  const handleClick = (notif) => {
    if (notif.type === "like" || notif.type === "comment") {
      navigate(`/post/${notif.post}`);
    } else {
      navigate(`/profile/${notif.from?.username}`);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setDeletingAll(true);
      await del("/notifications");
      refetch();
    } catch (err) {
      console.error("Failed to delete all notifications", err);
    } finally {
      setDeletingAll(false);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      setDeletingOneId(id);
      await del(`/notifications/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to delete notification", err);
    } finally {
      setDeletingOneId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            disabled={deletingAll}
            className={`btn btn-sm text-white ${
              deletingAll ? "btn-disabled bg-gray-400" : "btn-error"
            }`}
          >
            {deletingAll ? "Deleting..." : "Delete All"}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="bg-base-200 p-4 rounded relative hover:bg-base-300 transition"
            >
              <button
                onClick={() => handleDeleteOne(notif._id)}
                disabled={deletingOneId === notif._id}
                className={`absolute top-2 right-2 ${
                  deletingOneId === notif._id
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500"
                }`}
                title="Delete notification"
              >
                {deletingOneId === notif._id ? (
                  <span className="text-xs">...</span>
                ) : (
                  <RxCross1 />
                )}
              </button>

              <div
                onClick={() =>
                  deletingOneId !== notif._id && handleClick(notif)
                }
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={notif.from?.profileImg || "/avatar-placeholder.png"}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">
                      @{notif.from?.username}
                    </span>{" "}
                    {notif.type === "like" && "liked your post"}
                    {notif.type === "comment" && "commented on your post"}
                    {notif.type === "follow" && "started following you"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {moment(notif.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
