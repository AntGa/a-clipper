import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Clips', icon: '🎬' },
  { to: '/trim', label: 'Trim', icon: '✂️' },
  { to: '/upload', label: 'Upload', icon: '☁️' }
]

export default function Sidebar(): React.JSX.Element {
  return (
    <aside className="w-64 h-full bg-neutral-800 border-r border-neutral-700 flex flex-col shrink-0">
      {/* Logo / App name */}
      <div className="px-6 py-5 border-b border-neutral-700">
        <h1 className="text-lg font-bold text-white tracking-tight">a-clipper</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Anton's Clip Manager</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1 items-center justify-center">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-3 mb-2">
          Workflow
        </span>
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-lg text-base font-semibold transition-colors w-full ${
                isActive
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-neutral-700">
        <p className="text-xs text-neutral-600">v0.1.0</p>
      </div>
    </aside>
  )
}
