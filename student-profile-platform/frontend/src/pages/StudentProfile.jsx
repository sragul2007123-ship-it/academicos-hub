import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../services/supabaseClient'
import LearningHub from './LearningHub'

export default function StudentProfile() {
  const { username } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [friendStatus, setFriendStatus] = useState(null)
  const [friendLoading, setFriendLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    loadProfile()
    window.scrollTo(0, 0)
  }, [username])

  useEffect(() => {
    if (user && profileData) {
      checkFriendship()
    }
  }, [user, profileData])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getPublicProfile(username)
      setProfileData({ ...data.user, ...data.profile })
      setSkills(data.skills || [])
      setProjects(data.projects || [])
      setCertificates(data.certificates || [])
      // Increment views
      api.incrementViews(username).catch(() => {})
    } catch (err) {
      setError('Profile not found')
    } finally {
      setLoading(false)
    }
  }

  const checkFriendship = async () => {
    try {
      const friends = await api.getFriends(user.id)
      const isFriend = friends.find(f => f.id === profileData.id)
      if (isFriend) {
        setFriendStatus('accepted')
      } else {
        const pending = await api.getPendingRequests(user.id)
        if (pending.find(r => r.id === profileData.id)) {
          setFriendStatus('pending')
        } else {
          const sent = await api.getSentRequests(user.id)
          if (sent.find(r => r.id === profileData.id)) {
            setFriendStatus('sent')
          } else {
            setFriendStatus(null)
          }
        }
      }
    } catch (err) {}
  }

  const handleFriendAction = async () => {
    if (!user) return navigate('/login')
    setFriendLoading(true)
    try {
      if (friendStatus === 'pending') {
        const requests = await api.getPendingRequests(user.id)
        const req = requests.find(r => r.id === profileData.id)
        if (req) {
          await api.acceptFriendRequest(req.friendship_id)
          setFriendStatus('accepted')
        }
      } else if (!friendStatus) {
        await api.sendFriendRequest(user.id, profileData.id)
        setFriendStatus('sent')
      }
    } catch (err) {
    } finally {
      setFriendLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black">
      <div className="w-12 h-12 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-500 mb-8">{error}</p>
      <Link to="/" className="px-6 py-2 bg-primary-600 text-white rounded-lg">Back to Home</Link>
    </div>
  )

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#050816] transition-colors duration-300 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] mix-blend-screen animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-accent-600/10 rounded-full blur-[150px] mix-blend-screen animate-float-delayed"></div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Cover Image & Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0f111a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden mb-8"
        >
          {/* Cover Image */}
          <div className="h-56 w-full bg-gradient-to-br from-primary-900/40 via-accent-900/20 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0f111a]/80 to-transparent"></div>
          </div>
          
          <div className="px-8 pb-8 relative">
            {/* Avatar overlapping cover */}
            <div className="flex justify-between items-end -mt-20 mb-6 relative z-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-36 h-36 rounded-3xl p-1.5 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-500 shadow-2xl"
              >
                <div className="w-full h-full rounded-[20px] overflow-hidden bg-[#111111] flex items-center justify-center text-5xl font-display font-black text-white">
                  {profileData?.profile_photo ? (
                    <img src={profileData.profile_photo} className="w-full h-full object-cover" alt="profile" />
                  ) : (
                    profileData?.name?.[0]
                  )}
                </div>
              </motion.div>
              
              <div className="flex gap-3 mb-2">
                {user && user.id === profileData?.id ? (
                  <Link to="/dashboard" className="px-6 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    Edit Profile
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={handleFriendAction}
                      className={`px-6 py-3 text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] ${
                        friendStatus === 'accepted' 
                        ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' 
                        : 'bg-white text-black hover:bg-gray-200'
                      }`}
                    >
                      {friendStatus === 'accepted' ? 'Following' : friendLoading ? '...' : friendStatus === 'sent' ? 'Requested' : 'Follow'}
                    </button>
                    <button 
                      onClick={() => navigate(`/messages?user=${profileData.id}`)}
                      className="px-6 py-3 bg-[#111111] border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-[#1a1a24] transition-all"
                    >
                      Message
                    </button>
                  </>
                )}
                <button onClick={handleCopyLink} className="p-3 bg-[#111111] border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-[#1a1a24] transition-all relative">
                  <AnimatePresence>
                    {showCopied && (
                      <motion.span initial={{opacity:0, y:-10}} animate={{opacity:1, y:-25}} exit={{opacity:0}} className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-3 py-1.5 rounded-lg font-bold whitespace-nowrap shadow-xl">
                        Link Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                </button>
              </div>
            </div>

            {/* User Details */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight mb-1">
                {profileData?.name}
              </h1>
              <p className="text-gray-400 font-medium text-sm mb-6 flex items-center gap-2">
                @{profileData?.username} 
                <span className="w-1 h-1 rounded-full bg-gray-600"></span> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 font-bold tracking-wide uppercase text-xs">{profileData?.role}</span>
              </p>
              
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-8 font-medium">
                {profileData?.about}
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {profileData?.linkedin && (
                  <motion.a whileHover={{ scale: 1.05 }} href={profileData.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-sm font-bold hover:bg-blue-500/20 transition-colors">
                    LinkedIn
                  </motion.a>
                )}
                {profileData?.github && (
                  <motion.a whileHover={{ scale: 1.05 }} href={profileData.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors">
                    GitHub
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Stats & Skill Galaxy Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 flex gap-4"
          >
            <div className="flex-1 glass-card p-6 border-white/5 flex flex-col justify-center items-center group cursor-default">
              <span className="text-3xl font-display font-black text-white group-hover:text-primary-400 transition-colors">{projects.length}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Posts</span>
            </div>
            <div className="flex-1 glass-card p-6 border-white/5 flex flex-col justify-center items-center group cursor-default">
              <span className="text-3xl font-display font-black text-white group-hover:text-accent-400 transition-colors">{profileData?.views || 0}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Views</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 glass-card p-6 border-white/5 flex flex-col justify-center relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-colors"></div>
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Skill Galaxy</h3>
            <div className="flex flex-wrap gap-2 relative z-10">
              {skills.length === 0 ? (
                <span className="text-sm text-gray-500 italic">No skills listed yet.</span>
              ) : (
                skills.map((skill, index) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={index} 
                    className="px-4 py-2 bg-[#111111]/80 backdrop-blur-md border border-white/10 hover:border-primary-500/50 rounded-xl text-xs font-bold text-gray-300 hover:text-white shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-colors cursor-default"
                  >
                    {skill.skill_name}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Pill Navigation Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-lg ${activeTab === 'posts' ? 'bg-white text-black' : 'bg-[#0f111a]/80 backdrop-blur-md text-gray-400 hover:text-white border border-white/5'}`}
          >
            Portfolio & Posts
          </button>
          <button 
            onClick={() => setActiveTab('reels')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-lg ${activeTab === 'reels' ? 'bg-white text-black' : 'bg-[#0f111a]/80 backdrop-blur-md text-gray-400 hover:text-white border border-white/5'}`}
          >
            Certifications
          </button>
          <button 
            onClick={() => setActiveTab('learning')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-lg ${activeTab === 'learning' ? 'bg-white text-black' : 'bg-[#0f111a]/80 backdrop-blur-md text-gray-400 hover:text-white border border-white/5'}`}
          >
            Learning Hub
          </button>
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'learning' ? (
                <div className="glass-card border-white/5 p-2 sm:p-6 shadow-2xl">
                  <LearningHub embedded={true} />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeTab === 'posts' ? projects : certificates).map((item, index) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={index} 
                      className="glass-card border-white/5 overflow-hidden group flex flex-col cursor-pointer"
                    >
                      {item.image_url ? (
                        <div className="h-48 w-full bg-[#111111] overflow-hidden relative">
                          <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt="post" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </div>
                      ) : (
                        <div className="h-40 w-full bg-gradient-to-br from-[#111111] to-[#1a1a24] flex items-center justify-center p-6 border-b border-white/5 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                          <p className="text-gray-400 font-medium text-sm text-center italic line-clamp-3 relative z-10 group-hover:text-white transition-colors">
                            {item.content || item.title || item.certificate_name || "Text post"}
                          </p>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1 bg-[#0f111a]/80 backdrop-blur-md">
                        <h3 className="font-bold text-white text-lg mb-2 leading-tight line-clamp-2">
                          {item.title || item.certificate_name || (item.content ? item.content.split('\n')[0] : 'Untitled')}
                        </h3>
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            {new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-primary-400 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            <span className="text-xs font-bold">{item.likes_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {activeTab !== 'learning' && (activeTab === 'posts' ? projects : certificates).length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center glass-card border-white/5 border-dashed mt-4 text-center px-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-white/5 flex items-center justify-center mb-6 shadow-xl">
                    <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-2">Space is empty</h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">This section of the profile doesn't have any content yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

