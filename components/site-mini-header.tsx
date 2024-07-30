"use client";
import Link from "next/link"
import * as React from "react"
import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Settings } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation"
import intronLogo from "../public/White.svg"
import Image from "next/image";
import img from ".././public/pb-with-icon.png"

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "./ui/input";
import { SidebarNavItem } from "types"
import DefendantSearchDialog from "./utils/defendant-search-dialog";
import MiniSidebar from "./sidenavbar/mini-sidebar";
interface SidebarProps {
    className?: string;
    items: SidebarNavItem[];
    user?: any;
}
export default function Miniheader(
    { items, user }: any
) {
    const [isTheme, setIsTheme] = React.useState(false)
    const path = usePathname();
    let pageTitle = items?.find((ele: any) => ele?.href == path)
    return (
        // <header className="sticky top-0 z-40 w-auto xl:w-full px-2 pt-2">
        <header className="px-2">
            <div className="flex justify-between">
                <div className="md:hidden">
                    <MiniSidebar
                        className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
                        items={items}
                        user={user}
                    /></div>
                <div className="ml-8 flex items-end py-0">
                    {!pageTitle && path != '/profile' && (
                        <Link
                            href="/viewdefendant"
                            className="flex h-4 items-center rounded-lg bg-transparent text-xs ">
                            <Icons.chevronLeft className="h-4 pr-2 pl-0" />
                        </Link>
                    )}
                    <Breadcrumb>
                        <BreadcrumbList className="text-xs">
                            {path == '/profile' ? (
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-gary-500 font-normal">
                                        Profile
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            ) : (
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/"
                                        className="font-normal text-black text-xs dark:text-white">
                                        {pageTitle?.header.charAt(0).toUpperCase() + pageTitle?.header.slice(1).toLowerCase() || 'Home'}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                            )}
                            {path != '/profile' && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="text-gary-500 font-normal">
                                            {pageTitle?.title || 'View Defendant'}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className=" relative ml-auto mr-6 h-4 w-4 mt-2">
                    <ThemeToggle isOpen={isTheme} />
                </div>
                <DefendantSearchDialog />
                {/* <div className="relative mb-2">
                    <Input className="bg-white-400 pl-7 text-xs" placeholder="Search" />
                    <Icons.search className="absolute top-0 ml-2.5  h-8 w-4 text-muted-foreground" />
                </div> */}
            </div>
        </header>
    )
}
