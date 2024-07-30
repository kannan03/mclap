import axios, {AxiosHeaders } from "axios"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const axiosInterceptorInstance = axios.create({
  // baseURL: "http://127.0.0.1:8055", // Replace with your API base URL
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
})

axiosInterceptorInstance.interceptors.request.use(async (request) => {
  const serverSession = await getServerSession(authOptions);
  if (serverSession) {
    request.headers.Authorization = `Bearer ${serverSession.accessToken}`;
  }
  return request;
});

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(`error`, error);
  },
);


export default axiosInterceptorInstance
