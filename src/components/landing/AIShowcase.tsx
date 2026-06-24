import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Sparkles } from 'lucide-react'

const samplePrompts = [
  "Calculate my GPA projection",
  "Write an internship cold email",
  "Summarize AIML equations"
]

const responses: Record<string, string> = {
  "Calculate my GPA projection": "Sure! Based on your current 8.4 CGPA and target of 9.0 next semester, you need a minimum of 3 'O' grades (10 points) and 2 'A+' grades (9 points) across your 5 core subjects.",
  "Write an internship cold email": "Hi [Lead Developer Name],\n\nI recently built a real-time 3D portfolio using React Three Fiber, showcasing my machine learning and web projects. With my verified 88/100 Identity Score on AcademicOS, I am seeking a summer frontend engineering internship. I'd love to share my work...",
  "Summarize AIML equations": "Here are the core equations:\n1. Gradient Descent: θ = θ - α * ∇J(θ)\n2. Linear Regression Hypothesis: h_θ(x) = θ^T * x\n3. Logistic Sigmoid: g(z) = 1 / (1 + e^-z)"
}

export default function AIShowcase() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Hello! I am Mellow AI. Try picking one of the prompts below to see how I help you build your portfolio & manage studies." }
  ])
  const [typing, setTyping] = useState(false)
  const [inputVal, setInputVal] = useState('')

  const handlePromptClick = (prompt: string) => {
    if (typing) return
    setMessages(prev => [...prev, { sender: 'user', text: prompt }])
    setTyping(true)

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: responses[prompt] || "I am analyzing your profile data to draft a response..." }])
      setTyping(false)
    }, 1500)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputVal.trim() || typing) return
    const text = inputVal
    setMessages(prev => [...prev, { sender: 'user', text }])
    setInputVal('')
    setTyping(true)

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: "Analyzing academic database... Based on your profile history, I recommend connecting with Dr. Maya and completing the Compiler Design task to raise your identity score." }])
      setTyping(false)
    }, 1500)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-black/40 border-b border-white/5">
      <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#00FFC6]/5 blur-[90px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left column: Text copy */}
        <div className="lg:col-span-5 text-left flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00FFC6]/30 bg-[#00FFC6]/10 text-[#00FFC6] text-xs font-black uppercase tracking-wider mb-6">
            <Bot className="w-3.5 h-3.5" />
            Mellow AI Co-Pilot
          </div>
          <h2 className="h-hero text-3xl sm:text-5xl font-black text-white mb-6">
            An Intelligent Partner For Your Journey
          </h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-8 font-medium">
            Mellow AI is deeply integrated into your command center. It analyzes your attendance ratios, recommends specific skills matching market demand, drafts ATS resumes, and explains complex math topics instantly.
          </p>

          <div className="space-y-3.5 w-full">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">Try a simulated command</p>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(p)}
                className="w-full text-left p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-between group"
              >
                <span>{p}</span>
                <span className="text-[#FFD166] opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Interactive chatbot layout */}
        <div className="lg:col-span-7 w-full flex justify-center">
          <div className="w-full max-w-[540px] aspect-[4/3] glass-premium rounded-[24px] border border-white/10 overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Header bar */}
            <div className="p-4 border-b border-white/5 bg-black/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00FFC6]/15 flex items-center justify-center text-[#00FFC6] border border-[#00FFC6]/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Mellow AI Agent</p>
                  <p className="text-[9px] text-green-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    Online & Context-Aware
                  </p>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-[#FFD166] animate-pulse-glow" />
            </div>

            {/* Message Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[260px] scrollbar-hide text-left">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : ''}`}>
                  {m.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[#00FFC6]/10 flex items-center justify-center text-[#00FFC6] shrink-0 text-xs font-bold border border-[#00FFC6]/10">
                      AI
                    </div>
                  )}
                  <div className={`p-3.5 rounded-[14px] text-xs font-medium max-w-[80%] leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-[#00FFC6] text-white rounded-tr-none text-left' 
                      : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none whitespace-pre-line'
                  }`}>
                    {m.text}
                  </div>
                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-[#FFD166]/10 flex items-center justify-center text-[#FFD166] shrink-0 text-xs font-bold border border-[#FFD166]/10">
                      U
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 rounded-lg bg-[#00FFC6]/10 flex items-center justify-center text-[#00FFC6] shrink-0 text-xs font-bold">AI</div>
                  <div className="flex gap-1 bg-white/5 p-3 rounded-[14px] border border-white/5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Neural waveform display when active */}
            <div className="px-5 py-2.5 border-t border-white/5 bg-black/10 flex items-center gap-3">
              <span className="text-[10px] text-muted font-bold">Neural Glow Waveform:</span>
              <div className="flex gap-1 items-center">
                <span className="wave-bar" style={{ animationDelay: '0.1s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.4s', animationDuration: '0.8s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.6s' }} />
                <span className="wave-bar" style={{ animationDelay: '0.3s', animationDuration: '1s' }} />
              </div>
            </div>

            {/* Prompt input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/30 flex gap-3">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Ask Mellow AI anything..."
                className="flex-1 bg-[#030303] text-xs font-semibold px-4 py-3 rounded-xl border border-white/5 focus:border-[#00FFC6]/50 focus:ring-1 focus:ring-[#00FFC6] outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-white hover:bg-white/90 text-black flex items-center justify-center transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}
