import axios from "axios"
import { ACCESS_TOKEN } from "./auth"
import { getCookie } from "../utils/cookies/server"

const axiosServer = axios.create({
  baseURL: process.env.EXTERNAL_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

axiosServer.interceptors.request.use(
  async (config) => {
    const token = await getCookie(ACCESS_TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosServer
