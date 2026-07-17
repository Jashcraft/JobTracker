import { Link } from 'react-router-dom'
import { getApplications, updateApplication, deleteApplication } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import UserApplicationsPanel from '../components/UserApplicationsPanel'
import AdminOverview from '../components/AdminOverview'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-gray-100">
          {user.role === 'admin' ? 'Team Applications' : 'Applications'}
        </h1>
        <Link
          to="/add"
          className="rounded-md bg-accent-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-700"
        >
          + Add Application
        </Link>
      </div>

      {user.role === 'admin' ? (
        <AdminOverview />
      ) : (
        <UserApplicationsPanel
          fetchApplications={getApplications}
          updateApplicationFn={updateApplication}
          deleteApplicationFn={deleteApplication}
        />
      )}
    </div>
  )
}
