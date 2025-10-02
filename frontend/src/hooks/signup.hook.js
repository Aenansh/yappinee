import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpFunction } from "../lib/api";

export const useSignUpUser = () => {
  const queryClient = useQueryClient();
  const signedUpUser = useMutation({
    mutationFn: signUpFunction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return {
    mutate: signedUpUser?.mutate,
    isPending: signedUpUser?.isPending,
    error: signedUpUser?.error,
  };
};
