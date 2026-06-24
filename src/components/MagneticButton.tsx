import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  primary?: boolean
  className?: string
}

export default function MagneticButton({ children, href, onClick, primary, className = '' }: MagneticButtonProps) {
  const content = (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
        primary 
          ? 'bg-[#FFD166] text-black shadow-lg shadow-[#FFD166]/25' 
          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
      } ${className}`}
    >
      {children}
    </motion.button>
  )

  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        {content}
      </Link>
    )
  }

  return content
}
