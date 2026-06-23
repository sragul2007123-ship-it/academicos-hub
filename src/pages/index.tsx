import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'

const HeroSphere = dynamic(()=>import('../components/HeroSphere'),{ssr:false})
import GlassCard from '../components/GlassCard'
import MagneticButton from '../components/MagneticButton'

export default function Home(){
  return (
    <>
      <Head>
        <title>academicos — Become Impossible To Ignore</title>
        <meta name="description" content="academicos — premium student identity platform" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-8" style={{backgroundColor:'var(--bg)'}}>
        <div className="max-w-6xl w-full grid grid-cols-12 gap-6">
          <section className="col-span-7 p-8">
            <h1 className="h-hero text-6xl md:text-8xl leading-tight">Become Impossible To Ignore.</h1>
            <p className="mt-6 text-muted text-lg text-muted" style={{color:'var(--muted)'}}>Transform your achievements, skills, certifications, projects, internships, and learning journey into a powerful digital identity.</p>

            <div className="mt-8 flex gap-4">
              <MagneticButton href="#" primary>Start Building Your Identity</MagneticButton>
              <Link href="#"><a className="text-sm text-muted self-center" style={{color:'var(--muted)'}}>Explore Demo</a></Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <GlassCard title="Academic Identity Score" value="84" />
              <GlassCard title="Placement Readiness" value="72%" />
              <GlassCard title="Skill Growth" value="+18%" />
            </div>
          </section>

          <aside className="col-span-5 flex items-center justify-center">
            <div className="w-full h-96 glass p-4 flex items-center justify-center">
              <HeroSphere />
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
