"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "types"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"

interface DashboardNavProps {
  items: SidebarNavItem[]
  user: any
}

export function DashboardNavMini({ items, user }: DashboardNavProps) {
  const path = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)
  if (!items?.length) {
    return null
  }
  const currentUserRoles = user?.roles
  return (
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
                      "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-white hover:text-accent-foreground dark:hover:bg-black",
                      path?.includes(item?.linkPrefix)
                        ? "bg-white dark:bg-black font-semibold  text-green-600"
                        : "transparent"
                    )}
                  >
                    {/* <AccordionTrigger className="py-2"> */}
                    <Icon className="h-4 w-4" />
                    {/* </AccordionTrigger> */}
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
                            "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-white hover:text-accent-foreground dark:hover:bg-black",
                            path === _subMenuItem.href
                              ? "bg-white dark:bg-black font-semibold  text-green-600"
                              : "transparent"
                          )}
                        >
                          {/* <Icon className="mr-2 h-4 w-4" /> */}
                          <span>{"- "}</span>
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
                        "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-white hover:text-accent-foreground dark:hover:bg-black",
                        path === item.href
                          ? "bg-white dark:bg-black font-semibold  text-green-600"
                          : "transparent",
                        item.disabled && "cursor-not-allowed opacity-80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{}</span>
                    </span>
                  </Link>
              </div>
            )
          )
        })}
      </nav>
      <div className="absolute bottom-0 mb-2 mt-[370px]">
        <div className=" mr-5 h-5 w-5 my-7">
          <ThemeToggle isMainNav={false} />
        </div>
        <div className="mb-2 ml-[0.575rem] mt-6 h-5 w-5">
          <UserAccountNav
            user={{
              name: user?.name,
              image: user?.image,
              email: user?.email,
            }}
            isMainNav={false}
          />
        </div>
      </div>
    </div>
  )
}
