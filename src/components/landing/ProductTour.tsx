import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShoppingBag, Send, Award, Calendar, BookOpen } from 'lucide-react'

const tours = [
  {
    key: 'planner',
    title: 'Study Planner OS',
    subtitle: 'Micro tasks, Macro gains',
    desc: 'The study planner turns your assignments and exams into structured checklist tasks. Complete them to earn verified XP points and levels.',
    bullets: ['Automatic priority weights', 'XP level rewards', 'Streak indicators'],
    color: '#00FFC6',
    mockup: (
      <div className="p-5 space-y-4">
        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Today's Academic Tasks</h4>
        <div className="space-y-2">
          <div className="bg-black/30 p-3 rounded-xl border border-[#00FFC6]/30 flex justify-between items-center">
            <span className="text-xs text-white line-through opacity-50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00FFC6]" /> Build 3D Landing Page
            </span>
            <span className="text-[10px] bg-[#00FFC6]/20 px-2 py-0.5 rounded text-[#00FFC6] font-bold">+150 XP</span>
          </div>
          <div className="bg-black/30 p-3 rounded-xl border border-white/5 flex justify-between items-center">
            <span className="text-xs text-white flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-white/20" /> Revise ML Equations
            </span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 font-bold">+100 XP</span>
          </div>
        </div>
      </div>
    )
  },
  {
    key: 'notes',
    title: 'Notes Marketplace',
    subtitle: 'Decentralized Academic Knowledge',
    desc: 'Share verified course outlines and lecture notes. Follow star creators, download mock guides, and review rating stats.',
    bullets: ['Direct PDF templates', 'Creator rating cards', 'Global tag index'],
    color: '#FFD166',
    mockup: (
      <div className="p-5 space-y-4">
        <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Trending Documents</h4>
        <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-lg bg-[#FFD166]/10 text-[#FFD166] flex items-center justify-center font-black text-xs">PDF</div>
          <div className="flex-1">
            <p className="text-xs font-black text-white truncate">Deep Learning Foundations</p>
            <p className="text-[9px] text-muted">Alex J. • 4.8★ • 142 downloads</p>
          </div>
          <button className="px-2.5 py-1 rounded bg-[#FFD166] text-black text-[9px] font-black uppercase">GET</button>
        </div>
      </div>
    )
  },
  {
    key: 'social',
    title: 'Discussions Feed',
    subtitle: 'Collaborate with peer researchers',
    desc: 'Share coding solutions, ask questions, leave feedback comments, and keep up to date with cohort projects.',
    bullets: ['Instant text shares', 'Discussions and Q&A', 'Verified student tags'],
    color: '#EC4899',
    mockup: (
      <div className="p-5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#EC4899]/20" />
          <div>
            <p className="text-[10px] font-black text-white">sragul2007</p>
            <p className="text-[8px] text-muted">2 hours ago</p>
          </div>
        </div>
        <p className="text-xs text-gray-300">Just finished compiling my first Next.js 15 template on the server! Fast performance.</p>
        <div className="flex gap-4 text-[9px] text-muted font-bold">
          <span>❤️ 24 Likes</span>
          <span>💬 4 Comments</span>
        </div>
      </div>
    )
  }
]

export default function ProductTour() {
  const [activeTab, setActiveTab] = useState('planner')
  const currentTour = tours.find(t => t.key === activeTab) || tours[0]

  return (
    <section className="py-24 relative overflow-hidden bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-4">
            Interactive Product Tour
          </h2>
          <p className="text-muted text-sm sm:text-base font-medium">
            Explore the core workspaces of AcademicOS and see how the platform manages study parameters in real time.
          </p>
        </div>

        {/* Dynamic workspace wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/30 p-8 rounded-[32px] border border-white/5 shadow-2xl">
          
          {/* Navigation Controls */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {tours.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 flex items-center justify-between group ${
                  activeTab === t.key 
                    ? 'bg-white/5 border-white/10 shadow-lg' 
                    : 'border-transparent hover:bg-white/5 text-muted hover:text-white'
                }`}
              >
                <div>
                  <h4 className={`font-display font-black text-sm ${activeTab === t.key ? 'text-white' : 'text-gray-400'}`}>
                    {t.title}
                  </h4>
                  <p className="text-[10px] text-muted mt-0.5">{t.subtitle}</p>
                </div>
                <span 
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{ backgroundColor: activeTab === t.key ? t.color : 'rgba(255,255,255,0.1)' }}
                />
              </button>
            ))}
          </div>

          {/* Details / Preview Pane */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Visual preview */}
            <div className="md:col-span-7 flex justify-center">
              <div className="w-full max-w-[340px] aspect-square glass-premium border border-white/10 rounded-[20px] shadow-2xl overflow-hidden flex flex-col justify-center">
                {currentTour.mockup}
              </div>
            </div>

            {/* Description list */}
            <div className="md:col-span-5 text-left flex flex-col items-start">
              <h3 className="font-display font-black text-xl text-white mb-2">{currentTour.title}</h3>
              <p className="text-muted text-xs leading-relaxed mb-6 font-medium">{currentTour.desc}</p>
              
              <div className="space-y-2">
                {currentTour.bullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {b}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
