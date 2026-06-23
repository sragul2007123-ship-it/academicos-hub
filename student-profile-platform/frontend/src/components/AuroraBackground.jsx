import React from 'react'
import { motion } from 'framer-motion'

export default function AuroraBackground({ children }) {
  return (
    <div className="relative min-h-screen bg-[var(--background)] overflow-hidden w-full">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vh] rounded-full opacity-[0.15] blur-[100px]"
          style={{ backgroundColor: 'var(--emerald)' }}
        />
        <motion.div
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] rounded-full opacity-[0.15] blur-[120px]"
          style={{ backgroundColor: 'var(--cyan)' }}
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 100, -100, 0],
            scale: [1, 1.3, 0.7, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[40%] w-[30vw] h-[30vh] rounded-full opacity-[0.1] blur-[80px]"
          style={{ backgroundColor: 'var(--gold)' }}
        />
      </div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  )
}
