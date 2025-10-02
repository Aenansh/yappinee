import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOutUser } from "../lib/api.js";

export const useSignOutUser = () => {
  const queryClient = useQueryClient();
  const signedOutUser = useMutation({
    mutationFn: signOutUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { mutate: signedOutUser?.mutate };
};
