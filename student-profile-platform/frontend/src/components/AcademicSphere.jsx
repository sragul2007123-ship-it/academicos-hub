import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, OrbitControls, Float, Stars } from '@react-three/drei'

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere visible args={[1, 64, 64]} scale={2}>
        <MeshDistortMaterial
          color="#00FFC6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {/* Orbiting Objects (Skills, Projects, etc.) */}
      <OrbitingRing radius={3} speed={0.5} color="#00D4FF" />
      <OrbitingRing radius={4} speed={-0.3} color="#FFD166" />
      <OrbitingRing radius={5} speed={0.2} color="#F8FAFC" />
    </Float>
  )
}

function OrbitingRing({ radius, speed, color }) {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.y += speed * 0.01
    ref.current.rotation.z += speed * 0.005
  })

  return (
    <group ref={ref}>
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-radius, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

export default function AcademicSphere() {
  return (
    <div className="w-full h-full min-h-[500px] relative z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#00D4FF" intensity={2} />
        <pointLight position={[10, -10, 10]} color="#00FFC6" intensity={2} />
        
        <AnimatedSphere />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
