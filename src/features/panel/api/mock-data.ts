// This file holds our mock database content.
export type HistoryItem = { id: string; title: string }
export type AgentItem = { id: string; name: string; role: string }
export type ProjectItem = { id: string; name: string; status: string }
export type UploadItem = { id: string; fileName: string; size: string }

export const MOCK_HISTORY: HistoryItem[] = [
  { id: "hist_1", title: "Inquiry about Vitamin D supplements" },
  { id: "hist_2", title: "Follow-up on order #12345" },
  { id: "hist_3", title: "Question about ERP integration" },
]

export const MOCK_AGENTS: AgentItem[] = [
  { id: "agent_1", name: "Sales Bot", role: "Handles product questions" },
  { id: "agent_2", name: "Support Bot", role: "Assists with technical issues" },
]

export const MOCK_PROJECTS: ProjectItem[] = [
  { id: "proj_1", name: "Q3 Marketing Campaign", status: "Active" },
  { id: "proj_2", name: "Website Redesign", status: "Planning" },
]

export const MOCK_UPLOADS: UploadItem[] = [
  { id: "up_1", fileName: "product_catalog.pdf", size: "2.5 MB" },
  { id: "up_2", fileName: "sales_report_q2.xlsx", size: "800 KB" },
]
