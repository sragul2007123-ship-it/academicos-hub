import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import AcademicSphere from '../components/AcademicSphere'
import GlassCard from '../components/GlassCard'
import MagneticButton from '../components/MagneticButton'

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Create Your Digital Portfolio',
    desc: 'Build a stunning digital portfolio that represents your academic and professional journey.',
    color: 'from-[var(--emerald)] to-[var(--cyan)]',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Showcase Projects',
    desc: 'Display your best projects with descriptions, GitHub links, and live demos.',
    color: 'from-[var(--cyan)] to-[var(--gold)]',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Skills with Progress Bars',
    desc: 'Highlight your technical skills with beautiful animated progress bars.',
    color: 'from-[var(--gold)] to-[var(--emerald)]',
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="overflow-hidden w-full relative z-10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-[0.8] mix-blend-screen pointer-events-none md:pointer-events-auto">
          <AcademicSphere />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--glass)] border border-[var(--border)] text-[var(--emerald)] text-sm font-bold mb-10 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,255,198,0.2)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--emerald)] shadow-[0_0_10px_#00FFC6] animate-pulse"></span>
            Academic Identity Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold leading-tight mb-8 tracking-tighter"
          >
            Become{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--emerald)] via-[var(--cyan)] to-[var(--emerald)] bg-[length:200%_auto] animate-[text-shine_3s_linear_infinite]">Impossible</span>
            <br />
            To Ignore.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl text-[var(--muted)] max-w-4xl mx-auto mb-14 text-balance font-medium leading-relaxed"
          >
            Transform your skills, projects, achievements, certifications, internships, and learning journey into a powerful academic identity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {user ? (
              <MagneticButton to="/dashboard" variant="primary">
                Enter Mission Control →
              </MagneticButton>
            ) : (
              <>
                <MagneticButton to="/register" variant="primary">
                  Start Building
                </MagneticButton>
                <MagneticButton to="/leaderboard" variant="secondary">
                  Explore Platform
                </MagneticButton>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Everything You Need to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--emerald)] to-[var(--cyan)]">Stand Out</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <GlassCard className="p-10 h-full" hover glow>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-[var(--background)] mb-8 shadow-xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed text-lg">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
