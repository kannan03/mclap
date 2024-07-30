"use client"
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import img1 from "public/Mclaplogo.svg"
import img from "public/logomc1.svg"
import { useForm } from 'react-hook-form';
import { useTheme } from "next-themes"
import { SiteFooter } from "@/components/site-footer";

export default function ForgotPasswordPage() {
  const[email, setEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {theme} = useTheme()
  const[isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const payload = { email }
      console.log(payload)
      //const response = await axiosInstance.post(baseURL + "/v1/auth/forgot-password", { email });
      const response = await fetch(baseURL + "/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "en-US"
        },
        credentials: 'include',
      })
      if (response.status === 200){
        toast({
          variant: 'default',
          description: 'Password reset email sent successfully',
        });
        // console.log('Password reset email sent successfully');
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to sent password reset email. Please try again.',
        })
        // console.error('Failed to sent password reset email. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally { 
      setIsLoading(false);
    }
  };
  return (
    <div className="">
    <div className="container flex h-[calc(100vh-1.75rem)] overflow-y-hidden w-screen flex-col items-center justify-center">
       <Link href="/login"
          className={cn(buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-4")}>
            <>
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
        </Link>
  
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] pb-[49px]">
        <div className="flex flex-col space-y-2 text-center">
        {theme === "dark" ? (
            <Image
              className="h-2/3 mx-[64px] w-[200px] object-cover object-center"
              src={img1}
              alt="Signup Image"
            />
            ) : (
              <Image
              className="h-2/3 mx-[64px] w-[200px] object-cover object-center"
              src={img}
              alt="Signup Image"
            />
            )}
          <h2 className="text-md font-semibold ">Forgot Password</h2>
          <p className="text-sm text-muted-foreground pb-1">
            Enter your email to reset
          </p>
        </div>
        <form onSubmit={handleSubmit(handleResetPassword)}>
        <div className="flex flex-col space-y-2">
          <div className="grid gap-4">
            <div className="relative">
            <Input
              id="email"
              placeholder="Enter Your Email"
              type="email"
              autoComplete="none" 
              autoCorrect="off"
              value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="bg-white text-slate-600"
             //  {...register('email', { required: true })}
              />
              {errors.email && (
                  <span className="px-1 text-xs text-red-500">Email is required</span>
                )}
          </div>

          <button type="submit"
            className={cn(buttonVariants())}
            // onClick={handleResetPassword}
            disabled={isLoading}
          >
             {isLoading ? 'Sending...' : 'Reset Password'}
          </button>
          </div>
        </div>
        </form>
      </div> 
    </div>
    <SiteFooter className="border-t" />
    </div>
  );
}