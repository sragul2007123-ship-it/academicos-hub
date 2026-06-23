import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'

export default function FloatingNavbar() {
  const { user, signOut } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Global Presence Heartbeat
  useEffect(() => {
    if (user) {
      const update = () => {
        api.updatePresence(user.id).catch(() => {})
      }
      update()
      const interval = setInterval(update, 120000)
      return () => clearInterval(interval)
    }
  }, [user])

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="backdrop-blur-[24px] bg-[var(--glass)] border border-[var(--border)] rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--emerald)] to-[var(--cyan)] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,198,0.3)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-shadow">
            <svg className="w-5 h-5 text-[var(--background)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-[var(--text)] tracking-tight">
            AcademicOS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/">Home</NavLink>
          {user && (
            <>
              <NavLink to="/leaderboard">Hall of Fame</NavLink>
              <NavLink to="/posts">Stream</NavLink>
              <NavLink to="/learning">AI Hub</NavLink>
              <NavLink to="/dashboard">Mission Control</NavLink>
            </>
          )}
          {user?.email === 'admin@academicos.com' && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleDarkMode} className="text-[var(--muted)] hover:text-[var(--gold)] transition-colors">
            {darkMode ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--emerald)] to-[var(--cyan)] p-[2px]">
                <div className="w-full h-full rounded-full bg-[var(--surface)] overflow-hidden flex items-center justify-center text-[var(--text)] text-sm font-bold">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.email?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
              </Link>
              <button onClick={signOut} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Login</Link>
              <Link to="/register" className="px-5 py-2 rounded-full text-sm font-bold bg-[var(--emerald)] text-[var(--background)] hover:bg-[var(--cyan)] shadow-[0_0_15px_rgba(0,255,198,0.2)] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[var(--text)] p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[110%] left-0 right-0 backdrop-blur-2xl bg-[var(--surface-2)]/90 border border-[var(--border)] rounded-3xl p-4 flex flex-col gap-2 shadow-2xl"
          >
            <Link to="/" onClick={() => setMobileOpen(false)} className="p-3 text-[var(--text)] font-medium rounded-xl hover:bg-[var(--glass)]">Home</Link>
            {user && (
              <>
                <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="p-3 text-[var(--text)] font-medium rounded-xl hover:bg-[var(--glass)]">Hall of Fame</Link>
                <Link to="/posts" onClick={() => setMobileOpen(false)} className="p-3 text-[var(--text)] font-medium rounded-xl hover:bg-[var(--glass)]">Stream</Link>
                <Link to="/learning" onClick={() => setMobileOpen(false)} className="p-3 text-[var(--emerald)] font-bold rounded-xl hover:bg-[var(--glass)]">AI Hub</Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="p-3 text-[var(--text)] font-medium rounded-xl hover:bg-[var(--glass)]">Mission Control</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="p-3 text-red-400 font-medium rounded-xl hover:bg-red-500/10 text-left">Logout</button>
              </>
            )}
            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)]">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="p-3 text-center text-[var(--cyan)] font-bold border border-[var(--cyan)] rounded-xl">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="p-3 text-center bg-[var(--emerald)] text-[var(--background)] font-bold rounded-xl">Register</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'text-[var(--emerald)]' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
    >
      {isActive && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute inset-0 bg-[var(--emerald)]/10 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  )
}
