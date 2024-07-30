import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
  user: any
}

export function UserAvatar({ ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <Icons.user/>
    </Avatar>
  )
}
