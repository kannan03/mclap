import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { SiteFooter } from "@/components/site-footer"
import { UserAuthForm } from "@/components/user-auth-form"



export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="">
      <div className="container flex h-[calc(100vh-1.75rem)] w-screen	 flex-col items-center justify-center overflow-y-hidden ">
        {/* <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link> */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-1 sm:w-[350px]">

          <UserAuthForm isLoginPage={true} />
          <p className="px-8 py-2 text-center text-sm text-muted-foreground">
          <Link
            href="/forgot"
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot Password?
          </Link>
        </p>
        </div>
      </div>
      <SiteFooter className="border-t" />
    </div>
  )
}
