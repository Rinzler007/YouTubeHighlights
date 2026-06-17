import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="font-bold tracking-tight text-lg bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent"
        >
          YouTube Highlights
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/highlights"
            className={`text-sm transition-colors ${
              pathname === '/highlights' ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Analyze
          </Link>
        </div>
      </div>
    </nav>
  )
}
