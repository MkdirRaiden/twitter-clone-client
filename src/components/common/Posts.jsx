import Post from "@/components/common/Post";
import PostSkeleton from "@/components/skeletons/PostSkeleton";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth.js";
import api from "@/lib/api.js"; // Pre-configured Axios instance

const Posts = ({ feedType, user: overrideUser }) => {
  const { authUser } = useAuth();
  const user = overrideUser || authUser;

  const [savedPosts, setSavedPosts] = useState(
    localStorage.getItem("saved")
      ? JSON.parse(localStorage.getItem("saved"))
      : []
  );

  const getPostEndPoint = (page) => {
    if (!user?.username) return "";

    switch (feedType) {
      case "forYou":
        return `/posts/feed/suggestions?page=${page}`;
      case "following":
        return `/posts/feed/following?page=${page}`;
      case "posts":
        return `/users/profile/${user.username}/posts?page=${page}`;
      case "likes":
        return `/users/profile/${user.username}/likes?page=${page}`;
      default:
        return `/posts/feed/suggestions?page=${page}`;
    }
  };

  const getPosts = async ({ pageParam = 1 }) => {
    try {
      const res = await api.get(getPostEndPoint(pageParam));

      const posts = Array.isArray(res.data?.data?.posts)
        ? res.data.data.posts
        : [];

      return {
        posts,
        page: res.data?.data?.page || pageParam,
        totalPages: res.data?.data?.totalPages || 1,
      };
    } catch (error) {
      console.error("Post fetch error:", error);
      return {
        posts: [],
        page: pageParam,
        totalPages: 1,
      };
    }
  };

  const { data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ["posts", user?.username, feedType],
      queryFn: getPosts,
      getNextPageParam: (lastPage) => {
        if (!lastPage || !lastPage.page || !lastPage.totalPages)
          return undefined;
        return lastPage.page < lastPage.totalPages
          ? lastPage.page + 1
          : undefined;
      },
      enabled: !!user?.username, // wait until username is defined
    });

  const posts =
    data?.pages?.reduce((acc, page) => {
      const safePosts = Array.isArray(page.posts) ? page.posts : [];
      return [...acc, ...safePosts];
    }, []) || [];

  useEffect(() => {
    if (user?.username) refetch();
  }, [feedType, user?.username, refetch]);

  if (!user?.username) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading user data...
      </div>
    );
  }

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {!isLoading && !isRefetching && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}

      {!isLoading && !isRefetching && posts.length > 0 && (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="text-center py-4 text-2xl">
              <LoadingSpinner />
            </div>
          }
        >
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              username={user.username}
              feedType={feedType} // required for proper cache invalidation
              savedPosts={savedPosts}
              setSavedPosts={setSavedPosts}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  );
};

export default Posts;
