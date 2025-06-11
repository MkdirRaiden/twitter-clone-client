import { register } from "swiper/element/bundle";
register();

import { useFollow, useGetData } from "@/hooks/customHooks.js";
import { Link } from "react-router-dom";
import FollowButton from "@/components/common/FollowButton";
import { useEffect, useRef } from "react";
import RightPanelUserCardSkeleton from "@/components/skeletons/RightPanelUserCardSkeleton";

const RightPanelSwiper = () => {
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
      pagination: {
        clickable: true,
      },
      slidesPerView: 3,
      speed: 750,
      autoplay: {
        delay: 1000,
      },
      injectStyles: [
        `
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background-color: rgb(29, 155, 240);
          }
          .swiper-pagination-bullet-active {
            border-radius: 4px;
            height: 16px;
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
    <div className="h-screen">
      <p className="py-2 font-bold text-slate-500 text-lg">
        People You May Know
      </p>

      {isLoading && (
        <>
          <RightPanelUserCardSkeleton />
          <RightPanelUserCardSkeleton />
          <RightPanelUserCardSkeleton />
        </>
      )}

      <swiper-container
        ref={swiperRef}
        class={`h-[92%] w-56 ${usersFollowingMe.length === 0 ? "hidden" : ""}`}
        direction="vertical"
        init="false"
      >
        {usersFollowingMe.map((user) => (
          <swiper-slide key={user._id} class="w-fit">
            <Link to={`/profile/${user.username}`}>
              <div className="card py-6 w-48 flex justify-center gap-4 items-center shadow-md rounded-xs">
                <figure className="w-16 h-16 overflow-hidden rounded-full border">
                  <img
                    src={user.profileImg || "/avatar-placeholder.png"}
                    alt={`${user.fullName} image`}
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
        <p className="text-sm text-gray-500 mt-2">No suggestions right now.</p>
      )}
    </div>
  );
};

export default RightPanelSwiper;
