import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { get, post, put, del, patch } from "@/lib/api.js";

//  Follow/Unfollow Hook
export const useFollow = () => {
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: followUnFollow, isPending } = useMutation({
    mutationFn: (userId) => post(`/users/${userId}/follow`),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile", authUser?.username] }),
        queryClient.invalidateQueries({ queryKey: ["posts", authUser?.username] }),
      ]);
    },
  });

  return [followUnFollow, isPending];
};

// Generic GET Hook 
export const useGetData = ({ qKey, url }) => {
  const query = useQuery({
    queryKey: qKey,
    queryFn: () => get(url),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};

// Generic Mutation Hook: POST / PUT / DELETE
export const usePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ method = "post", url, data = null }) => {
      const fn = { post, put, delete: del }[method.toLowerCase()] || post;
      return await fn(url, data);
    },
    onSuccess: (result, variables) => {
      const qKey = variables.qKey || [];
      if (qKey.length > 0) queryClient.invalidateQueries({ queryKey: qKey });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      variables.callbackFn?.(result);
    },
  });

  return { mutate, isPending };
};

export const usePatch = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ url, data = null }) => {
      return await patch(url, data);
    },
    onSuccess: (result, variables) => {
      const qKey = variables.qKey || [];
      if (qKey.length > 0) queryClient.invalidateQueries({ queryKey: qKey });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      variables.callbackFn?.(result);
    },
  });

  return { mutate, isPending };
};


//  Paginated Fetcher (e.g., for "All Suggested Users")
export const getUsersPage = async ({ url }) => {
  try {
    const result = await get(url);
    return result;
  } catch (error) {
    return null;
  }
};
