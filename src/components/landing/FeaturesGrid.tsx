import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Calendar, Shield, BookOpen, Users, Award } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Career Insights',
    desc: 'Receive personalized market recommendations and track profile scoring based on real resume factors.',
    color: '#00FFC6'
  },
  {
    icon: Calendar,
    title: 'Study Planner & Attendance',
    desc: 'Intuitively manage lecture schedules, calculate attendance ratios, and set GPA prediction curves.',
    color: '#00D4FF'
  },
  {
    icon: Shield,
    title: 'Verified Badges',
    desc: 'Unlock exclusive status ranks like Elite and Master Scholar to build recruiter trust.',
    color: '#FFD166'
  },
  {
    icon: BookOpen,
    title: 'Notes Marketplace',
    desc: 'Upload course study guides, search categories, read rating scores, and collaborate globally.',
    color: '#EC4899'
  },
  {
    icon: Users,
    title: 'Social Learning Network',
    desc: 'Participate in student discussions, share projects, leave comments, and grow followers.',
    color: '#10B981'
  },
  {
    icon: Award,
    title: 'Gamification System',
    desc: 'Earn levels and XP points for completing daily challenges. Rise on the local leaderboard.',
    color: '#F59E0B'
  }
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-black/20 border-y border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-[#00D4FF]/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-4">
            Built For the Next Generation of Scholars
          </h2>
          <p className="text-muted text-sm sm:text-base font-medium">
            Discover a comprehensive suite of digital tools designed to transform your academic results into verifiable career opportunities.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, borderColor: `${f.color}50` }}
                className="glass p-6 rounded-[20px] border border-white/5 hover:shadow-2xl transition-all duration-300 group cursor-default"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${f.color}15`, color: f.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-black text-lg text-white mb-2 tracking-wide">
                  {f.title}
                </h3>
                <p className="text-muted text-xs leading-relaxed font-medium">
                  {f.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
