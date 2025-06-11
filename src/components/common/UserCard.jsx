import FollowButton from "@/components/common/FollowButton";

const UserCard = ({ user, isPending, followUnfollow }) => {
  return (
    <div className="card pt-6 flex justify-center items-center shadow-md rounded-xs">
      <figure className="w-24 h-24 overflow-hidden rounded-lg">
        <img
          src={user.profileImg || "/avatar-placeholder.png"}
          alt={`${user.fullName} image`}
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title">
          {user.fullName.length > 10
            ? `${user.fullName.slice(0, 10)}...`
            : user.fullName}
        </h3>
        <div className="card-actions justify-center">
          <FollowButton
            cls="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
            userId={user._id}
            isPending={isPending}
            followUnfollow={followUnfollow}
          />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
