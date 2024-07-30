"use client"

import * as React from "react"
import Link from "next/link"
import { User } from "next-auth"
import { getSession, signOut } from "next-auth/react"
import placeHolder from "public/image1.png"
import { Icons } from "@/components/icons";

import axiosInstance from "@/config/axios/axiosClientInterceptorInstance"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIdleTimer } from 'react-idle-timer'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: any
  isOpen: boolean
}
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
export function UserAccountNav({ user, isOpen }: UserAccountNavProps) {

  const name = user?.lastName ? `${user?.lastName}, ${user?.firstName}` : `${user?.firstName}`
  async function handleClick() {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  function handleClickProfile(){
    setOpen(false);
  }
  const [image, setImage] = React.useState<any>("")
  const [open, setOpen] = React.useState(false);


  const onIdle = () => {
    console.log("Idle")
    handleClick()
  }

  const { getRemainingTime } = useIdleTimer({
    onIdle,
    crossTab: true,
    timeout: 900000,
    throttle: 500
  })



  const fetchData = async () => {
    const session = await getSession()
    const response = await axiosInstance.get(
      `${baseURL}/v1/users/${session?.user?.id}`
    )
    let modifiedData = response?.data?.user
    if (modifiedData?.profile) {
      setImage(modifiedData?.profile)
    } else {
      setImage(placeHolder.src)
    }
  }
  React.useEffect(() => {
    fetchData()
  }, [])
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("mb-5 w-full justify-between", isOpen && "w-full")}
          variant="outline"
          size="icon"
        >
          <div className="flex items-center">
          {image && (
            <img
              src={image}
              className="mx-2 h-7 w-7 rounded-full"
              alt={user.name || "User Image"}
            />
          )}

          {isOpen && <span className="align-middle text-xs font-normal"> {name}</span>}
          </div>
          {isOpen && <Icons.chevronUp className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="absolute bottom-10 mb-2 w-48"
      >
        {/* <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="w-full  cursor-pointer">
          <Link href="/profile" className="w-full text-xs font-normal" onClick={handleClickProfile}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full cursor-pointer text-xs font-normal" onClick={handleClick}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
