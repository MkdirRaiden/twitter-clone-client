import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.js";
import { useGetData, useFollow } from "@/hooks/customHooks.js";
import ProfileHeader from "@/pages/profile/ProfileHeader";
import Posts from "@/components/common/Posts";
import EditProfileModal from "@/pages/profile/EditProfileModal";
import ProfileHeaderSkeleton from "@/components/skeletons/ProfileHeaderSkeleton";

const ProfilePage = () => {
  const { authUser } = useAuth();
  const { username: paramUsername } = useParams();
  const [feedType, setFeedType] = useState("posts");
  const [showEditProfile, setShowEditProfile] = useState(false);

  const username = paramUsername || authUser?.username;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetData({
    qKey: ["userProfile", username],
    url: `/users/profile/${username}`,
  });

  const profileUser = response?.user || null;

  const isMyProfile = authUser?._id === profileUser?._id;
  const [followUnfollow, isPending] = useFollow();

  // Render skeleton directly on loading
  if (isLoading) return <ProfileHeaderSkeleton />;

  // If still no data, error fallback
  if (isError || !profileUser) return <p className="p-4">User not found</p>;

  return (
    <div className="min-h-[70vh]" key={username}>
      {showEditProfile && (
        <EditProfileModal
          username={username}
          setShowEditProfile={setShowEditProfile}
        />
      )}

      <ProfileHeader
        userProfile={profileUser}
        authUser={authUser}
        isMyProfile={isMyProfile}
        followUnfollow={followUnfollow}
        isPending={isPending}
        setShowEditProfile={setShowEditProfile}
        isLoading={isLoading}
      />

      {/* Post Type Tabs */}
      <div className="flex w-full border-b border-gray-700 md:justify-around px-4 mt-4 justify-between">
        <div
          className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary transition-all duration-300 ${
            feedType === "posts" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setFeedType("posts")}
        >
          User Posts
        </div>
        <div
          className={`cursor-pointer py-2 text-lg hover:border-b-2 hover:border-primary transition-all duration-300 ${
            feedType === "likes" ? "border-b-2 border-primary" : ""
          }`}
          onClick={() => setFeedType("likes")}
        >
          Liked Posts
        </div>
      </div>

      <Posts feedType={feedType} user={profileUser} />
    </div>
  );
};

export default ProfilePage;
