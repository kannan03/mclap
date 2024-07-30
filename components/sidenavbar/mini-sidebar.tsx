import React from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavItem } from "@/types";
import { SidebarNavItem } from "types";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { useTheme } from "next-themes"

interface SideNavProps {
    items: SidebarNavItem[];
    setOpen?: (open: boolean) => void;
    className?: string;
    user: any;
}

export default function MiniSidebar({
    items,
    setOpen,
    className,
    user,
}: SideNavProps) {
    const path = usePathname();
    const { isOpen } = useSidebar();
    const [openItem, setOpenItem] = React.useState("");
    const [lastOpenItem, setLastOpenItem] = React.useState("");
    const currentUserRoles = user?.roles;
    const { theme } = useTheme();
    const [sideOpen,setSideOpen]=React.useState(false)
    React.useEffect(() => {
        if (isOpen) {
            setOpenItem(lastOpenItem);
        } else {
            setLastOpenItem(openItem);
            setOpenItem("");
        }
    }, [isOpen]);
    const groupedItems = items.reduce((acc: any, item) => {
        if (!acc[item.header]) {
            acc[item.header] = [];
        }
        acc[item.header].push(item);
        return acc;
    }, {});
    return (
        <div>
            <Sheet key={"left"} open={sideOpen} onOpenChange={(e)=>setSideOpen(e)}>
                <SheetTrigger><Icons.menu  className='mt-4'/></SheetTrigger>
                <SheetContent className="w-[200px] sm:w-[200px]" side={"left"}>
                    {/* <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader> */}
                    <nav className="h-full space-y-2">
                        <div className="flex h-screen flex-col">
                            <div className="">
                                {/* Organization Link */}
                                {isOpen ? (
                                    <div className="pl-2 pt-3">
                                        <Link
                                            href={
                                                currentUserRoles && currentUserRoles.includes("DIRECTOR")
                                                    ? "/user"
                                                    : "/defendants"
                                            }
                                            className="flex items-center space-x-2 w-[110px]"
                                        >
                                            {theme === "dark" ? (
                                                <Icons.logoK1 className="h-4 w-4" />
                                            ) : (
                                                <Icons.logoK className="h-4 w-4" />
                                            )}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="pl-2 pt-3 overflow-x-hidden">
                                        <Link
                                            href={
                                                currentUserRoles && currentUserRoles.includes("DIRECTOR")
                                                    ? "/user"
                                                    : "/defendants"
                                            }
                                            className="flex items-center space-x-2 w-[110px]"
                                        >
                                            {theme === "dark" ? (
                                                <Icons.miniLogo1 className="h-4 w-4" />
                                            ) : (
                                                <Icons.miniLogo className="h-4 w-4" />
                                            )}
                                        </Link>
                                    </div>
                                )}
                            </div>
                            <div className="thin-scrollbar w-full overflow-y-auto overflow-x-hidden">
                                {Object.keys(groupedItems).map((header, indexHeader) => (
                                    <div key={indexHeader}>
                                        {isOpen &&
                                            !(header === "ADMIN" && (currentUserRoles?.includes("VIEWER") || currentUserRoles?.includes("COORDINATOR"))) ? (
                                            <div className={header == "HOME" ? "px-3 text-[0.6rem] font-semibold text-gray-400" : "mt-6 px-3 text-[0.6rem] font-semibold text-gray-400"}>
                                                {header}
                                            </div>
                                        ) :
                                            (
                                                (header === "HOME") ? (
                                                    <div className={header == "HOME" ? "px-3 text-[0.6rem] font-semibold text-gray-400 invisible" : "mt-6 px-3 text-[0.6rem] font-semibold text-gray-400 invisible"}>{header}</div>) : (
                                                    <Separator className="my-[1.3rem]" />)
                                            )}
                                        {groupedItems[header]?.map((item: SidebarNavItem, index: number) => {
                                            let hasAccess = item.access?.filter((role) =>
                                                currentUserRoles?.includes(role)
                                            );
                                            if (!hasAccess || hasAccess?.length <= 0) {
                                                return null;
                                            }
                                            const Icon = Icons[item.icon || "arrowRight"];
                                            return (
                                                <div key={index}>
                                                    {item?.subMenu && item?.linkPrefix ? (
                                                        isOpen ? (
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
                                                                                "group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-gray-200 hover:font-semibold hover:text-red-700 ",
                                                                                path?.includes(item?.linkPrefix)
                                                                                    ? "bg-white-100 font-semibold text-red-700 hover:bg-gray-200 "
                                                                                    : "transparent"
                                                                            )}
                                                                        >
                                                                            <AccordionTrigger className="py-0">
                                                                                <Icon className="mr-2 h8" />
                                                                                {item.title}
                                                                            </AccordionTrigger>
                                                                        </span>
                                                                    </Link>
                                                                    <AccordionContent>
                                                                        {item?.subMenu?.map((_subMenuItem, _subIndex) => {
                                                                            let hasAccessForSM = _subMenuItem.access?.filter(
                                                                                (role) => currentUserRoles.includes(role)
                                                                            );
                                                                            if (!hasAccessForSM || hasAccessForSM?.length <= 0) {
                                                                                return null;
                                                                            }
                                                                            return (
                                                                                <Link
                                                                                    href={_subMenuItem.href}
                                                                                    key={_subMenuItem.title}
                                                                                >
                                                                                    <span
                                                                                        className={cn(
                                                                                            "group mx-3 mt-1 flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-gray-200 hover:font-semibold hover:text-red-700 ",
                                                                                            path === _subMenuItem.href
                                                                                                ? "bg-white-100 font-semibold text-red-700 hover:bg-gray-200"
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
                                                                            );
                                                                        })}
                                                                        <hr />
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        ) : (
                                                            <HoverCard>
                                                                <HoverCardTrigger asChild>
                                                                    <Link key={index} href="">
                                                                        <span
                                                                            className={cn(
                                                                                "group flex items-center rounded-md px-3 py-2 text-xs font-medium  hover:bg-gray-200 hover:font-semibold hover:text-red-700 ",
                                                                                path?.includes(item?.linkPrefix)
                                                                                    ? "bg-white-100 font-semibold text-red-700 hover:bg-gray-200 "
                                                                                    : "transparent",
                                                                                item.disabled && "cursor-not-allowed opacity-80"
                                                                            )}
                                                                        >
                                                                            <Icon className="h-4 w-full" />
                                                                            {isOpen && <span className="ml-2"> {item.title}</span>}
                                                                        </span>
                                                                    </Link>
                                                                </HoverCardTrigger>
                                                                {!isOpen && (
                                                                    <HoverCardContent className="left-12 w-fit " side="right">
                                                                        <div className="flex justify-between space-x-4">
                                                                            <div className="space-y-1">
                                                                                <div className="ml-4">{item.title}</div>
                                                                                <hr />
                                                                                {item?.subMenu?.map((_subMenuItem, _subIndex) => {
                                                                                    let hasAccessForSM = _subMenuItem.access?.filter(
                                                                                        (role) => currentUserRoles.includes(role)
                                                                                    );
                                                                                    if (
                                                                                        !hasAccessForSM ||
                                                                                        hasAccessForSM?.length <= 0
                                                                                    ) {
                                                                                        return null;
                                                                                    }
                                                                                    return (
                                                                                        <Link
                                                                                            href={_subMenuItem.href}
                                                                                            key={_subMenuItem.title}
                                                                                        >
                                                                                            <span
                                                                                                className={cn(
                                                                                                    "group mt-1 flex items-center rounded-md p-2 pl-4 text-xs font-medium hover:bg-gray-200 hover:font-semibold hover:text-red-700 ",
                                                                                                    path === _subMenuItem.href
                                                                                                        ? "bg-white-100 font-semibold text-red-700 hover:bg-gray-200"
                                                                                                        : "transparent"
                                                                                                )}
                                                                                            >
                                                                                                <span>{_subMenuItem.title}</span>
                                                                                            </span>
                                                                                        </Link>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </HoverCardContent>
                                                                )}
                                                            </HoverCard>
                                                        )
                                                    ) : (
                                                        item.href && item.href != "" && (
                                                            <div key={index}>
                                                                <HoverCard>
                                                                    <HoverCardTrigger asChild>
                                                                        <Link
                                                                            key={index}
                                                                            href={item.disabled ? "/" : item.href} 
                                                                            onClick={(e)=>{
                                                                               setSideOpen(false)
                                                                            }
                                                                            }
                                                                        >
                                                                            <span
                                                                                className={cn(
                                                                                    "group my-1 flex items-center rounded-sm px-3 py-1 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-800",
                                                                                    path === item.href
                                                                                        ? "bg-gray-200 font-semibold hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800"
                                                                                        : "transparent",
                                                                                    item.disabled && "cursor-not-allowed opacity-80"
                                                                                )}
                                                                            >
                                                                                <span className={path == item.href ? "text-gray-900 dark:text-gray-200" : "text-gray-600 dark:text-gray-400"}><Icon className="h-4" /></span>
                                                                                {isOpen && (
                                                                                    <span className={path == item.href ? "mx-2" : "mx-2 font-normal"}> {item.title}</span>
                                                                                )}
                                                                            </span>
                                                                        </Link>
                                                                    </HoverCardTrigger>
                                                                    {!isOpen && (
                                                                        <HoverCardContent
                                                                            className="left-12 w-fit p-0"
                                                                            side="right"
                                                                        >
                                                                            <div className="flex justify-between space-x-4">
                                                                                <Link
                                                                                    key={index}
                                                                                    href={item.disabled ? "/" : item.href}
                                                                                    className={cn(
                                                                                        "w-full rounded-sm text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200",
                                                                                        item.disabled && "cursor-not-allowed opacity-80"
                                                                                    )}
                                                                                >
                                                                                    <span className="mx-2">{item.title}</span>
                                                                                </Link>
                                                                            </div>
                                                                        </HoverCardContent>
                                                                    )}
                                                                </HoverCard>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto w-full">
                                <div>
                                    <div className="my-2">
                                        {/* <ThemeToggle isOpen={isOpen} /> */}
                                    </div>
                                    <div className="my-2">
                                        <UserAccountNav
                                            user={{
                                                firstName: user?.firstName,
                                                lastName: user?.lastName,
                                                image: user?.image,
                                                email: user?.email,
                                            }}
                                            isOpen={isOpen}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>

        </div>
    )
}
