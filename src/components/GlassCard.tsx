type Props = {title:string; value?:string}
export default function GlassCard({title,value}:Props){
  return (
    <div className="glass p-4 shadow-sm">
      <div className="text-sm text-muted" style={{color:'var(--muted)'}}>{title}</div>
      <div className="mt-2 text-2xl font-semibold" style={{color:'var(--text)'}}>{value ?? '—'}</div>
    </div>
  )
}
