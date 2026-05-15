import { useNavigate, useLocation } from 'react-router-dom'
import { BitMascot } from './BitMascot'
import { useAuth } from '../../context/AuthContext'
import "../../styles/sidebar.css";


interface SidebarItem {
  label: string
  path: string
  icon: string
}

const studentItems: SidebarItem[] = [
  { label: 'Home Base',    path: '/dashboard',    icon: '🏠' },
  { label: 'Modules',      path: '/modules',       icon: '📚' },
  { label: 'Quizzes',      path: '/quiz',          icon: '⚡' },
  { label: 'Leaderboard',  path: '/leaderboard',   icon: '🏆' },
  { label: 'My Progress',  path: '/progress',      icon: '📈' },
  { label: 'Notifications',path: '/notifications', icon: '🔔' },
  { label: 'Profile',      path: '/profile',       icon: '👤' },
]

const teacherItems: SidebarItem[] = [
  { label: 'Home Base',    path: '/dashboard',       icon: '🏠' },
  { label: 'Modules',      path: '/modules',          icon: '📚' },
  { label: 'Upload',       path: '/upload',           icon: '📤' },
  { label: 'AI Quiz',      path: '/ai-quiz-builder',  icon: '✨' },
  { label: 'Analytics',    path: '/analytics',        icon: '📊' },
  { label: 'Students',     path: '/students',         icon: '👥' },
  { label: 'Notifications',path: '/notifications',    icon: '🔔' },
  { label: 'Profile',      path: '/profile',          icon: '👤' },
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
          <div className="sidebar-logo-sub">w/ BIT 🤖</div>
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
            <span>{item.icon}</span>
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