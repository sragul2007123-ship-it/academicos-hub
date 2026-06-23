import Link from 'next/link'
import { motion } from 'framer-motion'

export default function MagneticButton({children, href, primary}:{children:any; href:string; primary?:boolean}){
  return (
    <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
      <Link href={href}><a className="inline-flex items-center px-5 py-3 rounded-md" style={{background:primary? 'linear-gradient(90deg,var(--emerald),var(--cyan))':'transparent', color: primary? 'black' : 'var(--text)', boxShadow: primary? '0 6px 30px rgba(0,212,255,0.08)':'none'}}>{children}</a></Link>
    </motion.div>
  )
}
