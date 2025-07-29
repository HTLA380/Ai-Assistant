// We don't have an api end point for the history yet,
// I will just use mock data to fetch by simulating the network delay.
import { MOCK_AGENTS, MOCK_HISTORY, MOCK_PROJECTS, MOCK_UPLOADS } from "./mock-data"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchHistory = async () => {
  await sleep(500)
  console.log("Fetching history...")
  return MOCK_HISTORY
}

export const fetchAgents = async () => {
  await sleep(500)
  console.log("Fetching agents...")
  return MOCK_AGENTS
}

export const fetchProjects = async () => {
  await sleep(500)
  console.log("Fetching projects...")
  return MOCK_PROJECTS
}

export const fetchUploads = async () => {
  await sleep(500)
  console.log("Fetching uploads...")
  return MOCK_UPLOADS
}
