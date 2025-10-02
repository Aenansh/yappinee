import { axiosInstance } from "./axios.js";

export const signUpFunction = async (signUpData) => {
  const res = await axiosInstance.post("/auth/sign-up", signUpData);
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser api", error);
    return null;
  }
};

export const signInFunction = async (signInData) => {
  const res = await axiosInstance.post("/auth/sign-in", signInData);
  return res.data;
};

export const onboardUser = async (formData) => {
  const res = await axiosInstance.post("/auth/onboarding", formData);
  return res.data;
};

export const signOutUser = async () => {
  const res = await axiosInstance.post("/auth/sign-out");
  return res.data;
};
