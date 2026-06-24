import React from 'react'
import { Star } from 'lucide-react'

const list = [
  {
    name: "Rachel Green",
    role: "Computer Science Graduate",
    quote: "AcademicOS transformed my college career. Instead of a standard resume, I shared my public identity profile with recruiters. I had 3 interviews within a week!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel"
  },
  {
    name: "Devon Chen",
    role: "Software Engineering Student",
    quote: "The attendance buffer calculator saved me. I always know exactly how many classes I can miss without dropping below the 75% limit. The AI planner co-pilot is incredible.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devon"
  },
  {
    name: "Sanya Malhotra",
    role: "AI/ML Undergraduate",
    quote: "Being ranked #3 on the Hall of Fame leaderboard gave me direct visibility to high-tier startup founders. The gamified XP checks kept me focused and motivated.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya"
  }
]

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-4">
            Endorsed by Top Scholars
          </h2>
          <p className="text-muted text-sm sm:text-base font-medium">
            Hear from students who built premium digital resumes and accelerated their placement preparations.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((t, i) => (
            <div 
              key={i} 
              className="glass p-6 rounded-[24px] border border-white/5 flex flex-col justify-between hover:border-primary/20 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-4 text-[#FFD166]">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-xs leading-relaxed italic mb-6 font-medium">
                  "{t.quote}"
                </p>
              </div>

              {/* User details */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img src={t.avatar} className="w-9 h-9 rounded-full bg-white/5" alt={t.name} />
                <div className="text-left">
                  <p className="text-xs font-black text-white">{t.name}</p>
                  <p className="text-[10px] text-muted">{t.role}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
