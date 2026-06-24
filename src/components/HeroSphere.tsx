import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

function AuroraSphere({ pointer }: { pointer: { x: number; y: number } }){
  const mesh = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    // gentle rotation influenced by pointer
    mesh.current.rotation.y += (pointer.x * 0.6 - mesh.current.rotation.y) * 0.05
    mesh.current.rotation.x += (pointer.y * 0.3 - mesh.current.rotation.x) * 0.05
  })

  return (
    <group ref={mesh}>
      <mesh>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial color="#071229" metalness={0.6} roughness={0.05} emissive={'#002433'} emissiveIntensity={0.12} envMapIntensity={0.4} transparent opacity={0.98} />
      </mesh>

      {/* thin emissive shell to simulate aurora glow */}
      <mesh>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshBasicMaterial toneMapped={false} color={new THREE.Color('#00D4FF')} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* inner core glow */}
      <mesh>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshStandardMaterial color="#002C35" emissive={'#00FFC6'} emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Particles({ count=120 }:{count?:number}){
  const points = useMemo(()=>{
    const arr = [] as [number,number,number][]
    for(let i=0;i<count;i++){
      const r = 1.6 + Math.random()*1.6
      const theta = Math.random()*Math.PI*2
      const phi = (Math.random()-0.5)*Math.PI
      arr.push([Math.cos(theta)*Math.cos(phi)*r, Math.sin(phi)*r*0.7, Math.sin(theta)*Math.cos(phi)*r])
    }
    return arr
  },[count])

  return (
    <group>
      {points.map((p,i)=> (
        <mesh key={i} position={p as any}>
          <sphereGeometry args={[0.02 + Math.random()*0.03, 8, 8]} />
          <meshBasicMaterial color={i%3===0? '#00FFC6' : (i%3===1? '#00D4FF' : '#FFD166')} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function OrbitingCards(){
  const group = useRef<THREE.Group>(null!)
  useFrame((state, delta)=>{
    group.current.rotation.y += 0.01 * delta * 60
  })
  const cards = ['Skills','Projects','Certs','Achievements','Internships']
  return (
    <group ref={group}>
      {cards.map((c,i)=>{
        const a = (i/ cards.length) * Math.PI*2
        const r = 2.1
        const pos:[number,number,number] = [Math.cos(a)*r, (i%2===0?0.1:-0.1), Math.sin(a)*r]
        return (
          <mesh key={i} position={pos} rotation={[0, -a + Math.PI/2, 0]}>
            <planeGeometry args={[0.56, 0.34]} />
            <meshStandardMaterial color="#071229" transparent opacity={0.9} metalness={0.2} roughness={0.4} emissive={'#001B22'} emissiveIntensity={0.02} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function HeroSphere(){
  const [pointer, setPointer] = useState({x:0,y:0})
  return (
    <Canvas camera={{position:[0,0,6], fov:40}} style={{width:'100%', height:'100%'}} onPointerMove={(e)=>{
      // normalize pointer to [-1,1]
      setPointer({x:(e.clientX / window.innerWidth) * 2 -1, y: (e.clientY / window.innerHeight)*2 -1})
    }}>
      <color attach="background" args={["#030303"]} />
      <ambientLight intensity={0.6} />
      <pointLight position={[5,5,5]} intensity={0.8} />
      <directionalLight position={[-5,2,5]} intensity={0.4} />

      <AuroraSphere pointer={pointer} />
      <Particles count={140} />
      <OrbitingCards />

      {/* no external OrbitControls to avoid drei dependency; scene is static */}
    </Canvas>
  )
}
