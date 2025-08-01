"use client"

import { useEffect, useState } from "react"
import { Button, ButtonProps, cn } from "@mijn-ui/react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

/* -------------------------------------------------------------------------- */

const ThemeToggler = ({ className, children, onClick, ...props }: ButtonProps) => {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return

  if (resolvedTheme === "dark") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          onClick?.(e)
          setTheme("light")
        }}
        className={cn("rounded-md", className)}
        data-active-theme="dark"
        iconOnly
        {...props}>
        {children ? children : <Sun className="text-lg" />}
      </Button>
    )
  }
  if (resolvedTheme === "light") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={cn("rounded-md", className)}
        data-active-theme="light"
        iconOnly
        {...props}>
        {children ? children : <Moon className="text-base" />}
      </Button>
    )
  }
}

export { ThemeToggler }
