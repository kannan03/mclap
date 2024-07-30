"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"
import { UserAvatar } from "@/components/user-avatar"

interface DashboardNavProps {
  items: SidebarNavItem[]
  user: any
}

export function DashboardNav({ items, user }: DashboardNavProps) {
  const path = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  async function handleClick() {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  if (!items?.length) {
    return null
  }
  const currentUserRoles = user?.roles
  return (
    <div className="">
      <div>
        <nav className="grid items-start gap-2">
          {items.map((item, index) => {
            let hasAccess = item.access?.filter((role) =>
              currentUserRoles.includes(role)
            )
            if (!hasAccess || hasAccess?.length <= 0) {
              return
            }
            // const hasAccess = ["ADMIN"]
            const Icon = Icons[item.icon || "arrowRight"]
            return item?.subMenu && item?.linkPrefix ? (
              <Accordion
                type="single"
                collapsible
                key={index}
                aria-controls="radix-:Rldiqcq:"
              >
                <AccordionItem value={item.title} className="border-0">
                  <Link href="">
                    <span
                      className={cn(
                        "group flex items-center rounded-md mx-3 px-3 py-2 text-xs font-medium hover:bg-white  dark:hover:bg-black",
                        path?.includes(item?.linkPrefix)
                          ? "bg-white dark:bg-black font-semibold  text-green-600"
                          : "transparent"
                      )}
                    >
                      <AccordionTrigger className="py-0">
                        <Icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </AccordionTrigger>
                    </span>
                  </Link>
                  <AccordionContent>
                    {item?.subMenu?.map((_subMenuItem, _subIndex) => {
                      let hasAccessForSM = _subMenuItem.access?.filter((role) =>
                        currentUserRoles.includes(role)
                      )
                      if (!hasAccessForSM || hasAccessForSM?.length <= 0) {
                        return
                      }
                      return (
                        <Link href={_subMenuItem.href} key={_subMenuItem.title}>
                          <span
                            className={cn(
                              "group flex items-center rounded-md mx-3 px-3 py-2 text-xs font-medium hover:bg-white  dark:hover:bg-black",
                              path === _subMenuItem.href
                                ? "bg-white dark:bg-black font-semibold  text-green-600"
                                : "transparent"
                            )}
                          >
                            {/* <Icon className="mr-2 h-4 w-4" /> */}
                            <span>
                              {"- "}
                              {_subMenuItem.title}
                            </span>
                          </span>
                        </Link>
                      )
                    })}

                    <hr />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              item.href && item.href != "" && (
                <div key={index}>
                    <Link key={index} href={item.disabled ? "/" : item.href}>
                      <span
                        className={cn(
                          "group flex items-center rounded-md mx-3 px-3 py-2 text-xs font-medium hover:bg-white  dark:hover:bg-black",
                          path === item.href
                            ? "bg-white dark:bg-black font-semibold  text-green-600"
                            : "transparent",
                          item.disabled && "cursor-not-allowed opacity-80"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                </div>
              )
            )
          })}
        </nav>
      </div>

      {/* <div className="grid grid-flow-row auto-rows-max absolute bottom-0 mb-2 mr-2 gap-y-2 w-full">

      </div> */}
      <div className="absolute bottom-0 mb-2 mt-[370px] w-full">
        <div className="my-2 flex w-[calc(100%-10px)] flex-row gap-y-2">
          <div className="basis-1/2">
            <ThemeToggle isMainNav={true} />
          </div>
          <div className="basis-1/2">
            <Button onClick={handleClick} className="w-full">
              <span className="mr-2">Sign Out</span>
              <Icons.logout className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="">
          {/* <UserAccountNav
            user={{
              name: user.name,
              image: user.image,
              email: user.email,
            }}
            isMainNav={true}
          /> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/profile">
                  <Button
                    className="w-[calc(100%-10px)] whitespace-nowrap border border-slate-500 px-2 hover:bg-white hover:text-current dark:hover:bg-black dark:hover:text-white"
                    variant={"outline"}
                  >
                    <span>Profile</span>
                    <UserAvatar
                      user={{
                        name: user.name || null,
                        image: user.image || null,
                      }}
                      className={`ml-2 h-5 w-5`}
                    />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-zinc-950 dark:bg-zinc-50"
              >
                <p className="text-xs text-slate-50 dark:text-slate-950">
                  {user.email}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
