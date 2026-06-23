import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, glow = false }) {
  const hoverStyles = hover ? {
    y: -5,
    transition: { duration: 0.3 }
  } : {}

  return (
    <motion.div
      whileHover={hoverStyles}
      className={`relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-[var(--glass)] border border-[var(--border)] shadow-2xl transition-shadow duration-500 ${glow ? 'hover:shadow-[0_0_30px_rgba(0,255,198,0.1)] hover:border-[var(--emerald)]' : ''} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--emerald)] via-transparent to-transparent opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  )
}
