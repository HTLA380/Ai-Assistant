import { logout } from "@/features/auth/api/actions"
import { Button } from "@mijn-ui/react"

const DashboardPage = async () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <form action={logout}>
            <Button variant="danger" type="submit">
              Logout
            </Button>
          </form>
        </div>
        Dashboard
      </div>
    </div>
  )
}

export default DashboardPage
