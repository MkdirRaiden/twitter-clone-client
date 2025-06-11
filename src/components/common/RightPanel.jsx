import { Link } from "react-router-dom";
import RightPanelSkeleton from "@/components/skeletons/RightPanelSkeleton";
import { useFollow, useGetData } from "@/hooks/customHooks.js";
import FollowButton from "@/components/common/FollowButton";

const RightPanel = () => {
  const [followUnfollow, isPending] = useFollow();

  // Correctly fetch and unpack users from response
  const { data, isLoading } = useGetData({
    qKey: ["suggestedUsers"],
    url: "/users/suggestions",
  });

  const suggestedUsers = data?.users ?? [];

  return (
    <div className="bg-[#16181C] p-4 rounded-md my-4 sticky top-2">
      <p className="font-bold mb-4 flex justify-between">
        <span className="text-slate-500">Who to follow</span>
        <Link
          to="/all-suggested-users"
          className="text-primary hover:underline"
        >
          See more
        </Link>
      </p>

      <div className="flex flex-col gap-4">
        {isLoading && (
          <>
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
            <RightPanelSkeleton />
          </>
        )}

        {!isLoading && suggestedUsers.length === 0 && (
          <p>No suggested users available.</p>
        )}

        {!isLoading &&
          suggestedUsers.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user.username}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex gap-2 items-center">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={user.profileImg || "/avatar-placeholder.png"}
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {user.fullName}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{user.username}
                  </span>
                </div>
              </div>
              <div>
                <FollowButton
                  cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                  userId={user._id}
                  isPending={isPending}
                  followUnfollow={followUnfollow}
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default RightPanel;
