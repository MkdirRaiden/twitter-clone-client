import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { usePatch, useGetData } from "@/hooks/customHooks.js";

const EditProfileModal = ({ username, setShowEditProfile }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    email: "",
    link: "",
  });

  const { data: profile } = useGetData({
    qKey: ["userProfile", username],
    url: `/users/profile/${username}`,
  });

  const { mutate: updateProfile, isPending } = usePatch();

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        bio: profile.bio || "",
        email: profile.email || "",
        link: profile.link || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      method: "patch",
      url: `/users/profile/${username}`,
      data: formData,
      qKey: ["userProfile", username],
      callbackFn: () => setShowEditProfile(false),
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-black/80 fixed inset-0 z-50 grid place-items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral p-6 rounded-lg w-full max-w-md shadow-xl relative"
      >
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          onClick={() => setShowEditProfile(false)}
          type="button"
        >
          <MdClose size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            className="input input-bordered w-full"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="link"
            className="input input-bordered w-full"
            placeholder="link"
            value={formData.location}
            onChange={handleInputChange}
          />
          <textarea
            name="bio"
            className="textarea textarea-bordered w-full"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="3"
          />
        </div>

        <button
          className="btn btn-primary w-full mt-6 text-white"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfileModal;
