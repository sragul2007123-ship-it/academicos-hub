import { create } from 'zustand'

export interface PlannerTask {
  id: number
  text: string
  completed: boolean
  xpReward: number
}

export interface SocialPost {
  id: number
  user: string
  name: string
  avatar: string
  content: string
  likes: number
  liked: boolean
  comments: string[]
}

export interface NotesItem {
  id: number
  title: string
  subject: string
  fileType: string
  size: string
  author: string
  rating: number
  downloads: number
}

export interface UserProfile {
  theme: string
  banner: string
  badge: string
}

interface AcademicStore {
  xp: number
  level: number
  streak: number
  activeTab: string
  tasks: PlannerTask[]
  posts: SocialPost[]
  notes: NotesItem[]
  profile: UserProfile
  setActiveTab: (tab: string) => void
  addXP: (amount: number) => void
  addTask: (text: string, reward: number) => void
  toggleTask: (id: number) => void
  addPost: (content: string) => void
  likePost: (id: number) => void
  addComment: (postId: number, comment: string) => void
  uploadNote: (title: string, subject: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

export const useAcademicStore = create<AcademicStore>((set) => ({
  xp: 1250,
  level: 3,
  streak: 7,
  activeTab: 'overview',
  tasks: [
    { id: 1, text: "Revise Machine Learning equations for midterms", completed: false, xpReward: 100 },
    { id: 2, text: "Build 3D landing page hero experience", completed: true, xpReward: 150 },
    { id: 3, text: "Complete database schemas assignment", completed: false, xpReward: 80 },
    { id: 4, text: "Publish portfolio update post in identity hub", completed: false, xpReward: 50 }
  ],
  posts: [
    {
      id: 1,
      user: "sragul2007",
      name: "Sragul Ragunathan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sragul&backgroundColor=00FFC6",
      content: "Just finalized my React Three Fiber constellation model on AcademicOS! It visually links all my projects and certs directly on the profile. Score is rising 🚀",
      likes: 24,
      liked: false,
      comments: ["Wow, looks insane!", "Can you share the notes for Fiber?"]
    },
    {
      id: 2,
      user: "alexj",
      name: "Alex Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      content: "Uploaded a comprehensive guide for AWS Cloud Practitioner certification under the Notes tab. Includes practice exams and summaries. Go download it!",
      likes: 18,
      liked: true,
      comments: ["Perfect timing! Downloading now."]
    }
  ],
  notes: [
    { id: 1, title: "Deep Learning Foundations Notes", subject: "AIML", fileType: "PDF", size: "2.4 MB", author: "Alex J.", rating: 4.8, downloads: 142 },
    { id: 2, title: "Vite + React Core concepts cheat sheet", subject: "WebDev", fileType: "PDF", size: "1.1 MB", author: "Sragul R.", rating: 4.9, downloads: 289 },
    { id: 3, title: "Compiler Design Lab Guide", subject: "Systems", fileType: "PDF", size: "4.2 MB", author: "Dr. Maya", rating: 4.7, downloads: 78 }
  ],
  profile: {
    theme: 'primary',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    badge: 'elite'
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount
    const threshold = state.level * 1000
    if (newXP >= threshold) {
      return { xp: newXP - threshold, level: state.level + 1 }
    }
    return { xp: newXP }
  }),
  addTask: (text, reward) => set((state) => ({
    tasks: [...state.tasks, { id: Date.now(), text, completed: false, xpReward: reward }]
  })),
  toggleTask: (id) => set((state) => {
    let xpGain = 0
    const updatedTasks = state.tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed
        if (nextState) {
          xpGain = t.xpReward
        } else {
          xpGain = -t.xpReward
        }
        return { ...t, completed: nextState }
      }
      return t
    })

    // Calculate new XP/Level with threshold logic
    let newXP = state.xp + xpGain
    let newLevel = state.level
    if (newXP < 0) {
      newXP = 0
    }
    const threshold = newLevel * 1000
    if (newXP >= threshold) {
      newXP -= threshold
      newLevel += 1
    }

    return { tasks: updatedTasks, xp: newXP, level: newLevel }
  }),
  addPost: (content) => set((state) => ({
    posts: [
      {
        id: Date.now(),
        user: "sragul2007",
        name: "Sragul Ragunathan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sragul&backgroundColor=00FFC6",
        content,
        likes: 0,
        liked: false,
        comments: []
      },
      ...state.posts
    ]
  })),
  likePost: (id) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        }
      }
      return p
    })
  })),
  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, comment]
        }
      }
      return p
    })
  })),
  uploadNote: (title, subject) => set((state) => ({
    notes: [
      {
        id: Date.now(),
        title,
        subject,
        fileType: "PDF",
        size: "1.5 MB",
        author: "Sragul R.",
        rating: 5.0,
        downloads: 0
      },
      ...state.notes
    ]
  })),
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  }))
}))
