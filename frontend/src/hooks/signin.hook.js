import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInFunction } from "../lib/api";

export const useSignInUser = () => {
  const queryClient = useQueryClient();
  const signedInUser = useMutation({
    mutationFn: signInFunction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return {
    mutate: signedInUser?.mutate,
    isPending: signedInUser?.isPending,
    error: signedInUser?.error,
  };
};
