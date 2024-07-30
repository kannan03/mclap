"use client"

import * as React from "react"
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCsrfToken, getSession, signIn, useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import Image from "next/image"
import img1 from "public/Mclaplogo.svg"
import img from "public/logomc1.svg"
import { useTheme } from "next-themes"


// import useSWR from "swr";
// import axiosInstance from "@/config/axios/axiosInterceptorInstance";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoginPage: boolean
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm(
  { className, isLoginPage, ...props }: UserAuthFormProps,
  { csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const { toast } = useToast()
  const {theme} = useTheme()

  if (session?.user) {
    let roleType: any = session?.user?.roles

    // role based on landing page
    if (roleType.includes("DIRECTOR")) {
      redirect("/user")
    }
    else {
      redirect("/viewdefendant")
    }
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    if (isLoginPage) {
      const signInResult = await signIn("user-login-kuykendall", {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/defendants",
      })
      setIsLoading(false)

      if (signInResult?.status === 200) {
        try {
          const session: any = await getSession()

          let roleType: any = session.user.roles
          // role based on landing page
           if (roleType.includes("DIRECTOR")) {
            window.location.href = "/user"
          }
          else {
            window.location.href = "/viewdefendant"
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        const errorMessage = typeof signInResult?.error === 'string' ? signInResult.error : 'Unknown error';
        toast({
          variant: "destructive",
          description:  `${errorMessage}`,
        })
      }
    } else {
      const user_name = data.email.split("@")
      const response = await fetch(baseURL + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: user_name[0].charAt(0).match(/^[^a-zA-Z]+$/)
            ? user_name[0]
            : user_name[0].charAt(0).toUpperCase() + user_name[0].slice(1),
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: searchParams?.get("from") || "/documentation/templates",
        }),
      })

      setIsLoading(false)

      if (!response.ok) {
        toast({
          variant: "destructive",
          description: "Email is already registered!",
        })
      } else {
        toast({
          description: "Registered successfully!",
        })

        router.push("/login")
      }
    }

    // try {
    //   const response = await axiosInstance.get('/users/me'); // Replace with your API endpoint

    //   // Handle the response data here
    //   console.log(response.data);
    // } catch (error) {
    //   // Handle the error here
    //   console.error(error);
    // }

    // return toast({
    //   title: "Check your email",
    //   description: "We sent you a login link. Be sure to check your spam too.",
    // })
  }

  return (
    <div className={cn("grid gap-3", className)} {...props}>
           <div className="flex flex-col text-center">
            {/* <Icons.intronlogo className="mx-auto h-6 w-6" /> */}
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
            <p className="text-sm text-muted-foreground pb-1">
              Enter your credentials to sign in to your account
            </p>
          </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
              className="bg-white text-slate-600"
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {/* {errors.email.message} */}
              </p>
            )}

            <div style={{ height: "1px" }} />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              minLength={8}
              maxLength={20}
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
              className="bg-white text-slate-600	"
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {/* {errors.password.message} */}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={!isValid || isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoginPage ? "Sign In " : "Sign Up"}
          </button>
        </div>
      </form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true)
          signIn("github")
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </button> */}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const session = await getServerSession(context.req, context.res, authOptions);
  // if (session) {
  //   return { redirect: { destination: "/" } };
  // }
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
