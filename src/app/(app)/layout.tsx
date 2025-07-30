import { AuthStoreProvider } from "@/features/auth/stores/auth-store-provider"

import { getCurrentUser } from "@/lib/auth"

import { AppLayout as AppLayoutUI, getServerSideAppLayoutCookieData } from "@/components/layout/app-layout"
import { UserProfile } from "@/features/auth/components/user-profile"
import React from "react"
import { DynamicPanelContent } from "@/features/panel/dynamic-panel-content"
import { UserAgentProvider } from "@/components/providers/user-agent-provider"
import { headers } from "next/headers"
import { userAgent } from "next/server"

const TEMP_USER_INFO_UNTIL_AUTH_READY = {
  id: "1",
  username: "Htet Aung Lin",
  email: "htetaunglin.coder@gmail.com",
  gender: "male",
  image: "/images/avatar.jpg",
  role: "frontend-developer",
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const reqUserAgent = userAgent({ headers: headersList })
  const defaultValues = await getServerSideAppLayoutCookieData()
  const user = await getCurrentUser()

  const userInitialState = {
    user: user && TEMP_USER_INFO_UNTIL_AUTH_READY,
    isAuthenticated: !!user,
    isLoading: false,
  }

  return (
    <UserAgentProvider reqUserAgent={reqUserAgent}>
      <AuthStoreProvider initialState={userInitialState}>
        <AppLayoutUI
          defaultValues={defaultValues}
          headerSlot={<UserProfile user={user} />}
          panelSlot={<DynamicPanelContent />}>
          {children}
        </AppLayoutUI>
      </AuthStoreProvider>
    </UserAgentProvider>
  )
}
