import { MdEdit } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import moment from "moment";
import { useRef, useState } from "react";
import toast from "react-toastify";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProfileHeaderSkeleton from "@/components/skeletons/ProfileHeaderSkeleton";
import FollowButton from "@/components/common/FollowButton";
import { usePatch } from "@/hooks/customHooks";

const ProfileHeader = ({
  authUser,
  userProfile,
  isPending,
  followUnfollow,
  isLoading,
  isMyProfile,
  setShowEditProfile,
}) => {
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  const { mutate: patchUser } = usePatch();

  const handleImgChange = (e, stateSetter, type, setPending) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE_MB = 5;
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      return toast.error("Image exceeds 5MB limit");
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;

      stateSetter(base64);
      setPending(true);

      patchUser({
        url: `/users/profile/${authUser.username}`,
        data: { [type]: base64 },
        qKey: ["userProfile", authUser.username],
        callbackFn: () => setPending(false),
      });
    };

    reader.readAsDataURL(file);
  };

  if (isLoading || !userProfile) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <div className="relative mb-4">
      <div className="relative">
        {/* Cover Image */}
        <div className="relative group/cover">
          <img
            src={coverImg || userProfile.coverImg || "/cover.png"}
            className="h-52 w-full object-cover"
            alt="cover"
          />
          {uploadingCover && (
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Uploading...
            </div>
          )}
          {isMyProfile && (
            <>
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
              </div>
              <input
                type="file"
                hidden
                ref={coverImgRef}
                onChange={(e) =>
                  handleImgChange(e, setCoverImg, "coverImg", setUploadingCover)
                }
              />
            </>
          )}
        </div>

        {/* Profile Image */}
        <div className="absolute left-4 -bottom-16 z-10">
          <div className="avatar w-32 h-32 rounded-full ring-4 ring-base-100 overflow-hidden group/avatar relative">
            {uploadingProfile ? (
              <div className="flex items-center justify-center w-32 h-32 bg-base-300">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <img
                src={
                  profileImg ||
                  userProfile.profileImg ||
                  "/avatar-placeholder.png"
                }
                alt="profile"
                className="object-cover w-32 h-32"
              />
            )}
            {isMyProfile && (
              <>
                <div
                  className="absolute bottom-2 right-12 p-1 bg-primary rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer"
                  onClick={() => profileImgRef.current.click()}
                >
                  <MdEdit className="w-4 h-4 text-white" />
                </div>
                <input
                  type="file"
                  hidden
                  ref={profileImgRef}
                  onChange={(e) =>
                    handleImgChange(
                      e,
                      setProfileImg,
                      "profileImg",
                      setUploadingProfile
                    )
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="pt-20 mt-4 px-4  flex max-sm:flex-row justify-between">
        <div className="pb-10">
          <h2 className="font-bold text-2xl">
            {userProfile.fullName || "Unnamed User"}
          </h2>{" "}
          <p className="text-sm text-slate-500">
            <span className="text-lg">
              @{userProfile.username || "unknown"}
            </span>
            {userProfile.createdAt && (
              <span className="text-xs text-blue-200 ms-4">
                Joined {moment(userProfile.createdAt).format("MMM Do YY")}
              </span>
            )}
          </p>
          {userProfile.bio && (
            <p className="text-sm my-4 p-2 border border-gray-900 rounded-md max-sm:w-full w-2/5">
              {userProfile.bio}
            </p>
          )}
          <div className="flex gap-2 flex-wrap items-center text-sm text-slate-500 mt-1">
            {userProfile.link && (
              <a
                href={userProfile.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                <FaLink className="w-3 h-3" />
                {userProfile.link}
              </a>
            )}
          </div>
          {/* Stats */}
          <div className="flex gap-4 mt-2">
            <span className="text-sm">
              <strong>{userProfile.following?.length || 0}</strong> Following
            </span>
            <span className="text-sm">
              <strong>{userProfile.followers?.length || 0}</strong> Followers
            </span>
          </div>
        </div>
        {/* Action Button */}
        <div className="mt-3">
          {isMyProfile ? (
            <button
              className="btn btn-sm btn-outline rounded-full"
              onClick={() => setShowEditProfile(true)}
            >
              Edit Profile
            </button>
          ) : (
            <FollowButton
              cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
              userId={userProfile._id}
              isPending={isPending}
              followUnfollow={followUnfollow}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
