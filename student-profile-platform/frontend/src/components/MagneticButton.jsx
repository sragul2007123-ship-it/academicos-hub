import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function MagneticButton({ children, to, onClick, className = '', variant = 'primary' }) {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 })
  }

  const reset = () => {
    setPosition({ x: 0, y: 0 })
  }

  const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold transition-colors duration-300 overflow-hidden group"
  const variants = {
    primary: "bg-[var(--emerald)] text-[var(--background)] hover:bg-[var(--cyan)] shadow-[0_0_20px_rgba(0,255,198,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]",
    secondary: "border border-[var(--border)] bg-[var(--glass)] text-[var(--text)] hover:border-[var(--emerald)] hover:text-[var(--emerald)]",
    ghost: "text-[var(--muted)] hover:text-[var(--text)]"
  }

  const content = (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )

  if (to) {
    return <Link to={to} className="inline-block">{content}</Link>
  }

  return content
}
