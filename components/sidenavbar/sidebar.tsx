"use client";
import React, { useState } from "react";
import { SideNavContent } from "@/components/sidenavbar/sidenavContent";

import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { Icons } from "@/components/icons";
import { SidebarNavItem } from "types"

interface SidebarProps {
  className?: string;
  items: SidebarNavItem[];
  user?: any;
}

export default function Sidebar({ className, items, user }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden h-screen md:block`,
        status && "duration-500",
        isOpen ? "w-[195px]" : "w-[53px]",
        className
      )}
    >
      <Icons.sidebar className={cn(
          "absolute -right-9 p-1 top-5 cursor-pointer bg-transparent text-3xl text-gray-500 ",
          !isOpen && "rotate-180"
        )}
        onClick={handleToggle}/>

      <div className="h-full space-y-4">
        <div className="pl-2">
          <div className="space-y-1">
            <SideNavContent
              className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              items={items}
              user={user}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
