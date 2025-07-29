"use client"

import { ThemeToggler } from "@/components/ui/theme-toggler"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mijn-ui/react"
import { ExternalLink, FileSpreadsheet, LogOut, Moon, Settings, Sun } from "lucide-react"
import Link from "next/link"
import { logout } from "../api/actions"
import { User } from "@/lib/auth"

const UserProfile = ({ user }: { user: User | null }) => {
  const handleLogout = async () => {
    await logout()
  }

  if (user) {
    return (
      <AlertDialog>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
              <Avatar size="2xs">
                <AvatarImage src={user?.image ?? ""} alt={user?.username ?? ""} />
                <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 !duration-150" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-4 pt-4 text-xs font-normal text-secondary-foreground">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuItem className="h-fit px-4 py-2">
                <Avatar size="xs">
                  <AvatarImage src={user?.image ?? ""} alt={user?.username ?? ""} />
                  <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <span className="text-xs font-light text-secondary-foreground">Free</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild className="cursor-pointer px-3 py-2">
                <ThemeToggler className="group w-full rounded-none bg-transparent" unstyled>
                  <div className="hidden items-center gap-2 group-data-[active-theme=light]:flex">
                    <Moon className="text-secondary-foreground" />
                    Dark
                  </div>
                  <div className="hidden items-center gap-2 group-data-[active-theme=dark]:flex">
                    <Sun className="text-secondary-foreground" />
                    Light
                  </div>
                </ThemeToggler>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-secondary-foreground focus:text-foreground">
                <FileSpreadsheet />
                My Files
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-secondary-foreground focus:text-foreground">
                <ExternalLink />
                Help & FAQ
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer px-3 py-2 text-secondary-foreground focus:text-foreground">
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-border" />

            <DropdownMenuItem
              asChild
              className="cursor-pointer px-3 py-2 text-danger-emphasis focus:text-danger-emphasis">
              <AlertDialogTrigger unstyled className="w-full">
                <LogOut />
                Log out
              </AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm logout</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault()
                await handleLogout()
              }}>
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button asChild>
        <Link href={"/login"}>Log in</Link>
      </Button>
      <ThemeToggler />
    </div>
  )
}

export { UserProfile }
