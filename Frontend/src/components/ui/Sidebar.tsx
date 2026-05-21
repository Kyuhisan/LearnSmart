import { useNavigate, useLocation } from 'react-router-dom'
import { IconBox } from './IconBox'
import { useAuth } from '../../context/AuthContext'
import "../../styles/sidebar.css";


interface SidebarItem {
  label: string
  path: string
}

const studentItems: SidebarItem[] = [
  { label: 'Home Base',     path: '/dashboard'    },
  { label: 'Modules',       path: '/modules'      },
  { label: 'Quizzes',       path: '/quiz'         },
  { label: 'Leaderboard',   path: '/leaderboard'  },
  { label: 'My Progress',   path: '/progress'     },
  { label: 'Notifications', path: '/notifications'},
  { label: 'Profile',       path: '/profile'      },
]

const teacherItems: SidebarItem[] = [
  { label: 'Home Base',     path: '/dashboard'      },
  { label: 'Modules',       path: '/modules'        },
  { label: 'Upload',        path: '/upload'         },
  { label: 'AI Quiz',       path: '/ai-quiz-builder'},
  { label: 'Analytics',     path: '/analytics'      },
  { label: 'Students',      path: '/students'       },
  { label: 'Notifications', path: '/notifications'  },
  { label: 'Profile',       path: '/profile'        },
]

interface SidebarProps {
  vloga: string
  username: string
}

export function Sidebar({ vloga, username }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const isTeacher = vloga === 'ucitelj'
  const items = isTeacher ? teacherItems : studentItems

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="sidebar">

      {/* Nav */}
      <div className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`sidebar-nav-item ${location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)) ? 'active' : ''}`}
          >
            <IconBox size={14} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* User */}
      <div
        className="sidebar-user"
        role="button"
        tabIndex={0}
        onClick={() => navigate('/profile')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/profile') }}
      >
        <div className="sidebar-user-profile">
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
        <button
          className="sidebar-logout-icon"
          title="Sign out"
          onClick={(e) => { e.stopPropagation(); handleLogout() }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

    </div>
  )
}
