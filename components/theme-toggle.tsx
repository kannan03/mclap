"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

interface ThemeProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
}

export function ThemeToggle({ isOpen }: ThemeProps) {
  const { setTheme, theme } = useTheme()

  return (
    <div>
      {isOpen ? (
        <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="w-full h-8 hover:bg-transparent"
      >
        <span className="pr-2 dark:hidden">Light</span>
        <Sun className="h-[1.3rem] w-[1rem] dark:hidden" />
        <span className="hidden pr-2 dark:block">Dark </span>
        <Moon className="hidden h-4 w-4 dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-8 hover:bg-transparent"
        >
          <Sun className="h-[1.3rem] w-[1rem] dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      )}
    </div>
  )
}
