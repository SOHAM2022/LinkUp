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
  });

  // Add debugging logs
  console.log("Auth Query State:", {
    isLoading: authUser.isLoading,
    isFetching: authUser.isFetching,
    data: authUser.data,
    error: authUser.error,
    isError: authUser.isError,
    status: authUser.status,
    user: authUser.data?.user
  });

  // Only return null when we're certain the user is not authenticated
  // Don't treat loading states as unauthenticated
  const user = authUser.isError ? null : authUser.data?.user;
  
  return {
    isLoading: authUser.isLoading,
    authUser: user
  };
};

export default useAuthUser;
