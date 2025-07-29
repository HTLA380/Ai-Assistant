"use client"

import { ThemeToggler } from "@/components/ui/theme-toggler"
import { Button, cn } from "@mijn-ui/react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { ChevronDown, Menu, X } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { NavItem, navItems } from "./constants"

const NavigationMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <DesktopNavigation navItems={navItems} />

      <div className="hidden items-center gap-2 !justify-self-end lg:flex">
        <Button asChild>
          <Link href={"/login"}>Login</Link>
        </Button>
        <Button asChild variant="primary">
          <Link href={"/register"}>Get Started Today</Link>
        </Button>
        <ThemeToggler className="rounded-md" />
      </div>

      {/* Mobile Menu */}
      <MobileNavigation navItems={navItems} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <Button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        iconOnly
        variant="ghost"
        className="col-start-3 flex items-center justify-center gap-2 !justify-self-end rounded-sm lg:hidden">
        {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
      </Button>
    </>
  )
}

export { NavigationMenu }

/* -------------------------------------------------------------------------- */

const DesktopNavigation = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <NavigationMenuPrimitive.Root className="hidden lg:flex">
      <NavigationMenuPrimitive.List className="flex items-center space-x-1">
        {navItems.map((item) =>
          item.subItems ? (
            <NavigationMenuItem key={item.title} item={item} />
          ) : (
            <NavigationMenuPrimitive.Item key={item.title}>
              <NavigationMenuPrimitive.Link asChild>
                <Link
                  href={item.href || "#"}
                  className="rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  {item.title}
                </Link>
              </NavigationMenuPrimitive.Link>
            </NavigationMenuPrimitive.Item>
          ),
        )}
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}

const NavigationMenuItem = ({ item }: { item: NavItem }) => {
  return (
    <NavigationMenuPrimitive.Item>
      <NavigationMenuPrimitive.Trigger className="flex items-center space-x-1 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary hover:text-foreground">
        {item.href ? <Link href={item.href}>{item.title}</Link> : <span>{item.title}</span>}
        <ChevronDown className="size-4" />
      </NavigationMenuPrimitive.Trigger>

      <NavigationMenuPrimitive.Content
        className={cn(
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "absolute left-0 top-full mt-2 w-48 rounded-lg border bg-background-alt p-2 shadow-sm !duration-300",
        )}>
        <div className="flex flex-col">
          {item.subItems?.map((subItem) => (
            <NavigationMenuPrimitive.Link key={subItem.title} asChild>
              <Link
                href={subItem.href}
                className="rounded-md px-3 py-2 text-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {subItem.title}
              </Link>
            </NavigationMenuPrimitive.Link>
          ))}
        </div>
      </NavigationMenuPrimitive.Content>
    </NavigationMenuPrimitive.Item>
  )
}

const MobileNavigation = ({
  navItems,
  isOpen,
  onClose,
}: {
  navItems: NavItem[]
  isOpen: boolean
  onClose: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-[calc(var(--header-height)+1px)] z-10 h-auto w-full bg-background-alt lg:hidden">
      <div className="space-y-4 p-4">
        {navItems.map((item) => (
          <MobileNavItem key={item.title} item={item} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}

const MobileNavItem = ({ item, onClose }: { item: NavItem; onClose: () => void }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  if (!item.subItems) {
    return (
      <Link
        href={item.href || "#"}
        onClick={onClose}
        className="block py-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
        {item.title}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between py-2 text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
        {item.title}
        <ChevronDown className={cn("size-4 transition-transform", isExpanded ? "rotate-180" : "rotate-0")} />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 pl-4">
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.title}
              href={subItem.href}
              onClick={onClose}
              className="block py-1 text-sm text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
              {subItem.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
