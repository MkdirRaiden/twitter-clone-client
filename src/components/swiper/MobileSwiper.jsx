import { register } from "swiper/element/bundle";
register();

import { useFollow, useGetData } from "@/hooks/customHooks.js";
import { Link } from "react-router-dom";
import FollowButton from "@/components/common/FollowButton";
import { useEffect, useRef } from "react";

const MobileSwiper = () => {
  const swiperRef = useRef(null);

  const { data, isLoading } = useGetData({
    qKey: ["peopleYouMayKnow"],
    url: "/users/suggestions/people-you-may-know",
  });

  const usersFollowingMe = Array.isArray(data?.users) ? data.users : [];

  useEffect(() => {
    const swiperContainer = swiperRef.current;
    if (
      !swiperContainer ||
      !usersFollowingMe.length ||
      swiperContainer.initialized
    )
      return;

    const params = {
      navigation: true,
      pagination: true,
      slidesPerView: 2,
      speed: 750,
      autoplay: {
        delay: 1000,
      },
      grabCursor: true,
      loop: true,
      injectStyles: [
        `
          .swiper-button-next,
          .swiper-button-prev {
            background-color: white;
            opacity: .75;
            width: 20px;
            height: 20px;
            padding: .75rem;
            border-radius: 100%;
            color: rgb(29, 155, 240);
          }
          .swiper-pagination-bullet {
            position: relative;
            bottom: -10px;
            width: 12px;
            height: 12px;
            background-color: rgb(29, 155, 240);
          }
          .swiper-pagination-bullet-active {
            border-radius: 4px;
            width: 16px;
          }
        `,
      ],
    };

    Object.assign(swiperContainer, params);
    requestAnimationFrame(() => {
      swiperContainer.initialize();
    });
  }, [usersFollowingMe]);

  const [followUnfollow, isPending] = useFollow();

  return (
    <>
      <swiper-container
        ref={swiperRef}
        class={`w-screen ${usersFollowingMe.length === 0 ? "hidden" : ""}`}
        init="false"
      >
        {usersFollowingMe.map((user) => (
          <swiper-slide key={user._id}>
            <Link to={`/profile/${user.username}`}>
              <div className="card py-6 w-48 flex justify-center gap-4 items-center shadow-md rounded-xs">
                <figure className="w-16 h-16 overflow-hidden rounded-full border">
                  <img
                    src={user.profileImg || "/avatar-placeholder.png"}
                    alt={`${user.fullName}'s profile`}
                  />
                </figure>
                <div className="card-body py-0">
                  <h3 className="card-title">
                    {user.fullName.length > 8
                      ? user.fullName.slice(0, 8) + "..."
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
            </Link>
          </swiper-slide>
        ))}
      </swiper-container>

      {!isLoading && usersFollowingMe.length === 0 && (
        <p className="text-sm text-gray-500 text-center mt-2">
          No suggestions available.
        </p>
      )}
    </>
  );
};

export default MobileSwiper;
