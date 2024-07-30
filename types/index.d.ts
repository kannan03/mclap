import { User } from "@prisma/client"
import type { Icon } from "lucide-react"

import { Icons } from "@/components/icons"
import { nullable } from "zod"

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type SubItem = {
  title: string
  disabled?: boolean
  href: string
  external?: boolean
  icon?: keyof typeof Icons
  access: string[]
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  header:string
  disabled?: boolean
  linkPrefix?: string
  external?: boolean
  access: string[]
  icon?: keyof typeof Icons
  subMenu?: SubItem[]
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
  accessControl: { [id: string]: string[]; } = {};
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isPro: boolean
  }
