import React from 'react'
import Head from 'next/head'
import LivingBackground from '../components/LivingBackground'
import Navbar from '../components/Navbar'
import Footer from '../components/landing/Footer'
import { Trophy, Award, Star, Flame } from 'lucide-react'

const leaders = [
  { rank: 1, name: "Sragul Ragunathan", username: "sragul2007", level: 3, xp: 1250, score: 88, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sragul&backgroundColor=00FFC6", streak: 7 },
  { rank: 2, name: "Alex Johnson", username: "alexj", level: 2, xp: 800, score: 84, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", streak: 4 },
  { rank: 3, name: "Dr. Maya", username: "dr_maya", level: 2, xp: 540, score: 78, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya", streak: 2 }
]

export default function HallOfFame() {
  return (
    <>
      <Head>
        <title>Hall Of Fame — academicos</title>
        <meta name="description" content="Explore the top-performing students on academicos." />
      </Head>

      <LivingBackground />
      <Navbar />

      <main className="min-h-screen pt-32 pb-20 px-6 relative z-10 max-w-4xl mx-auto text-left">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-black uppercase tracking-wider mb-4"
          >
            <Trophy className="w-3.5 h-3.5 fill-current" /> Global Leaderboard
          </motion.div>
          <h1 className="h-hero text-4xl sm:text-5xl font-black text-white mb-4">Hall Of Fame</h1>
          <p className="text-muted text-xs sm:text-sm font-semibold">
            Track real-time XP accumulation, streak maintenance, and identity score ranks across the cohort.
          </p>
        </div>

        {/* Podium mockups */}
        <div className="grid grid-cols-3 gap-4 items-end mb-12 max-w-xl mx-auto pt-8">
          
          {/* Silver */}
          <div className="flex flex-col items-center">
            <img src={leaders[1].avatar} className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white/5 mb-2" alt="2" />
            <div className="w-full h-24 glass rounded-t-xl border border-white/5 flex flex-col items-center justify-center p-3">
              <span className="text-lg font-black text-slate-300">2nd</span>
              <p className="text-[10px] text-muted font-bold mt-1 text-center truncate w-full">{leaders[1].name}</p>
            </div>
          </div>

          {/* Gold */}
          <div className="flex flex-col items-center">
            <Trophy className="w-6 h-6 text-yellow-400 mb-1 animate-bounce" />
            <img src={leaders[0].avatar} className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-white/5 mb-2" alt="1" />
            <div className="w-full h-32 bg-gradient-to-b from-yellow-500/10 to-[#030303] rounded-t-xl border border-yellow-500/30 flex flex-col items-center justify-center p-3 shadow-2xl">
              <span className="text-xl font-black text-yellow-400">1st</span>
              <p className="text-[10px] text-white font-black mt-1 text-center truncate w-full">{leaders[0].name}</p>
            </div>
          </div>

          {/* Bronze */}
          <div className="flex flex-col items-center">
            <img src={leaders[2].avatar} className="w-10 h-10 rounded-full border-2 border-amber-600 bg-white/5 mb-2" alt="3" />
            <div className="w-full h-20 glass rounded-t-xl border border-white/5 flex flex-col items-center justify-center p-3">
              <span className="text-base font-black text-amber-600">3rd</span>
              <p className="text-[10px] text-muted font-bold mt-1 text-center truncate w-full">{leaders[2].name}</p>
            </div>
          </div>

        </div>

        {/* Leaders list */}
        <div className="space-y-3">
          {leaders.map(lead => (
            <div key={lead.rank} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-xs font-black text-muted w-4">{lead.rank}</span>
                <img src={lead.avatar} className="w-8 h-8 rounded-full bg-white/5 border border-white/5" alt="user" />
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate">{lead.name}</p>
                  <p className="text-[9px] text-muted font-bold">Level {lead.level} • {lead.xp} XP</p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> {lead.streak}d
                </span>
                <span className="text-xs font-black text-accent bg-accent/10 px-2.5 py-1 rounded">
                  Score: {lead.score}
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </>
  )
}
import { motion } from 'framer-motion'
