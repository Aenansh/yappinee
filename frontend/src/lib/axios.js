import axios from "axios";

export const axiosInstance = new axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
