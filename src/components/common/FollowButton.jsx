import { useAuth } from "@/hooks/useAuth.js";

import { useQueryClient } from "@tanstack/react-query";

const FollowButton = ({ userId, isPending, followUnfollow, cls = "" }) => {
  const { authUser } = useAuth();
  const queryClient = useQueryClient(); // to manually refetch

  const isFollowing = authUser?.following?.includes(userId);

  const handleClick = (e) => {
    e.preventDefault();

    followUnfollow(userId, {
      onSuccess: () => {
        // Invalidate user data
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        queryClient.invalidateQueries({ queryKey: ["followingPage"] }); // optional
      },
    });
  };

  return (
    <button className={cls} disabled={isPending} onClick={handleClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
