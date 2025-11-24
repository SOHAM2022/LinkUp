import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
  });

  // Handle 401 errors properly - user is not authenticated
  // Don't treat loading states as unauthenticated
  const is401Error = authUser.error?.response?.status === 401;
  const user = (authUser.isError && is401Error) ? null : authUser.data?.user;
  
  return {
    isLoading: authUser.isLoading && !is401Error,
    authUser: user
  };
};

export default useAuthUser;
