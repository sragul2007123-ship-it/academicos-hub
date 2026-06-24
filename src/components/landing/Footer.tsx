import React from 'react'

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black/40 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#00FFC6,#00D4FF)' }}>
            <span className="text-white font-bold text-xs">Ω</span>
          </div>
          <span className="font-display font-black text-lg text-white tracking-wide">academicos</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-muted">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#tours" className="hover:text-white transition-colors">Workspace</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
        </div>

        {/* Copyright info */}
        <div>
          <p className="text-[10px] text-muted font-medium">
            &copy; {new Date().getFullYear()} academicos Inc. Become Impossible To Ignore.
          </p>
        </div>

      </div>
    </footer>
  )
}
