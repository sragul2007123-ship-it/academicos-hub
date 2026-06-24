import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function LivingBackground() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([])

  useEffect(() => {
    // Generate background floating particles
    const list = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 6
    }))
    setParticles(list)

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 100)
      mouseY.set(e.clientY - 100)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#030303]">
      {/* Dynamic Gradient Mesh */}
      <div className="absolute inset-0 mesh-grid opacity-[0.3]" />
      
      {/* Noise Texture Layer */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#FFD166]/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Mouse Reactive Lighting (Spotlight Glowing Orb) */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full blur-[80px] bg-[#00FFC6]/25 mix-blend-screen"
        style={{
          x: springX,
          y: springY,
        }}
      />

      {/* Static Blur Orbs / Aurora Waves */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00FFC6]/10 blur-[120px] animate-aurora-wave" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#00D4FF]/10 blur-[130px] animate-aurora-wave" style={{ animationDelay: '-10s' }} />
      <div className="absolute top-[30%] right-[15%] w-[35vw] h-[35vw] rounded-full bg-[#FFD166]/5 blur-[110px] animate-aurora-wave" style={{ animationDelay: '-5s' }} />
    </div>
  )
}
