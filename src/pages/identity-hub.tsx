import React from 'react'
import Head from 'next/head'
import LivingBackground from '../components/LivingBackground'
import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import SkillConstellation from '../components/SkillConstellation'
import { useAcademicStore } from '../store/academicStore'
import { Trophy, Award, Shield, ArrowUpRight, Flame } from 'lucide-react'

export default function IdentityHub() {
  const { xp, level, streak, profile } = useAcademicStore()

  return (
    <>
      <Head>
        <title>Identity Hub — academicos</title>
        <meta name="description" content="Manage and share your academic digital credentials." />
      </Head>

      <LivingBackground />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6 relative z-10 max-w-4xl mx-auto text-left">
        
        {/* Cover Photo Banner */}
        <div className="h-48 w-full rounded-[24px] overflow-hidden relative border border-white/10 mb-8 bg-cover bg-center" style={{ backgroundImage: `url(${profile.banner})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div>
              <h1 className="text-xl font-display font-black text-white leading-none">Sragul Ragunathan</h1>
              <p className="text-[10px] text-accent font-bold uppercase mt-1">Diamond Scholar • Level {level}</p>
            </div>
          </div>
        </div>

        {/* Profile Card & Skill Constellation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card Left */}
          <div className="md:col-span-5 glass p-6 rounded-[24px] border border-white/5 flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">Credentials Audit</h3>
              <ul className="space-y-3.5 text-xs font-bold text-gray-200">
                <li className="flex justify-between">
                  <span>CGPA Projection</span>
                  <span className="text-accent">9.20</span>
                </li>
                <li className="flex justify-between">
                  <span>Daily Streak</span>
                  <span className="text-orange-400 flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-current" /> {streak} days</span>
                </li>
                <li className="flex justify-between">
                  <span>Attendance status</span>
                  <span className="text-green-400">87.5%</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-white/5 pt-4 mt-6">
              <p className="text-[10px] text-muted leading-relaxed font-semibold">
                Your credentials are secured & verified on the blockchain registry.
              </p>
            </div>
          </div>

          {/* Skill Constellation */}
          <div className="md:col-span-7 glass p-6 rounded-[24px] border border-white/5 flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4">Skill Constellation</h3>
              <div className="w-full flex-1 flex items-center justify-center min-h-[120px] bg-black/20 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,rgba(0, 255, 198, 0.1),transparent)]" />
                <div className="relative z-10 flex flex-wrap justify-center gap-2 p-4">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Python', 'Three.js'].map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white hover:border-[#00FFC6]/40 transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-muted uppercase">
              <span>Constellation status: Connected</span>
              <span className="text-accent flex items-center gap-1">Verify Skills <ArrowUpRight className="w-3 h-3" /></span>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </>
  )
}
