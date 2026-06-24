import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Zap, Sparkles, Trophy, Calendar } from 'lucide-react'

const HeroSphere = dynamic(() => import('../AcademicSphere'), { ssr: false })

export default function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15
    setTilt({ x, y })
  }

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden mesh-grid">
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copywriting & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FFC6]/30 bg-[#00FFC6]/10 text-[#FFD166] text-xs font-black uppercase tracking-wider mb-6 animate-pulse-glow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen Academic Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-hero text-5xl sm:text-7xl leading-tight font-black tracking-tight text-white mb-6"
          >
            Become <span className="text-gradient-aurora">Impossible</span> <br />
            To Ignore.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-medium"
          >
            Transform your learning metrics, verified certifications, skills, and projects into a multi-dimensional digital student identity. Track attendance, write AI summaries, and climb global leaderboards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/mission-control" className="px-8 py-4 rounded-[14px] font-bold text-center text-black bg-[#FFD166] hover:bg-[#FFD166]/90 shadow-[#FFD166]/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              Start Building Your Identity
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-[14px] font-bold text-center text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center">
              Explore Features
            </Link>
          </motion.div>

          {/* Floating Trust Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-6 border-t border-white/5 pt-8 w-full"
          >
            <div>
              <p className="text-2xl font-black text-white">98%</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted mt-1">Placement Success</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#FFD166]">4.9★</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted mt-1">Student Rating</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#00FFC6]">24k+</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted mt-1">Active Scholars</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Mockup & 3D sphere */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          
          {/* Animated Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-[#00FFC6]/10 blur-[80px] -z-10 animate-pulse-glow" />

          {/* Interactive Mouse Tilt Glass Mockup Container */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            style={{
              rotateY: tilt.x,
              rotateX: tilt.y,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full max-w-[420px] aspect-[9/11] glass-premium rounded-[28px] p-6 relative border border-white/10 shadow-2xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">Console v1.0.3</span>
            </div>

            {/* Embed 3D canvas sphere */}
            <div className="w-full flex-1 min-h-[180px] relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 mb-6 flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#030303]/80 via-transparent to-transparent" />
              <div className="w-full h-full">
                <HeroSphere />
              </div>
            </div>

            {/* Quick Floating Cards / Profile metrics */}
            <div className="space-y-3.5">
              <div className="glass p-3.5 rounded-xl flex items-center justify-between border border-white/5 hover:border-[#00FFC6]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#00FFC6]/15 flex items-center justify-center text-[#00FFC6]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Academic Score</p>
                    <p className="text-[10px] text-muted">Profile setup status</p>
                  </div>
                </div>
                <p className="text-sm font-black text-white">88 <span className="text-[10px] text-[#FFD166]">/ 100</span></p>
              </div>

              <div className="glass p-3.5 rounded-xl flex items-center justify-between border border-white/5 hover:border-[#FFD166]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFD166]/15 flex items-center justify-center text-[#FFD166]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Weekly Focus Target</p>
                    <p className="text-[10px] text-muted">Attendance goal active</p>
                  </div>
                </div>
                <p className="text-sm font-black text-[#FFD166]">92%</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
