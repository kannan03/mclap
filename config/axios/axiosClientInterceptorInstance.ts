import axios, {AxiosHeaders } from "axios"
import { getSession  } from "next-auth/react"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { signOut, useSession } from 'next-auth/react';

const axiosClientInterceptorInstance = axios.create({
  // baseURL: "http://127.0.0.1:8055", // Replace with your API base URL
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true
})

axiosClientInterceptorInstance.interceptors.request.use(async (request) => {
  const session = await getSession();

  if (session && session.accessToken) {
    request.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return request;
});

axiosClientInterceptorInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error?.response?.status == 403 || error?.response?.status == 401)
    {
      handleLogOut()
      // signOut({redirect: false, callbackUrl: `${window.location.origin}/login`})
      // window.location.href = "/login"
    }
    return error?.response;
  },
);

async function handleLogOut() {
  await signOut({redirect: false, callbackUrl: `${window.location.origin}/login`})
  window.location.href= "/login"
  setTimeout(() => { window.location.reload(); }, 1000);
}


export default axiosClientInterceptorInstance
