import * as React from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"


export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-center gap-4 py-5 md:flex-row md:py-0">
        <div className="flex flex-col items-center text-center md:flex-row md:gap-2 md:px-0">
          {/* <Icons.logo /> */}
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            Copyright © 2024 Kuykendall Networks, LLC All rights reserved. Privacy Policy | Terms of Use
          </p>
        </div>
        {/* <ModeToggle /> */}
      </div>
    </footer>
  )
}
