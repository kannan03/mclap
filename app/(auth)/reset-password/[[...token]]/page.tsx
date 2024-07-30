"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import img1 from "public/Mclaplogo.svg"
import img from "public/logomc1.svg"
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from "next-themes"
import { SiteFooter } from '@/components/site-footer';
import { redirect, useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  //const router = useRouter();
  // const { token } = useParams() as { token: string };
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const {theme} = useTheme()
  const searchParams = useSearchParams();

  const token = searchParams?.get('token')
  // console.log(token,"@222")
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const { password, confirmPassword } = data;
      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          description: 'Passwords do not match',
        });
        return;
      }
      if (password.length < 8 || password.length > 20) {
        toast({
          variant: 'destructive',
          description: 'Password must be between 8 and 20 characters',
        });
        return;
      }
      const payload = {
        token,
        password
      };
      // console.log(`${params.token}`);
      const response = await fetch(`${baseURL}/v1/auth/reset-password?token=${token}`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.status === 200) {
        toast({
          variant: 'default',
          description: 'Password reset successfully',
        });
         window.location.href = "/login";
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to reset the password. Please try again later',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return  (
    <div>
    <div className="container flex h-[calc(100vh-1.75rem)] overflow-y-hidden w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] pb-[1px]">
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
          <h2 className="text-md font-semibold">Reset Password</h2>
          <p className="text-sm text-muted-foreground pb-1">Enter your new password</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2">
            <div className="grid gap-4">
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter Your New Password"
                  type="password"
                  minLength={8}
                  maxLength={20}
                  {...register('password', { required: true })}
                  className="bg-white text-slate-600"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">Password is required</span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="Confirm Your New Password"
                  type="password"
                  minLength={8}
                  maxLength={20}
                  {...register('confirmPassword', { required: true })}
                  className="bg-white text-slate-600"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">Confirm Password is required</span>
                )}
              </div>
            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading}
            >
              {isLoading ? 'Setting New Password...' : 'Set New Password'}
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <SiteFooter className="border-t" />
    </div>
  )
}









