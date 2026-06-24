import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, HelpCircle, ChevronDown } from 'lucide-react'

const pricingTiers = [
  {
    name: 'Scholar Base',
    price: '$0',
    desc: 'The baseline OS features for standard students.',
    features: [
      'Personal portfolio workspace',
      'Standard Study Planner',
      'Basic Attendance tracking',
      'Social discussion feed access'
    ],
    cta: 'Get Started',
    color: 'rgba(255,255,255,0.05)',
    popular: false
  },
  {
    name: 'Scholar Pro',
    price: '$12',
    desc: 'Premium analytical features for candidates aiming for placement campaigns.',
    features: [
      'Custom subdomain custom URL',
      'Verified academic badges',
      'GPA prediction & bunk thresholds',
      'Mellow AI Resume Builder (PDF/DOCX)',
      'Priority notes marketplace downloads'
    ],
    cta: 'Upgrade to Pro',
    color: '#00FFC6',
    popular: true
  }
]

const faqs = [
  {
    q: 'How does the Academic Identity Score work?',
    a: 'Your Identity Score is computed based on your profile completeness. Adding verified items like projects, skill tags, college details, and certificates increases the rating to make you visible to recruiters.'
  },
  {
    q: 'Can Mellow AI co-pilot integrate with my lecture schedules?',
    a: 'Yes! Once you set up your attendance parameters and subjects, the co-pilot calculates how many classes you can safety bunk to stay above the 75% limit.'
  },
  {
    q: 'How do I download documents from the Notes Marketplace?',
    a: 'Go to the Marketplace module, search for your class topic, review the ratings left by other students, and click the Get button to save the notes PDF.'
  }
]

export default function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className="py-24 relative overflow-hidden bg-black/20 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Pricing Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-4">
            Transparent Scaling Plans
          </h2>
          <p className="text-muted text-sm sm:text-base font-medium">
            Choose the right tier to configure your academic command center.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
          {pricingTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-[32px] border text-left flex flex-col justify-between relative transition-all duration-300 ${
                tier.popular 
                  ? 'bg-gradient-to-b from-[#00FFC6]/10 to-[#030303] border-[#00FFC6]/40 shadow-2xl shadow-[#00FFC6]/5' 
                  : 'glass border-white/5'
              }`}
            >
              {tier.popular && (
                <span className="absolute top-5 right-5 px-3 py-1 bg-[#00FFC6] text-black text-[9px] font-black uppercase rounded-full tracking-widest shadow-md">
                  POPULAR CHOICE
                </span>
              )}
              <div>
                <h3 className="font-display font-black text-xl text-white mb-2">{tier.name}</h3>
                <p className="text-muted text-xs font-medium mb-6">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-muted text-xs">/ month</span>
                </div>
                
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                      <Check className="w-4 h-4 text-[#FFD166] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button className={`w-full py-4 rounded-[14px] font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                tier.popular 
                  ? 'bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-[#FFD166]/20 shadow-lg' 
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="h-hero text-2xl sm:text-4xl font-black text-white">Frequently Asked Questions</h3>
        </div>

        {/* FAQ Accordions */}
        <div className="max-w-2xl mx-auto space-y-3 text-left">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl border border-white/5 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 flex justify-between items-center text-xs font-black text-white hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-3"><HelpCircle className="w-4 h-4 text-[#00FFC6]" /> {faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-black/10 border-t border-white/5"
                  >
                    <p className="p-5 text-xs leading-relaxed text-muted font-medium">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
