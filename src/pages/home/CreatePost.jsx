import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { usePost } from "@/hooks/customHooks.js";
import { IoIosSend } from "react-icons/io";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth.js";
import { useQueryClient } from "@tanstack/react-query";

const CreatePost = ({ feedType = "forYou" }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [imgSizeMB, setImgSizeMB] = useState(null);
  const [imgError, setImgError] = useState("");
  const imgRef = useRef(null);
  const [showBorder, setShowBorder] = useState(false);

  const { authUser } = useAuth();
  const queryClient = useQueryClient();
  const { mutate: createPost, isPending } = usePost();

  const MAX_SIZE_MB = 5;

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeMB = file.size / (1024 * 1024);
    const roundedSize = Number(sizeMB.toFixed(2));
    setImgSizeMB(roundedSize);

    if (sizeMB > MAX_SIZE_MB) {
      setImgError(`Image size exceeds ${MAX_SIZE_MB}MB.`);
      imgRef.current.value = null;
      setImg(null);
      return;
    }

    setImgError("");

    const reader = new FileReader();
    reader.onload = () => {
      setImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imgError) return;

    createPost({
      method: "post",
      url: "/posts/",
      data: { text, img },
      qKey: ["posts", authUser.username],
      callbackFn: (newPost) => {
        setText("");
        setImg(null);
        setImgError("");
        setImgSizeMB(null);

        // Inject into the correct query cache
        queryClient.setQueryData(
          ["posts", authUser.username, feedType],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  posts: [newPost.post, ...oldData.pages[0].posts],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        );

        // Optional: scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  return (
    <div className="flex p-4 items-start gap-4">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-hidden border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setShowBorder(true)}
        />

        <div className="w-full flex flex-col items-center gap-2">
          {img && (
            <div className="relative w-72">
              <IoCloseSharp
                className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                  setImgError("");
                  setImgSizeMB(null);
                }}
              />
              <img
                src={img}
                alt="Selected"
                className="w-full h-72 object-contain rounded-sm"
              />
            </div>
          )}

          {imgSizeMB && !imgError && (
            <p className="text-gray-400 text-xs text-center">
              Image size: {imgSizeMB} MB
            </p>
          )}

          {imgError && (
            <p className="text-red-500 text-sm text-center">{imgError}</p>
          )}
        </div>

        <div
          className={`flex justify-between py-2 ${
            showBorder ? "border-t border-secondary" : ""
          }`}
        >
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            accept="image/*"
            type="file"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            id="post-submit-btn"
            disabled={isPending || (!text && !img) || !!imgError}
            className="btn btn-primary rounded-full btn-sm text-white px-4"
          >
            {isPending ? (
              <>
                Posting
                <LoadingSpinner size="xs" />
              </>
            ) : (
              <>
                Post <IoIosSend />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
