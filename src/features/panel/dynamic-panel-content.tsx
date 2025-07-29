"use client"

import { useAppLayoutPanelViewContext } from "@/components/layout/app-layout/components/panel-view-provider"
import { AgentsView } from "./components/agents-view"
import { HistoryView } from "./components/history-view"
import { ProjectsView } from "./components/projects-view"
import { UploadsView } from "./components/uploads-view"
import { PANEL_VIEWS } from "@/components/layout/app-layout/constants"

export const DynamicPanelContent = () => {
  const { activePanelView } = useAppLayoutPanelViewContext()

  const renderContent = () => {
    switch (activePanelView) {
      case PANEL_VIEWS.HISTORY:
        return <HistoryView />
      case PANEL_VIEWS.AGENTS:
        return <AgentsView />
      case PANEL_VIEWS.PROJECTS:
        return <ProjectsView />
      case PANEL_VIEWS.UPLOADS:
        return <UploadsView />
      default:
        return null
    }
  }

  return <>{renderContent()}</>
}
