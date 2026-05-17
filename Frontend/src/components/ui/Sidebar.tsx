import { useNavigate, useLocation } from 'react-router-dom'
import { BitMascot } from './BitMascot'
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
      {/* Logo */}
      <div className="sidebar-logo">
        <BitMascot size={32} mood="happy" />
        <div>
          <div className="sidebar-logo-text">LEARNSMART</div>
          <div className="sidebar-logo-sub">w/ BIT</div>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        {items.map(item => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <IconBox size={14} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* User */}
      <div className="sidebar-user" onClick={handleLogout} title="Sign out">
        <div className="sidebar-avatar">
          {username?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className="sidebar-user-name">{username}</div>
          <div className="sidebar-user-role">
            {isTeacher ? 'PROFESSOR' : 'STUDENT'}
          </div>
        </div>
      </div>
    </div>
  )
}