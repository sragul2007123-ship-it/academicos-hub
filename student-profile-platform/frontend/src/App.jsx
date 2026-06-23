import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentProfile from './pages/StudentProfile'
import Leaderboard from './pages/Leaderboard'
import Recruiters from './pages/Recruiters'
import RecruiterProfile from './pages/RecruiterProfile'
import AdminPanel from './pages/AdminPanel'
import Posts from './pages/Posts'
import Messages from './pages/Messages'
import LearningHub from './pages/LearningHub'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/student/:username" element={<PageTransition><StudentProfile /></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
        <Route path="/posts" element={<PageTransition><Posts /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/recruiter/:username" element={<PageTransition><RecruiterProfile /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminPanel /></PageTransition>} />
        <Route path="/learning" element={<PageTransition><LearningHub /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

import { ReactLenis } from '@studio-freight/react-lenis'
import AuroraBackground from './components/AuroraBackground'

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true }}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AuroraBackground>
              <Navbar />
              <main className="pt-24 sm:pt-28 pb-10">
                <AnimatedRoutes />
              </main>
            </AuroraBackground>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ReactLenis>
  )
}

export default App
