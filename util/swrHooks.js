import useSWR from "swr";

export const { fetcher } = (...args) =>
  fetch(...args).then((res) => res.json());

export function useAllPosts() {
  const { data, error } = useSWR("/api/posts", fetcher);
  return {
    posts: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useUserProfile(profileId) {
  if (profileId) {
    const { data, error } = useSWR(`/api/profiles/${profileId}`, fetcher);
    if (error) return { profile: null };
    return {
      profile: data,
      loadingProfile: !error && !data,
      errorProfile: error,
    };
  } else
    return {
      profile: false,
      loadingProfile: false,
      errorProfile: "profile ID not found!",
    };
}
