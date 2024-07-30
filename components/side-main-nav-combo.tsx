"use client"

import * as React from "react"
import Link from "next/link"

import { SidebarNavItem } from "types"
import { dashboardConfig } from "@/config/dashboard"

import { Icons } from "./icons"
import { MainNav } from "./main-nav"
import { DashboardNavMini } from "./min-nav"
import { DashboardNav } from "./nav"

interface DashboardNav1Props {
  items: SidebarNavItem[]
  user: any
}
export function DashboardNavCombo({ items, user }: DashboardNav1Props) {
  const [isHovered, setIsHovered] = React.useState(false)
  const handleHover = () => {
    setIsHovered(true)
  }

  const handleHoverOut = () => {
    setIsHovered(false)
  }
  const currentUserRoles = user?.roles
  return (
    <div>
      <div
        className="bg-slate-200 dark:bg-slate-700"
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverOut}
      >
        <div>
          {isHovered ? (
            <div className="items-center pl-[1.15rem] pr-10">
              <Link
                href={
                  currentUserRoles && currentUserRoles.includes("DIRECTOR")
                    ? "/user"
                    : "/defendants"
                }
                className="flex items-center space-x-2"
              >
                <Icons.pbs className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="ml-[0.690rem] items-center">
              <Link
                href={
                  currentUserRoles && currentUserRoles.includes("DIRECTOR")
                    ? "/user"
                    : "/defendants"
                }
                className="flex items-center space-x-2"
              >
                <Icons.pblogo className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
        <div className="thin-scrollbar overflow-y-hidden bg-slate-200 hover:overflow-y-auto dark:bg-slate-700 sm:h-[30dvh] md:h-[65dvh]">
          {isHovered ? (
            <DashboardNav items={items} user={user} />
          ) : (
            <DashboardNavMini items={items} user={user} />
          )}
        </div>
      </div>

    </div>
  )
}
