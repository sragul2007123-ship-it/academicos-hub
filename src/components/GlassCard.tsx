import React from 'react'

type Props = {
  title?: string
  value?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export default function GlassCard({title, value, children, className=''}: Props){
  return (
    <div className={`glass glass-glow p-4 ${className}`} style={{borderRadius:12}}>
      {title && <div className="text-sm text-muted mb-2" style={{color:'var(--muted)'}}>{title}</div>}
      {value ? <div className="text-2xl font-semibold mb-2">{value}</div> : null}
      <div>{children}</div>
    </div>
  )
}

