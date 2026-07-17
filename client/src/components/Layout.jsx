import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/add', label: 'Add Application' },
  { to: '/stats', label: 'Stats' },
]

// Shared header + sidebar/drawer shell. The sidebar is one element that's
// pinned open on desktop (md:) and slides in/out as a drawer below that.
export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const navItems = user?.role === 'admin' ? [...NAV_ITEMS, { to: '/users', label: 'Users' }] : NAV_ITEMS

  function handleLogout() {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-charcoal-950">
      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-charcoal-950 text-gray-300 transition-transform duration-200 ease-in-out
          md:translate-x-0
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-14 items-center px-6 text-lg font-semibold text-white">
          Job Tracker
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-charcoal-800 text-white'
                    : 'hover:bg-charcoal-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-charcoal-700 px-4 py-3">
          <span className="truncate text-sm text-gray-400">{user?.email}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-gray-300 hover:bg-charcoal-800 hover:text-white"
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-charcoal-700 bg-charcoal-900 px-4 text-white">
          <button
            type="button"
            aria-label="Toggle navigation"
            className="rounded-md p-2 hover:bg-charcoal-800 md:hidden"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-medium md:hidden">Job Tracker</span>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
