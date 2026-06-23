import { Canvas } from '@react-three/fiber'
import { useRef } from 'react'

function DummySphere(){
  return (
    <mesh>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#00D4FF" metalness={0.6} roughness={0.1} emissive={'#00384d'} emissiveIntensity={0.2} />
    </mesh>
  )
}

export default function HeroSphere(){
  return (
    <Canvas camera={{position:[0,0,5], fov:45}} style={{width:'100%', height:'100%'}}>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={0.6} position={[5,5,5]} />
      <DummySphere />
    </Canvas>
  )
}
