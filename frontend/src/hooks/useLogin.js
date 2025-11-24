import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log("Login successful:", data);
      
      // Set the user data directly in the cache to prevent flickering
      queryClient.setQueryData(["authUser"], data);
      
      // Then invalidate and refetch to ensure fresh data
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      // Small delay to ensure state updates properly
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["authUser"] });
      }, 100);
    },
    onError: (error) => {
      console.log("Login failed:", error);
    }
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
