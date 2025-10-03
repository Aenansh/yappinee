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

export const getAllFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const getRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};

export const getOutGoingFriendRequests = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data;
};

export const sendFriendRequest = async (userId) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get("/users/friend-requests");
  return res.data;
};

export const acceptFriendRequests = async (reqId) => {
  const res = await axiosInstance.put(`/users/friend-request/${reqId}/accept`);
  return res.data;
};

export const rejectFriendRequests = async (reqId) => {
  const res = await axiosInstance.put(`/users/friend-request/${reqId}/reject`);
  return res.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chats/token");
  return res.data;
};
