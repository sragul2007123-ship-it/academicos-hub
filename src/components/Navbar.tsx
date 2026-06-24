import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass p-3 flex items-center justify-between glass-glow rounded-[16px] border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#00FFC6,#00D4FF)' }}>
          <span className="text-white font-bold text-sm">Ω</span>
        </div>
        <span className="font-display font-black text-lg text-white tracking-wide">academicos</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/mission-control" className="hover:text-white transition-colors">Mission Control</Link>
        <Link href="/identity-hub" className="hover:text-white transition-colors">Identity Hub</Link>
        <Link href="/hall-of-fame" className="hover:text-white transition-colors">Hall Of Fame</Link>
      </nav>

      <div>
        <Link href="/mission-control" className="px-5 py-2 text-xs font-bold text-black bg-white hover:bg-white/90 rounded-[12px] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Launch App
        </Link>
      </div>
    </header>
  )
}
