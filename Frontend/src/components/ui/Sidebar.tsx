import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import '../../styles/sidebar.css'

// ─── SVG icons ───────────────────────────────────────────────────────────────

function Icon({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {children}
    </svg>
  )
}

const Icons = {
  home:          <Icon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Icon>,
  modules:       <Icon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Icon>,
  quiz:          <Icon><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></Icon>,
  leaderboard:   <Icon><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></Icon>,
  progress:      <Icon><line x1="18" y1="20" x2="18" y2="4"/><line x1="12" y1="20" x2="12" y2="10"/><line x1="6" y1="20" x2="6" y2="16"/></Icon>,
  notifications: <Icon><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Icon>,
  profile:       <Icon><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>,
  upload:        <Icon><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></Icon>,
  aiQuiz:        <Icon><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Icon>,
  analytics:     <Icon><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></Icon>,
  students:      <Icon><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
  signout:       <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>,
}

// ─── Nav item data ────────────────────────────────────────────────────────────

interface SidebarItem {
  label: string
  path: string
  icon: React.ReactNode
}

const studentItems: SidebarItem[] = [
  { label: 'Home Base',     path: '/dashboard',    icon: Icons.home          },
  { label: 'Modules',       path: '/modules',      icon: Icons.modules       },
  { label: 'Quizzes',       path: '/quiz',         icon: Icons.quiz          },
  { label: 'Leaderboard',   path: '/leaderboard',  icon: Icons.leaderboard   },
  { label: 'My Progress',   path: '/progress',     icon: Icons.progress      },
  { label: 'Notifications · WIP', path: '/notifications',icon: Icons.notifications  },
  { label: 'Profile',            path: '/profile',      icon: Icons.profile       },
]

const teacherItems: SidebarItem[] = [
  { label: 'Home Base',          path: '/dashboard',       icon: Icons.home          },
  { label: 'Modules',            path: '/modules',         icon: Icons.modules       },
  { label: 'Upload',             path: '/upload',          icon: Icons.upload        },
  { label: 'AI Quiz',            path: '/ai-quiz-builder', icon: Icons.aiQuiz        },
  { label: 'Analytics',          path: '/analytics',       icon: Icons.analytics     },
  { label: 'Students',           path: '/students',        icon: Icons.students      },
  { label: 'Notifications · WIP', path: '/notifications',  icon: Icons.notifications  },
  { label: 'Profile',       path: '/profile',         icon: Icons.profile       },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  vloga: string
  username: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Sidebar({ vloga, username }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const bp = useBreakpoint()
  const isTeacher = vloga === 'ucitelj'
  const items = isTeacher ? teacherItems : studentItems
  const isMobile = bp === 'mobile'
  const compact = bp === 'tablet'

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && location.pathname.startsWith(path))

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  // ─── Mobile: bottom footer nav ───────────────────────────────────────────────
  if (isMobile) {
    return (
      <nav className="sidebar-mobile">
        {items.filter(item => item.path !== '/profile').map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            title={item.label}
            className={`sidebar-mobile-btn${isActive(item.path) ? ' active' : ''}`}
          >
            {item.icon}
          </button>
        ))}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="sidebar-mobile-btn sidebar-mobile-btn--signout"
        >
          {Icons.signout}
        </button>
      </nav>
    )
  }

  // ─── Tablet / Desktop ─────────────────────────────────────────────────────────
  return (
    <div className={`sidebar${compact ? ' sidebar--compact' : ''}`}>

      {/* Nav */}
      <div className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            title={compact ? item.label : undefined}
            className={`sidebar-nav-item${isActive(item.path) ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        {compact && (
          <>
            <div className="sidebar-nav-divider" />
            <button
              onClick={handleLogout}
              title="Sign out"
              className="sidebar-nav-item sidebar-nav-item--signout"
            >
              {Icons.signout}
              <span>Sign out</span>
            </button>
          </>
        )}
      </div>

      {/* User */}
      <div
        className="sidebar-user"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/profile')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile') }}
      >
        <div className="sidebar-user-profile" title={compact ? username : undefined}>
          <div className="sidebar-avatar">
            {username?.[0]?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{username}</div>
            <div className="sidebar-user-role">
              {isTeacher ? 'PROFESSOR' : 'STUDENT'}
            </div>
          </div>
        </div>
        {!compact && (
          <button
            className="sidebar-logout-icon"
            title="Sign out"
            onClick={(e) => { e.stopPropagation(); handleLogout() }}
          >
            {Icons.signout}
          </button>
        )}
      </div>

    </div>
  )
}
