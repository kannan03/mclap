import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { Toaster } from "@/components/ui/toaster"
import { Icons } from "@/components/icons"
import { SkeletonCard } from "@/components/loadingSkeletonCard"
import { MainNav } from "@/components/main-nav"
import { DashboardNavMini } from "@/components/min-nav"
import { DashboardNav } from "@/components/nav"
import { DashboardNavCombo } from "@/components/side-main-nav-combo"
import { SiteFooter } from "@/components/site-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"
import  Sidebar  from "@/components/sidenavbar/sidebar"

import img from "../../public/pb-with-icon.png"
import { SiteHeader } from "@/components/site-header"
import Miniheader from "@/components/site-mini-header"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
    return null
  }
  const currentUserRoles = user?.roles

  return (
    // <div className="flex min-h-screen flex-col space-y-4">
    //   <div
    //     className="grid flex-1 gap-4  md:grid-cols-[42px_1fr]"
    //   >
    //     <aside className="hidden w-[200px] flex-col md:flex ">
    //       <div className=" items-center mt-6 ml-[1rem]">
    //         <MainNav items={dashboardConfig.sidebarNav} user={user} />
    //       </div>
    //       <div className="pt-8">
    //         <DashboardNav1Mini items={dashboardConfig.sidebarNav} user={user} />
    //       </div>
    //     </aside>
    //     <main className="flex w-full flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 ">
    //       <Suspense fallback={<SkeletonCard />}>{children}</Suspense>
    //       <Toaster />
    //     </main>
    //   </div>
    //   <SiteFooter className="border-t" />
    // </div>

    // <div>
    //   <div className="h-[calc(100vh-74px) flex">
    //     <div className="mt-2 items-center ">
    //       <MainNav items={dashboardConfig.sidebarNav} user={user} />
    //     </div>
    //     <aside className=" fixed top-0 z-50 hidden h-screen bg-slate-200 px-1 shadow-xl dark:bg-slate-700 md:block">
    //       <DashboardNavCombo items={dashboardConfig.sidebarNav} user={user} />
    //       {/* <div className="absolute bottom-0 mb-2 mt-[370px]">
    //         <div className=" mr-5 h-5 w-5 ">
    //           <ThemeToggle />
    //         </div>
    //         <div className="mb-2 ml-[0.575rem] mt-6 h-5 w-5">
    //           <UserAccountNav
    //             user={{
    //               name: user.name,
    //               image: user.image,
    //               email: user.email,
    //             }}
    //           />
    //         </div>
    //       </div> */}
    //     </aside>
    //     <div className="hidden h-screen w-10 whitespace-normal md:block"> </div>

    //     <main className=" flex-1 flex-col overflow-hidden">
    //       <Suspense fallback={<SkeletonCard />}>{children}</Suspense>
    //       <Toaster />
    //     </main>
    //   </div>
    //   <SiteFooter className="border-t" />
    // </div>
    <div>
       <div className="flex h-screen border-collapse overflow-hidden">
                <Sidebar items={dashboardConfig.sidebarNav}  user={user}/>         
                <main className="flex-1 overflow-hidden">
                    <div className="h-[calc(100vh-24px)]">
                    <Miniheader items={dashboardConfig.sidebarNav} user={user} />
                      {children}
                    </div>
                    <SiteFooter className="" />
                </main>
            </div>
    </div>
  )
}
