import React from 'react'

export default function HallOfFame(){
  return (
    <div className="glass p-6 glass-glow">
      <h3 className="text-xl font-semibold">Hall Of Fame</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="glass p-4">Gold Podium</div>
        <div className="glass p-4">Silver Podium</div>
        <div className="glass p-4">Bronze Podium</div>
      </div>
    </div>
  )
}
