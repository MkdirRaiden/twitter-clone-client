import { Link } from "react-router-dom";
import { useState } from "react";
import { usePost } from "@/hooks/customHooks.js";
import { IoIosMore } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaRetweet, FaRegHeart, FaHeart } from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkCheckFill } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth.js";
import moment from "moment";

const Post = ({ post, username, feedType }) => {
  const { authUser } = useAuth();
  const [commentText, setCommentText] = useState("");

  const { mutate: deletePost, isPending: isDeleting } = usePost();
  const { mutate: likePost, isPending: isLiking } = usePost();
  const { mutate: commentPost, isPending: isCommenting } = usePost();

  const isLiked = post?.likes?.includes(authUser?._id);
  const isSaved = authUser?.savedPosts?.includes(post?._id);
  const isMyPost = authUser?._id === post?.user?._id;

  const queryKey = ["posts", username, feedType];

  const handleLike = () => {
    likePost({
      method: "post",
      url: `/posts/${post._id}/like`,
      qKey: queryKey,
    });
  };

  const handleDelete = () => {
    deletePost({
      method: "delete",
      url: `/posts/${post._id}`,
      qKey: queryKey,
    });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    commentPost({
      method: "post",
      url: `/posts/${post._id}/comments`,
      data: { text: commentText },
      qKey: queryKey,
      callbackFn: () => setCommentText(""),
    });
  };

  return (
    <div className="p-4 border-b border-gray-800 shadow-sm relative cursor-default">
      {/* Post header */}
      <div className="flex justify-between items-center gap-4">
        <Link
          to={`/profile/${post?.user?.username}`}
          className="flex gap-2 items-center"
        >
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img
                src={post?.user?.profileImg || "/avatar-placeholder.png"}
                alt="profile"
              />
            </div>
          </div>
          <div className="text-sm">
            <p className="font-bold">@{post?.user?.username || "unknown"}</p>
            <p className="text-gray-500 text-xs">
              {moment(post?.createdAt).fromNow()}
            </p>
          </div>
        </Link>

        {isMyPost && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle btn-sm">
              <IoIosMore className="text-xl text-gray-300" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-44"
            >
              <li>
                <button onClick={handleDelete} className="text-red-500">
                  Delete post
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Post content */}
      <div className="my-2 text-md">{post?.text || ""}</div>

      {post?.img && (
        <div className="w-full h-60 overflow-hidden rounded">
          <img
            src={post.img}
            alt="Post"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Post actions */}
      <div className="flex justify-around mt-4 text-lg">
        <button
          disabled={isLiking}
          onClick={handleLike}
          className="flex gap-1 items-center cursor-pointer"
        >
          {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          {post?.likes?.length ?? 0}
        </button>

        <label
          htmlFor={`comment-modal-${post._id}`}
          className="flex gap-1 items-center cursor-pointer"
        >
          <FaRegCommentDots />
          {post?.comments?.length ?? 0}
        </label>

        <button className="flex gap-1 items-center cursor-pointer">
          <FaRetweet />
        </button>

        <button className="flex gap-1 items-center cursor-pointer">
          {isSaved ? <BsBookmarkCheckFill /> : <BsBookmarkPlus />}
        </button>
      </div>

      {/* Comment Modal */}
      <input
        type="checkbox"
        id={`comment-modal-${post._id}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box bg-base-200 text-base-content max-w-lg w-full relative">
          <label
            htmlFor={`comment-modal-${post._id}`}
            className="btn btn-sm btn-circle absolute top-2 right-2"
          >
            ✕
          </label>

          <h3 className="font-bold text-lg mb-3">Comments</h3>

          <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
            {post?.comments?.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start gap-3">
                  <div className="avatar">
                    <div className="w-6 rounded-full">
                      <img
                        src={
                          comment.user?.profileImg || "/avatar-placeholder.png"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      @{comment.user?.username}
                    </p>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">
                No comments. Be the first to comment!
              </p>
            )}
          </div>

          <form className="flex gap-2" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary text-white"
              type="submit"
              disabled={isCommenting}
            >
              {isCommenting ? "Posting..." : "Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
