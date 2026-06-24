import React, { useEffect, useState } from 'react'

export default function AnimatedCounter({value=0}:{value:number}){
  const [n, setN] = useState(0)
  useEffect(()=>{
    let raf:number|undefined
    const start = performance.now()
    const from = n
    const dur = 800
    const tick = (t:number)=>{
      const p = Math.min(1,(t-start)/dur)
      setN(Math.round(value * p))
      if(p<1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      if (raf) cancelAnimationFrame(raf)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value])
  return <span className="font-semibold text-2xl">{n}</span>
}
