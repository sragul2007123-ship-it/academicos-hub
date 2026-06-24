import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Calendar } from 'lucide-react'

export default function AnalyticsShowcase() {
  const [activeTab, setActiveTab] = useState<'study' | 'attendance'>('study')

  return (
    <section className="py-24 relative overflow-hidden bg-black/20 border-b border-white/5">
      <div className="absolute bottom-[-10%] left-[-10%] w-[320px] h-[320px] rounded-full bg-[#00D4FF]/5 blur-[90px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column: Analytics mockups */}
        <div className="lg:col-span-7 w-full flex flex-col items-center">
          
          {/* Card workspace */}
          <div className="w-full max-w-[540px] glass-premium rounded-[24px] border border-white/10 p-6 shadow-2xl text-left">
            
            {/* Header / Tabs */}
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#FFD166]" />
                Live Performance Engine
              </h3>
              <div className="flex gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setActiveTab('study')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'study' ? 'bg-[#00FFC6] text-white' : 'text-muted hover:text-white'
                  }`}
                >
                  Study Hours
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    activeTab === 'attendance' ? 'bg-[#00FFC6] text-white' : 'text-muted hover:text-white'
                  }`}
                >
                  Attendance Check
                </button>
              </div>
            </div>

            {/* Tab views */}
            {activeTab === 'study' ? (
              <div className="space-y-6">
                
                {/* Stats block */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Time</p>
                    <p className="text-lg font-black text-white mt-1">42.5 hrs</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Daily Avg</p>
                    <p className="text-lg font-black text-[#FFD166] mt-1">6.1 hrs</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Efficiency</p>
                    <p className="text-lg font-black text-green-400 mt-1">94%</p>
                  </div>
                </div>

                {/* Graph mockup */}
                <div className="space-y-3.5">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Focus Duration Distribution</p>
                  <div className="h-32 flex items-end gap-3 pt-6 border-b border-white/5">
                    {[35, 60, 45, 90, 75, 55, 80].map((h, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full rounded-t-lg bg-gradient-to-t from-[#00FFC6] to-[#FFD166] relative" style={{ height: `${h}%` }}>
                          {/* hover tooltips */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-white text-black font-black text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {Math.round((h/10))}h
                          </div>
                        </div>
                        <span className="text-[9px] text-muted font-bold">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Attendance gauges */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Linear Algebra</p>
                      <p className="text-lg font-black text-white mt-1">87%</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold border border-green-500/20">Safe</span>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Compiler Design</p>
                      <p className="text-lg font-black text-red-400 mt-1">72%</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20">Critical</span>
                  </div>
                </div>

                {/* Progress trackers */}
                <div className="space-y-4">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Target Thresholds (75% Minimum)</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-300 mb-1">
                        <span>Overall Classes attended</span>
                        <span>42 / 48 (87.5%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#00FFC6] to-[#FFD166] rounded-full" style={{ width: '87.5%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-300 mb-1">
                        <span>Buffer room before limit (Bunk safety)</span>
                        <span>6 lectures remaining</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
            
            {/* Footer metric summary */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-muted uppercase">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated 2m ago</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-green-400" /> GPA project: +0.2</span>
            </div>

          </div>
        </div>

        {/* Right column: Text copy */}
        <div className="lg:col-span-5 text-left flex flex-col items-start lg:pl-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFD166]/30 bg-[#FFD166]/10 text-[#FFD166] text-xs font-black uppercase tracking-wider mb-6">
            <TrendingUp className="w-3.5 h-3.5" />
            Advanced Analytics Engine
          </div>
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-6">
            Make Better Academic Decisions
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-medium">
            Stop guessing your bunk limits or semester grades. Our predictive analytics module parses your daily study durations and current marks to calculate bunk thresholds and recommend grade targets.
          </p>
          <ul className="space-y-3 text-xs text-gray-300 font-bold">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
              Detailed study hour heatmaps
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
              Predictive GPA trajectory calculation
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166]" />
              Bunk safety margin thresholds
            </li>
          </ul>
        </div>

      </div>
    </section>
  )
}
