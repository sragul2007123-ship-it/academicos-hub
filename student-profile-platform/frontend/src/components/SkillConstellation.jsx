import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Line, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function Constellation({ skills }) {
  const groupRef = useRef()

  // Generate stable random positions for each skill based on their name to avoid jumpiness
  const nodes = useMemo(() => {
    return skills.map((skill, i) => {
      // Create a deterministic pseudo-random distribution
      const seed = skill.skill_name ? skill.skill_name.length : i
      const radius = 3 + (seed % 2)
      const theta = (i / skills.length) * Math.PI * 2
      const phi = (Math.PI / 4) + (i % 3) * 0.5
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.cos(phi)
      const z = radius * Math.sin(phi) * Math.sin(theta)

      return {
        ...skill,
        position: new THREE.Vector3(x, y, z)
      }
    })
  }, [skills])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={groupRef}>
      {/* Draw connections between nearby skills */}
      {nodes.map((nodeA, i) => 
        nodes.slice(i + 1).map((nodeB, j) => {
          const distance = nodeA.position.distanceTo(nodeB.position)
          if (distance < 5) {
            return (
              <Line
                key={`${i}-${j}`}
                points={[nodeA.position, nodeB.position]}
                color="#00FFC6"
                opacity={0.2}
                lineWidth={1}
                transparent
              />
            )
          }
          return null
        })
      )}

      {/* Draw skill nodes */}
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <Sphere args={[0.1, 16, 16]}>
            <meshStandardMaterial color="#00FFC6" emissive="#00FFC6" emissiveIntensity={2} />
          </Sphere>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.25}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {node.skill_name || node.name}
          </Text>
        </group>
      ))}
    </group>
  )
}

export default function SkillConstellation({ skills = [] }) {
  if (!skills || skills.length === 0) return (
    <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
      No skills added yet to form a constellation.
    </div>
  )

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden bg-transparent cursor-move">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00FFC6" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00D4FF" />
        <Constellation skills={skills} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
