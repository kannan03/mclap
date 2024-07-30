"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "./theme-toggle"
import { UserAvatar } from "./user-avatar"
import { UserAccountNav } from "./user-account-nav"
import img from "../../../public/pb-with-icon.png"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface MainNavProps {
  items?: SidebarNavItem[]
  user: any
}
export function MainNav({ items, user }: MainNavProps) {
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
    <div className="flex gap-1 md:gap-10 ml-2 ">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger aria-controls="radix-:Rldiqcq:" asChild>
            <Icons.alignjustify className="h-6 w-5" />
          </SheetTrigger>
          <SheetContent side={"left"} className="w-3/4">
            <SheetHeader className="my-5">
              <SheetTitle>
              <Link href={currentUserRoles && currentUserRoles.includes("DIRECTOR")  ? "/user" : "/defendants"} className="flex items-center space-x-2 ml-3">
                  <Icons.logo className="h-6 w-6" />
                </Link>
                <div className="relative flex items-center pt-5">
                  <div className="grow border-t border-gray-200"></div>
                </div>
              </SheetTitle>
              <SheetDescription>
                <ScrollArea className="h-[calc(100vh-94px)]">
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
                                "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
                                path?.includes(item?.linkPrefix)
                                  ? "bg-accent"
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
                              let hasAccessForSM = _subMenuItem.access?.filter(
                                (role) => currentUserRoles.includes(role)
                              )
                              if (
                                !hasAccessForSM ||
                                hasAccessForSM?.length <= 0
                              ) {
                                return
                              }
                              return (
                                <div className="text-left">
                                  <SheetClose asChild>
                                    <Link
                                      href={_subMenuItem.href}
                                      key={_subMenuItem.title}
                                      className="w-full"
                                    >
                                      <span
                                        className={cn(
                                          "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
                                          path === _subMenuItem.href
                                            ? "bg-accent"
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
                                  </SheetClose>
                                </div>
                              )
                            })}

                            <hr />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      item.href && item.href != "" && (
                        <div key={index} className="text-left">
                          <SheetClose asChild>
                            <Link
                              key={index}
                              href={item.disabled ? "/" : item.href}
                              className="w-full"
                            >
                              <span
                                className={cn(
                                  "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground",
                                  path === item.href
                                    ? "bg-accent"
                                    : "transparent",
                                  item.disabled &&
                                    "cursor-not-allowed opacity-80"
                                )}
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                              </span>
                            </Link>
                          </SheetClose>
                        </div>
                      )
                    )
                  })}
                 <div className="absolute bottom-0 mb-2 mt-[370px] w-full">
        <div className="my-2 flex w-[230px] flex-row gap-y-2">
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
                </ScrollArea>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <Link href={currentUserRoles && currentUserRoles.includes("DIRECTOR")  ? "/user" : "/defendants"} className="flex items-center space-x-2">
        {/* <Icons.logo className="h-6 w-6" /> */}
      </Link>

      {/* {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-muted-foreground",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null} */}
    </div>
  )
}
