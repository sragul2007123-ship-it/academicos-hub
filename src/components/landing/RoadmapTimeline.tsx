import React from 'react'

const phases = [
  {
    phase: "Phase 01",
    title: "Identity Layer (Done)",
    desc: "Complete portfolio customization, custom banner uploads, skill constellation charts, and verified badges.",
    status: "done"
  },
  {
    phase: "Phase 02",
    title: "Intelligence Hub (Active)",
    desc: "Predictive GPA trajectories, bunk limit checkers, AI chat co-pilot with markdown streaming and waveform analysis.",
    status: "active"
  },
  {
    phase: "Phase 03",
    title: "Collaboration & Marketplace (Releasing)",
    desc: "Upload/download course guides, follow star creators, review rating stats, write social learning discussion feeds.",
    status: "releasing"
  },
  {
    phase: "Phase 04",
    title: "Recruiter Vetting Network (Future)",
    desc: "Decentralized internship pipelines, peer endorsement mechanisms, and recruiter-focused dashboard metrics.",
    status: "planned"
  }
]

export default function RoadmapTimeline() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-4">
            Platform Roadmap
          </h2>
          <p className="text-muted text-sm sm:text-base font-medium">
            Take a look at what we are building to make AcademicOS the premier student system in the world.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {phases.map((p, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-[24px] border relative transition-all duration-300 ${
                p.status === 'active' 
                  ? 'bg-gradient-to-b from-[#00FFC6]/10 to-[#030303] border-[#00FFC6]/40 shadow-2xl shadow-[#00FFC6]/5' 
                  : 'glass border-white/5'
              }`}
            >
              {/* Badge */}
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                p.status === 'done' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                p.status === 'active' ? 'bg-[#00FFC6]/20 text-[#00FFC6] border border-[#00FFC6]/30' :
                p.status === 'releasing' ? 'bg-[#FFD166]/10 text-[#FFD166] border border-[#FFD166]/20' :
                'bg-white/5 text-gray-500 border border-white/5'
              }`}>
                {p.status}
              </span>

              <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mt-4">{p.phase}</h4>
              <h3 className="font-display font-black text-lg text-white mt-1 mb-3">{p.title}</h3>
              <p className="text-muted text-xs leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
