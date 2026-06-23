import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
  const { user, signInWithGoogle, signUpWithEmail, signInWithEmail, signInWithMagicLink, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isRegister = location.pathname === '/register'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isMagicLink, setIsMagicLink] = useState(false)
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user && !loading) navigate('/dashboard')
  }, [user, loading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setAuthLoading(true)

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        await signUpWithEmail(email, password, name)
        setSuccess('Registration successful! Please check your email for a confirmation link.')
      } else {
        if (isMagicLink) {
          await signInWithMagicLink(email)
          setSuccess('Magic Link sent! Check your email to log in.')
        } else {
          await signInWithEmail(email, password)
          navigate('/dashboard')
        }
      }
    } catch (err) {
      let msg = err.message
      if (msg.includes('already registered') || msg.includes('User already exists')) {
        msg = "This email is already registered. Please login instead."
      }
      setError(msg)
    } finally {
      setAuthLoading(false)
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 relative pt-20 overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 group text-[var(--muted)] hover:text-[var(--background)] transition-all font-medium z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--glass)]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[var(--cyan)]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[var(--emerald)]/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card border-[var(--border)] p-8 sm:p-10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--cyan)] to-[var(--emerald)] flex items-center justify-center shadow-[0_0_30px_rgba(0,212,255,0.3)]">
              <svg className="w-7 h-7 text-[var(--background)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-display font-bold text-center mb-2 text-[var(--text)] tracking-tight">
            {isRegister ? 'Create Account' : (isMagicLink ? 'Passwordless Sign In' : 'Welcome Back')}
          </h1>
          <p className="text-center text-sm text-[var(--muted)] mb-8">
            {isRegister 
              ? 'Join the premium Academic Identity Platform' 
              : (isMagicLink ? "We'll send a secure login link to your inbox" : 'Sign in to your Academic Command Center')}
          </p>

          <AnimatePresence>
            {error && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-6 overflow-hidden">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mb-6 overflow-hidden">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {success}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {isRegister && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent outline-none transition-all"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </motion.div>
            )}
            <div>
              <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent outline-none transition-all"
                placeholder="name@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <AnimatePresence mode="wait">
              {!isMagicLink && (
                <motion.div 
                  key="password-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Password</label>
                    <input
                      type="password"
                      required={!isMagicLink}
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  {isRegister && (
                    <div className="pt-4">
                      <label className="block text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-2">Confirm Password</label>
                      <input
                        type="password"
                        required
                        className="w-full px-4 py-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:ring-2 focus:ring-[var(--cyan)] focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!isRegister && (
              <div className="flex justify-end pt-1">
                <button 
                  type="button"
                  onClick={() => setIsMagicLink(!isMagicLink)}
                  className="text-xs font-bold text-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                >
                  {isMagicLink ? 'Use Password instead' : 'Sign in with Magic Link'}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-[var(--cyan)] to-[var(--emerald)] border-none text-[var(--background)] font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,198,0.4)] cursor-pointer"
            >
              {authLoading ? 'Authenticating...' : (
                isRegister ? 'Create Account' : (isMagicLink ? 'Send Magic Link' : 'Sign In')
              )}
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold text-[var(--muted)]">
              <span className="bg-[var(--background)] px-4">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--glass)] border border-[var(--border)] hover:border-[var(--cyan)]/50 transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-bold text-gray-300 group-hover:text-[var(--text)] transition-colors">
              Google Account
            </span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}
            <Link 
              to={isRegister ? '/login' : '/register'} 
              className="ml-2 font-bold text-[var(--text)] hover:text-[var(--cyan)] transition-colors"
            >
              {isRegister ? 'Sign In' : 'Create Account'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
