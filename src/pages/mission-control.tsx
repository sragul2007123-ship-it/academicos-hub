import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Flame, User, BookOpen, Calendar, Calculator, 
  CheckCircle2, Send, Plus, Trash2, ArrowUpRight, Award, 
  Edit3, Heart, MessageSquare, Download, Share2, Upload, 
  ChevronRight, Sparkles, Star, Shield, HelpCircle, BarChart3, Check
} from 'lucide-react'
import { useAcademicStore, PlannerTask } from '../store/academicStore'
import LivingBackground from '../components/LivingBackground'

export default function MissionControl() {
  const {
    xp, level, streak, activeTab, tasks, posts, notes, profile,
    setActiveTab, addXP, addTask, toggleTask, addPost, likePost, addComment, uploadNote, updateProfile
  } = useAcademicStore()

  // State for adding items
  const [newPostText, setNewPostText] = useState('')
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>({})
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [newNoteSubject, setNewNoteSubject] = useState('AIML')
  const [newPlannerText, setNewPlannerText] = useState('')
  const [newPlannerReward, setNewPlannerReward] = useState(100)

  // AI assistant state
  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: "Welcome to Mellow AI Co-pilot! I can predict your GPA, audit your attendance, or draft an email. What's on your mind?" }
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)

  // GPA calculation state
  const [grades, setGrades] = useState<Record<string, number>>({
    "Machine Learning": 9,
    "Compiler Design": 8,
    "Web Development": 10,
    "Computer Networks": 8,
    "Soft Skills": 9
  })

  // Attendance tracker state
  const [attendance, setAttendance] = useState<Record<string, { attended: number; total: number }>>({
    "Machine Learning": { attended: 18, total: 20 },
    "Compiler Design": { attended: 12, total: 17 },
    "Web Development": { attended: 22, total: 23 },
    "Computer Networks": { attended: 14, total: 18 },
    "Soft Skills": { attended: 10, total: 10 }
  })

  // Resume builder state
  const [resumeData, setResumeData] = useState({
    name: 'Sragul Ragunathan',
    email: 'sragul@example.com',
    college: 'Vellore Institute of Technology',
    degree: 'B.Tech in Computer Science',
    skills: 'Next.js 15, TypeScript, React Three Fiber, Machine Learning',
    experience: 'AcademicOS - Built 3D visual constellation identity platform.'
  })
  const [selectedTemplate, setSelectedTemplate] = useState('ats')
  const [resumeExported, setResumeExported] = useState(false)

  // Attendance update handler
  const adjustAttendance = (subject: string, type: 'attended' | 'total', amount: number) => {
    setAttendance(prev => {
      const current = prev[subject]
      const nextAttended = type === 'attended' ? Math.max(0, current.attended + amount) : current.attended
      const nextTotal = type === 'total' ? Math.max(nextAttended, current.total + amount) : Math.max(nextAttended, current.total + (amount > 0 ? amount : 0))
      return {
        ...prev,
        [subject]: { attended: nextAttended, total: nextTotal }
      }
    })
  }

  // GPA update handler
  const updateGrade = (subject: string, val: number) => {
    setGrades(prev => ({ ...prev, [subject]: val }))
  }

  const calculatedGPA = () => {
    const list = Object.values(grades)
    const avg = list.reduce((a, b) => a + b, 0) / list.length
    return avg.toFixed(2)
  }

  // Mellow AI Send handler
  const sendAiQuery = (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiInput.trim() || aiTyping) return
    const text = aiInput
    setAiMessages(prev => [...prev, { sender: 'user', text }])
    setAiInput('')
    setAiTyping(true)

    setTimeout(() => {
      let responseText = "Analyzing parameters... I suggest focusing on Compiler Design. Your attendance is currently at 70.5% which is below the bunk limit threshold. Complete 2 assignments to recover."
      if (text.toLowerCase().includes('gpa') || text.toLowerCase().includes('grade')) {
        responseText = `Based on your grade estimates, your predicted GPA is ${calculatedGPA()}. To boost this to a 9.5, try upgrading networks from A to A+.`
      } else if (text.toLowerCase().includes('resume') || text.toLowerCase().includes('cv')) {
        responseText = "I've optimized your Resume summary: 'High-performing B.Tech candidate at VIT with verified Next.js and Three.js competencies.' Go to the Resume tab to download."
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: responseText }])
      setAiTyping(false)
    }, 1200)
  }

  // Add task handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlannerText.trim()) return
    addTask(newPlannerText, newPlannerReward)
    setNewPlannerText('')
  }

  // Add post handler
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostText.trim()) return
    addPost(newPostText)
    setNewPostText('')
  }

  // Add comment handler
  const handleAddComment = (postId: number) => {
    const text = newCommentText[postId]
    if (!text || !text.trim()) return
    addComment(postId, text)
    setNewCommentText(prev => ({ ...prev, [postId]: '' }))
  }

  // Add note marketplace handler
  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteTitle.trim()) return
    uploadNote(newNoteTitle, newNoteSubject)
    setNewNoteTitle('')
    addXP(100) // Award XP for note upload
  }

  // Sidebar navigation options
  const sidebarItems = [
    { key: 'overview', label: 'Overview', icon: Trophy },
    { key: 'planner', label: 'Study Planner', icon: CheckCircle2 },
    { key: 'attendance', label: 'Attendance Check', icon: Calendar },
    { key: 'gpa', label: 'GPA Projection', icon: Calculator },
    { key: 'assignments', label: 'Assignments', icon: Calendar },
    { key: 'exams', label: 'Exams Scheduling', icon: Trophy },
    { key: 'analytics', label: 'Analytics Hub', icon: BarChart3 },
    { key: 'ai', label: 'Mellow AI Co-pilot', icon: Sparkles },
    { key: 'notes', label: 'Creator Desk', icon: Edit3 },
    { key: 'marketplace', label: 'Notes Market', icon: BookOpen },
    { key: 'social', label: 'Student Social', icon: MessageSquare },
    { key: 'profile', label: 'Custom Profile', icon: User }
  ]

  const threshold = level * 1000

  return (
    <>
      <Head>
        <title>Mission Control — academicos</title>
        <meta name="description" content="Academic OS Mission Control dashboard." />
      </Head>

      <LivingBackground />

      <div className="min-h-screen flex flex-col md:flex-row relative z-10 pt-24 px-4 sm:px-6 max-w-7xl mx-auto gap-6 pb-12">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="glass p-4 rounded-[20px] border border-white/10 flex flex-col gap-3">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-widest text-left px-2">Navigation</h3>
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
              {sidebarItems.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left whitespace-nowrap transition-all ${
                      activeTab === item.key 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25' 
                        : 'text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Workspace panel */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          
          {/* Header Gamification Stats Bar */}
          <div className="glass p-5 rounded-[24px] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-left w-full sm:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-xl shadow-primary/10">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">Sragul Ragunathan</h2>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded">Level {level}</span>
                </div>
                <div className="flex items-center gap-3 text-muted text-xs mt-1 font-semibold">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500 fill-current" /> {streak} Day Streak</span>
                  <span>•</span>
                  <span>XP: {xp} / {threshold}</span>
                </div>
              </div>
            </div>

            {/* Level progress bar */}
            <div className="w-full sm:w-60 flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-black text-muted uppercase">
                <span>XP Progress</span>
                <span>{Math.round((xp / threshold) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${(xp / threshold) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Module workspace with AnimatePresence */}
          <div className="flex-1 glass p-6 sm:p-8 rounded-[28px] border border-white/10 min-h-[560px] relative overflow-hidden flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col h-full text-left"
              >

                {/* OVERVIEW MODULE */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent border border-white/5 relative overflow-hidden">
                      <div className="absolute right-[-10%] top-[-30%] w-60 h-60 rounded-full bg-primary/20 blur-[50px] pointer-events-none" />
                      <h2 className="text-xl font-display font-black text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent animate-pulse-glow" />
                        Academic Status Center
                      </h2>
                      <p className="text-xs text-muted leading-relaxed max-w-lg mt-2 font-semibold">
                        Welcome back. Your profile metrics are optimized for recruiters. Complete pending planner tasks to level up.
                      </p>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Identity score */}
                      <div className="glass p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Academic Identity</h4>
                        <div className="flex items-center gap-5">
                          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="34" className="stroke-white/5" strokeWidth="6" fill="none" />
                              <circle cx="40" cy="40" r="34" className="stroke-primary" strokeWidth="6" fill="none" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * 88) / 100} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-black text-white">88%</span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="font-black text-white">Rank Tier: Diamond Scholar</p>
                            <p className="text-muted leading-relaxed font-semibold">Add 2 certified skills tags to raise score to 95.</p>
                          </div>
                        </div>
                      </div>

                      {/* Productivity tracker */}
                      <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Productivity Targets</h4>
                          <p className="text-sm font-black text-white mt-1">🔥 7 Day Streak Active</p>
                        </div>
                        <p className="text-[11px] text-muted leading-relaxed mt-2 font-semibold">
                          Excellent status. Keep completing daily tasks to maintain your rank.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* STUDY PLANNER MODULE */}
                {activeTab === 'planner' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 flex-1">
                      <h2 className="text-lg font-black text-white">Study Tasks Planner</h2>
                      
                      {/* Form */}
                      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={newPlannerText}
                          onChange={e => setNewPlannerText(e.target.value)}
                          placeholder="Create a new task..."
                          className="flex-1 bg-black/40 text-xs font-semibold px-4 py-3 rounded-xl border border-white/5 focus:border-primary outline-none transition-colors"
                        />
                        <select
                          value={newPlannerReward}
                          onChange={e => setNewPlannerReward(parseInt(e.target.value))}
                          className="bg-black/40 text-xs font-semibold px-4 py-3 rounded-xl border border-white/5 outline-none"
                        >
                          <option value={50}>50 XP</option>
                          <option value={100}>100 XP</option>
                          <option value={150}>150 XP</option>
                        </select>
                        <button type="submit" className="px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-black uppercase flex items-center justify-center gap-1.5 shrink-0 shadow-lg">
                          <Plus className="w-4 h-4" /> Add Task
                        </button>
                      </form>

                      {/* Tasks List */}
                      <div className="space-y-2 mt-6">
                        {tasks.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => toggleTask(t.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex justify-between items-center ${
                              t.completed 
                                ? 'bg-white/5 border-white/5 opacity-55' 
                                : 'bg-[#08111F] border-white/10 hover:border-primary/40'
                            }`}
                          >
                            <span className={`text-xs font-semibold flex items-center gap-3 ${t.completed ? 'line-through text-muted' : 'text-white'}`}>
                              {t.completed ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> : <span className="w-4 h-4 rounded-full border border-white/20 shrink-0 inline-block" />}
                              {t.text}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${t.completed ? 'bg-white/5 text-muted' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                              +{t.xpReward} XP
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ATTENDANCE CHECK MODULE */}
                {activeTab === 'attendance' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white mb-2">Lectures Attendance Auditor</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(attendance).map(([sub, data]) => {
                        const ratio = data.total > 0 ? (data.attended / data.total) * 100 : 0
                        const isSafe = ratio >= 75
                        return (
                          <div key={sub} className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between gap-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-display font-black text-sm text-white">{sub}</h3>
                                <p className="text-[10px] text-muted font-bold mt-0.5">Ratio: {data.attended} / {data.total} lectures</p>
                              </div>
                              <span className={`text-[10px] px-2.5 py-0.5 rounded font-black uppercase ${
                                isSafe ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {isSafe ? 'Safe' : 'Critical'}
                              </span>
                            </div>

                            {/* Circular meter or slide bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold text-gray-300">
                                <span>Percentage</span>
                                <span>{ratio.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${isSafe ? 'bg-gradient-to-r from-primary to-accent' : 'bg-red-500'}`} style={{ width: `${ratio}%` }} />
                              </div>
                            </div>

                            {/* Plus minus modifiers */}
                            <div className="flex justify-between items-center border-t border-white/5 pt-3">
                              <span className="text-[10px] text-muted font-semibold">
                                {isSafe 
                                  ? `Bunk buffer: ${Math.max(0, Math.floor((data.attended - 0.75 * data.total) / 0.75))} classes`
                                  : `Attend next: ${Math.ceil((0.75 * data.total - data.attended) / 0.25)} classes`
                                }
                              </span>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => adjustAttendance(sub, 'attended', -1)} 
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <button 
                                  onClick={() => adjustAttendance(sub, 'attended', 1)} 
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                                <button 
                                  onClick={() => adjustAttendance(sub, 'total', 1)} 
                                  className="px-2.5 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-muted hover:text-white font-bold flex items-center justify-center text-[10px] uppercase"
                                >
                                  Add Class
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* GPA PROJECTION MODULE */}
                {activeTab === 'gpa' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">GPA Trajectory Projection</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      
                      {/* Left: Interactive Sliders */}
                      <div className="md:col-span-7 space-y-4">
                        {Object.entries(grades).map(([sub, val]) => (
                          <div key={sub} className="glass p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs font-bold text-gray-200 mb-2">
                              <span>{sub}</span>
                              <span className="text-accent">{val === 10 ? 'O (10)' : val === 9 ? 'A+ (9)' : val === 8 ? 'A (8)' : `B (${val})`}</span>
                            </div>
                            <input
                              type="range"
                              min="6"
                              max="10"
                              value={val}
                              onChange={e => updateGrade(sub, parseInt(e.target.value))}
                              className="w-full accent-primary bg-black/40"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Right: Circular GPA Output dial */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" className="stroke-white/5" strokeWidth="12" fill="none" />
                            <circle cx="80" cy="80" r="70" className="stroke-accent" strokeWidth="12" fill="none" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * parseFloat(calculatedGPA())) / 10} strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-display font-black text-white">{calculatedGPA()}</span>
                            <span className="text-[10px] font-bold text-muted uppercase mt-0.5">Estimated GPA</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted font-semibold mt-6 text-center max-w-[200px]">
                          Calculated directly based on your credit weight assumptions.
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* ASSIGNMENTS MODULE */}
                {activeTab === 'assignments' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Upcoming Assignments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[140px]">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">High Priority</span>
                            <span className="text-[10px] text-muted font-bold">Due in 2 days</span>
                          </div>
                          <h3 className="font-display font-black text-sm text-white mt-3">Linear Algebra proof sheets</h3>
                          <p className="text-[11px] text-muted mt-1">Complete proofs for eigenvalues and vector projections.</p>
                        </div>
                        <button onClick={() => addXP(50)} className="w-full mt-4 py-2 text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/5">
                          Mock Submit File (+50 XP)
                        </button>
                      </div>
                      <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[140px]">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] font-black uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded">Medium Priority</span>
                            <span className="text-[10px] text-muted font-bold">Due in 5 days</span>
                          </div>
                          <h3 className="font-display font-black text-sm text-white mt-3">Compiler lexical analyzer script</h3>
                          <p className="text-[11px] text-muted mt-1">Implement a regex token generator in Python or Go.</p>
                        </div>
                        <button onClick={() => addXP(50)} className="w-full mt-4 py-2 text-[10px] font-black uppercase bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/5">
                          Mock Submit File (+50 XP)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* EXAMS MODULE */}
                {activeTab === 'exams' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Exams & Test Schedules</h2>
                    <div className="space-y-3">
                      <div className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-black text-white">Machine Learning Final Exam</h3>
                          <p className="text-[10px] text-muted font-semibold mt-0.5">Syllabus: Deep Nets, Decision Trees, SVM, Reinforcement Learning</p>
                        </div>
                        <span className="text-[10px] font-black text-accent uppercase bg-accent/15 px-2.5 py-1 rounded">JULY 12</span>
                      </div>
                      <div className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-black text-white">Compiler Design Lab Assessment</h3>
                          <p className="text-[10px] text-muted font-semibold mt-0.5">Syllabus: Parser trees, shift-reduce mechanisms, code generations</p>
                        </div>
                        <span className="text-[10px] font-black text-accent uppercase bg-accent/15 px-2.5 py-1 rounded">JULY 15</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ANALYTICS MODULE */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Performance Metrics Center</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Productivity card */}
                      <div className="glass p-5 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Focus distribution</h4>
                        <div className="space-y-3.5">
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-300 mb-1">
                              <span>Coding & Projects</span>
                              <span>24 hrs (56.4%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: '56.4%' }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-300 mb-1">
                              <span>Lecture Prep</span>
                              <span>12.5 hrs (29.4%)</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: '29.4%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resume Builder Workspace */}
                      <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Resume builder desk</h4>
                          <div className="space-y-2 mt-3 text-xs">
                            <input
                              type="text"
                              value={resumeData.name}
                              onChange={e => setResumeData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Full Name"
                              className="w-full bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-[11px] font-semibold text-white outline-none"
                            />
                            <textarea
                              value={resumeData.skills}
                              onChange={e => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                              placeholder="Skills"
                              className="w-full bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-[11px] font-semibold text-white outline-none h-16 resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                          <button
                            onClick={() => {
                              setResumeExported(true)
                              addXP(50)
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white text-[10px] font-black uppercase rounded-lg transition-colors"
                          >
                            {resumeExported ? "PDF Exported! (+50 XP)" : "Export Resume PDF"}
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* CREATOR DESK MODULE */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Notes Creator Desk</h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Upload Form */}
                      <form onSubmit={handleUploadNote} className="md:col-span-7 glass p-5 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Upload Course Outline</h4>
                        <div>
                          <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">Document Title</label>
                          <input
                            type="text"
                            value={newNoteTitle}
                            onChange={e => setNewNoteTitle(e.target.value)}
                            placeholder="e.g., ML Equations summary sheets"
                            className="w-full bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-xs font-semibold text-white outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">Subject Category</label>
                          <select
                            value={newNoteSubject}
                            onChange={e => setNewNoteSubject(e.target.value)}
                            className="w-full bg-black/40 px-3 py-2 rounded-lg border border-white/5 text-xs font-semibold text-white outline-none"
                          >
                            <option value="AIML">Artificial Intelligence / Machine Learning</option>
                            <option value="WebDev">Web Application Development</option>
                            <option value="Systems">Operating Systems & Compilers</option>
                          </select>
                        </div>
                        <button type="submit" className="w-full py-3 bg-white hover:bg-white/90 text-black text-xs font-black uppercase rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-lg">
                          <Upload className="w-4 h-4" /> Publish to Marketplace (+100 XP)
                        </button>
                      </form>

                      {/* Stats */}
                      <div className="md:col-span-5 glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Creator Earnings</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted font-semibold">Total Downloads</span>
                              <span className="font-black text-white">431 times</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted font-semibold">Avg rating</span>
                              <span className="font-black text-accent">4.9 ★</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 p-3.5 rounded-xl text-[11px] text-primary leading-relaxed mt-4 font-semibold">
                          Verified creators are ranked on local university dashboard feeds. Keep sharing summaries to build authority.
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* NOTES MARKETPLACE MODULE */}
                {activeTab === 'marketplace' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Shared Notes Marketplace</h2>
                    
                    <div className="space-y-3">
                      {notes.map(note => (
                        <div key={note.id} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-[#FFD166]/10 text-[#FFD166] flex items-center justify-center font-black text-xs shrink-0">
                              {note.fileType}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xs font-black text-white truncate">{note.title}</h3>
                              <p className="text-[9px] text-muted mt-0.5">Author: {note.author} • Category: {note.subject} • Size: {note.size}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-black text-[#FFD166] flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-current" /> {note.rating}
                            </span>
                            <button
                              onClick={() => {
                                alert(`Simulating file download: "${note.title}"`)
                                addXP(20)
                              }}
                              className="px-3.5 py-1.5 bg-white text-black hover:bg-white/90 text-[10px] font-black uppercase rounded-lg shadow-md transition-colors"
                            >
                              GET (+20 XP)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MELLOW AI MODULE */}
                {activeTab === 'ai' && (
                  <div className="flex-1 flex flex-col justify-between h-full min-h-[460px]">
                    <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center rounded-xl mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                          <Sparkles className="w-4 h-4 animate-pulse-glow" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">Mellow AI Assistant</p>
                          <p className="text-[8px] text-green-400 font-bold flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-green-400 animate-ping" /> Contextual Analysis Engine
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 items-center">
                        <span className="wave-bar" style={{ animationDelay: '0.1s' }} />
                        <span className="wave-bar" style={{ animationDelay: '0.4s', animationDuration: '0.8s' }} />
                        <span className="wave-bar" style={{ animationDelay: '0.2s', animationDuration: '1.2s' }} />
                      </div>
                    </div>

                    {/* Chat log */}
                    <div className="flex-1 overflow-y-auto space-y-4 max-h-[300px] p-2 pr-4 scrollbar-hide text-left">
                      {aiMessages.map((m, idx) => (
                        <div key={idx} className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : ''}`}>
                          {m.sender === 'ai' && (
                            <div className="w-6 h-6 rounded bg-primary/25 flex items-center justify-center text-primary shrink-0 text-[10px] font-black">AI</div>
                          )}
                          <div className={`p-3 rounded-xl text-xs font-medium max-w-[80%] leading-relaxed ${
                            m.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 border border-white/5 text-gray-300 rounded-tl-none'
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      ))}

                      {aiTyping && (
                        <div className="flex gap-3 items-center">
                          <div className="w-6 h-6 rounded bg-primary/25 flex items-center justify-center text-[10px] font-black">AI</div>
                          <div className="flex gap-1 bg-white/5 p-3 rounded-xl border border-white/5 items-center">
                            <span className="w-1 h-1 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '200ms' }} />
                            <span className="w-1 h-1 rounded-full bg-muted animate-bounce" style={{ animationDelay: '400ms' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input form */}
                    <form onSubmit={sendAiQuery} className="mt-4 flex gap-3 pt-4 border-t border-white/5">
                      <input
                        type="text"
                        value={aiInput}
                        onChange={e => setAiInput(e.target.value)}
                        placeholder="Type standard command: 'gpa', 'resume', or ask anything..."
                        className="flex-1 bg-[#030303] text-xs font-semibold px-4 py-3 rounded-xl border border-white/5 focus:border-primary outline-none transition-colors"
                      />
                      <button type="submit" className="w-10 h-10 rounded-xl bg-white hover:bg-white/90 text-black flex items-center justify-center transition-colors shadow-lg shrink-0">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* SOCIAL feed MODULE */}
                {activeTab === 'social' && (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 flex-1">
                      <h2 className="text-lg font-black text-white">Cohort Discussions</h2>
                      
                      {/* Form */}
                      <form onSubmit={handleAddPost} className="flex gap-3">
                        <input
                          type="text"
                          value={newPostText}
                          onChange={e => setNewPostText(e.target.value)}
                          placeholder="Share your academic progress..."
                          className="flex-1 bg-black/40 text-xs font-semibold px-4 py-3 rounded-xl border border-white/5 focus:border-primary outline-none transition-colors"
                        />
                        <button type="submit" className="px-5 py-3 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-black uppercase shrink-0 shadow-lg flex items-center justify-center gap-1.5">
                          <Send className="w-4 h-4" /> Post Feed
                        </button>
                      </form>

                      {/* Post Stream */}
                      <div className="space-y-4 mt-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                        {posts.map(post => (
                          <div key={post.id} className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <img src={post.avatar} className="w-8 h-8 rounded-full bg-white/5 border border-white/5" alt="user" />
                                <div>
                                  <p className="text-xs font-black text-white">{post.name}</p>
                                  <p className="text-[9px] text-muted font-bold">@{post.user}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  likePost(post.id)
                                  addXP(10)
                                }} 
                                className={`text-[10px] font-black uppercase flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                                  post.liked ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-muted hover:text-white border border-white/5'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-current' : ''}`} /> {post.likes}
                              </button>
                            </div>

                            <p className="text-xs text-gray-300 leading-relaxed font-semibold">{post.content}</p>

                            {/* Comments list */}
                            {post.comments.length > 0 && (
                              <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-2">
                                {post.comments.map((comment, index) => (
                                  <p key={index} className="text-[11px] text-gray-400 font-semibold">
                                    💬 <span className="text-gray-300 font-bold">User:</span> {comment}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Reply Input */}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add reply..."
                                value={newCommentText[post.id] || ''}
                                onChange={e => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                className="flex-1 bg-black/40 text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-white/5 outline-none"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded-lg border border-white/5"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* PROFILE CUSTOMIZATION MODULE */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-black text-white">Command Center Profile customization</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Theme selection */}
                      <div className="glass p-5 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Visual Theme Selector</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => updateProfile({ theme: 'primary' })}
                            className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                              profile.theme === 'primary' 
                                ? 'bg-gradient-to-r from-primary to-secondary text-white border-primary shadow-lg' 
                                : 'glass border-white/5 text-muted hover:text-white'
                            }`}
                          >
                            👑 Neo Aurora
                          </button>
                          <button
                            onClick={() => updateProfile({ theme: 'cyber' })}
                            className={`p-4 rounded-xl border text-xs font-bold text-center transition-all ${
                              profile.theme === 'cyber' 
                                ? 'bg-gradient-to-r from-pink-500 to-primary text-white border-pink-500 shadow-lg' 
                                : 'glass border-white/5 text-muted hover:text-white'
                            }`}
                          >
                            👾 Cyberpunk
                          </button>
                        </div>
                      </div>

                      {/* Display settings preview */}
                      <div className="glass p-5 rounded-2xl border border-white/5 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4">Badge Visualizer</h4>
                          <div className="flex gap-4 items-center">
                            <div className="text-4xl">👑</div>
                            <div>
                              <p className="text-xs font-black text-white">Elite Scholar Badge</p>
                              <p className="text-[10px] text-muted mt-0.5">Rank: Top 10 Student cohort</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-[10px] text-muted leading-relaxed mt-4 font-semibold">
                          Your custom badge is visible to recruiters searching the global AcademicOS student database.
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </main>
      </div>
    </>
  )
}
