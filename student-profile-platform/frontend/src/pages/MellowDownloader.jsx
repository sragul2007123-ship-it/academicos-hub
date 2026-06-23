import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { supabase } from '../services/supabaseClient'
import { Link2, Sparkles, Loader2, Play, Image, Layers, Heart, Download, Trash2, Search, ExternalLink, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MellowDownloader() {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [result, setResult] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  // History & Stats State
  const [downloads, setDownloads] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  const [stats, setStats] = useState({
    totalDownloads: 0,
    downloadsThisWeek: 0,
    mostDownloadedType: 'N/A'
  })

  const steps = [
    'Validating link integrity...',
    'Establishing secure proxy connection...',
    'Fetching remote media payload...',
    'Bypassing CDN restrictions...',
    'Compiling download links...'
  ]

  useEffect(() => {
    let interval
    if (loading) {
      setLoadingStep(0)
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
      }, 900)
    }
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    if (user) {
      loadHistoryAndFavorites()
    }
  }, [user])

  const loadHistoryAndFavorites = async () => {
    if (!user) return
    setHistoryLoading(true)
    try {
      // 1. Fetch user download history
      const { data: downloadsData, error: downloadsErr } = await supabase
        .from('downloads')
        .select('*')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false })

      if (downloadsErr) throw downloadsErr

      // 2. Fetch user favorites list
      const { data: favoritesData, error: favoritesErr } = await supabase
        .from('favorites')
        .select('download_id')
        .eq('user_id', user.id)

      if (favoritesErr) throw favoritesErr

      const favIds = (favoritesData || []).map((f) => f.download_id)

      setDownloads(downloadsData || [])
      setFavoriteIds(favIds)
      computeAnalytics(downloadsData || [])
    } catch (err) {
      console.error('Failed to load downloader history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  const computeAnalytics = (data) => {
    const total = data.length
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const thisWeek = data.filter((d) => new Date(d.downloaded_at) >= sevenDaysAgo).length

    const frequencies = { reel: 0, image: 0, carousel: 0 }
    data.forEach((d) => {
      if (d.media_type in frequencies) {
        frequencies[d.media_type]++
      }
    })

    let topType = 'N/A'
    let maxCount = 0
    Object.entries(frequencies).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count
        topType = type
      }
    })

    setStats({
      totalDownloads: total,
      downloadsThisWeek: thisWeek,
      mostDownloadedType: topType
    })
  }

  const validateUrl = (input) => {
    if (!input.trim()) {
      setError('')
      return false
    }
    const match = input.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/)
    if (!match) {
      setError('Please enter a valid Instagram URL (e.g. instagram.com/reel/...)')
      return false
    }
    setError('')
    return true
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
      validateUrl(text)
    } catch (err) {
      console.warn('Clipboard read failed: ', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateUrl(url)) return

    setLoading(true)
    setResult(null)
    setIsFavorited(false)
    setCarouselIndex(0)

    try {
      const data = await api.processDownload(url, user?.id || null)
      setResult(data)
      // Reload history if logged in to display the new entry
      if (user) {
        await loadHistoryAndFavorites()
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your link and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavoriteOnResult = async () => {
    if (!user) {
      alert('You must sign in to save items to your favorites.')
      return
    }
    if (!result?.db_record_id) return

    setFavLoading(true)
    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('download_id', result.db_record_id)
        setIsFavorited(false)
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            download_id: result.db_record_id
          })
        setIsFavorited(true)
      }
      await loadHistoryAndFavorites()
    } catch (err) {
      console.error('Favorite toggle failed:', err)
    } finally {
      setFavLoading(false)
    }
  }

  const handleDeleteHistory = async (id) => {
    try {
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', id)

      if (error) throw error

      const updated = downloads.filter((d) => d.id !== id)
      setDownloads(updated)
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id))
      computeAnalytics(updated)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const handleToggleFavoriteHistory = async (downloadId, isFav) => {
    if (!user) return
    try {
      if (isFav) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('download_id', downloadId)
        setFavoriteIds(favoriteIds.filter((id) => id !== downloadId))
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            download_id: downloadId
          })
        setFavoriteIds([...favoriteIds, downloadId])
      }
    } catch (err) {
      console.error('Toggle favorite failed:', err)
    }
  }

  const triggerDownload = (downloadUrl, filename) => {
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const filteredHistory = downloads.filter((d) =>
    d.media_url.toLowerCase().includes(historySearch.toLowerCase()) ||
    d.media_type.toLowerCase().includes(historySearch.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-24 pb-12 gradient-bg-subtle relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-40 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Media Utility
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Mellow <span className="gradient-text">Media Downloader</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            Securely extract high-quality video and image URLs from Instagram posts.
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-10 relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  validateUrl(e.target.value)
                }}
                placeholder="Paste Instagram Reel or Post Link..."
                className="w-full pl-12 pr-24 py-4 rounded-xl border border-gray-200 dark:border-surface-700 bg-white/70 dark:bg-surface-800/70 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm placeholder-gray-400"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-surface-700 hover:bg-gray-50 dark:hover:bg-surface-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Paste
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !url || !!error}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-500/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Fetch
                </>
              )}
            </button>
          </form>

          {error && <p className="mt-3 text-xs font-bold text-rose-500 pl-4">{error}</p>}

          {/* Steps Progress */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 flex flex-col items-center justify-center gap-3 py-2"
              >
                <div className="w-full max-w-sm bg-gray-100 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <span className="text-xs font-bold text-gray-400">{steps[loadingStep]}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Downloader Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 mb-12"
            >
              {/* Media Preview */}
              <div className="w-full md:w-2/5 aspect-[4/5] rounded-2xl bg-black/40 overflow-hidden relative border border-gray-200 dark:border-surface-700 flex items-center justify-center">
                {result.media_type === 'reel' ? (
                  <>
                    <video
                      src={result.download_links[0]}
                      poster={result.thumbnail}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Play className="w-3 h-3 fill-white" /> REEL
                    </div>
                  </>
                ) : result.media_type === 'image' ? (
                  <>
                    <img src={result.download_links[0]} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Image className="w-3 h-3" /> IMAGE
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={result.download_links[carouselIndex]}
                      alt={`Preview slide ${carouselIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Layers className="w-3 h-3" /> CAROUSEL ({carouselIndex + 1}/{result.download_links.length})
                    </div>
                    {/* Slider Nav */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                      <button
                        disabled={carouselIndex === 0}
                        onClick={() => setCarouselIndex((prev) => prev - 1)}
                        className="p-1.5 rounded-lg bg-black/60 text-white disabled:opacity-40 cursor-pointer"
                      >
                        &larr;
                      </button>
                      <button
                        disabled={carouselIndex === result.download_links.length - 1}
                        onClick={() => setCarouselIndex((prev) => prev + 1)}
                        className="p-1.5 rounded-lg bg-black/60 text-white disabled:opacity-40 cursor-pointer"
                      >
                        &rarr;
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Action column */}
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <h3 className="font-extrabold text-gradient text-lg mb-2">Extraction Payload</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed mb-6">
                    &ldquo;{result.caption}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        triggerDownload(
                          result.download_links[result.media_type === 'carousel' ? carouselIndex : 0],
                          `mellow-extract-${result.shortcode}`
                        )
                      }
                      className="flex-grow py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
                    >
                      <Download className="w-4.5 h-4.5" /> Download Media
                    </button>

                    {user && result.db_record_id && (
                      <button
                        onClick={handleToggleFavoriteOnResult}
                        disabled={favLoading}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isFavorited
                            ? 'border-accent-500/20 bg-accent-500/10 text-accent-500'
                            : 'border-gray-200 dark:border-surface-700 bg-white/5 text-gray-400 hover:text-accent-500'
                        }`}
                      >
                        {favLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-accent-500' : ''}`} />
                        )}
                      </button>
                    )}
                  </div>
                  {!user && (
                    <p className="text-[10px] text-center text-gray-400 font-semibold">
                      💡 Sign in to unlock download history tracking and bookmarks!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard and History Section (If logged in) */}
        {user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-gray-200 dark:border-surface-800 pt-10"
          >
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {[
                { title: 'Total Saved', value: stats.totalDownloads, icon: Download },
                { title: 'Downloads Weekly', value: stats.downloadsThisWeek, icon: Activity },
                { title: 'Top Type', value: stats.mostDownloadedType.toUpperCase(), icon: Sparkles }
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="glass-card rounded-2xl p-5 flex items-center justify-between border border-gray-200/50 dark:border-surface-800">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.title}</span>
                      <span className="text-xl font-extrabold tracking-tight mt-1">{s.value}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-primary-500/10 text-primary-500">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* History Table */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-extrabold text-gradient">Download Logs</h3>
              <div className="w-full sm:w-72 relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-surface-700 bg-white/70 dark:bg-surface-800/70 outline-none text-xs placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50"
                />
              </div>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="glass-card rounded-2xl py-10 text-center text-xs text-gray-400 font-semibold border border-gray-200/50 dark:border-surface-800">
                No logs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredHistory.map((d) => {
                    const isFav = favoriteIds.includes(d.id)
                    return (
                      <motion.div
                        key={d.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card rounded-2xl border border-gray-200/50 dark:border-surface-800 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="w-full aspect-[16/10] bg-black/20 relative flex items-center justify-center">
                          {d.thumbnail ? (
                            <img src={d.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <Download className="w-6 h-6 text-gray-400" />
                          )}
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-[8px] font-bold text-white uppercase tracking-wider">
                            {d.media_type}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <a
                            href={d.media_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-primary-500 hover:underline flex items-center gap-0.5 truncate mb-4 w-full font-mono"
                          >
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            {d.media_url}
                          </a>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-surface-800">
                            <button
                              onClick={() => handleToggleFavoriteHistory(d.id, isFav)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isFav
                                  ? 'border-accent-500/20 bg-accent-500/10 text-accent-500'
                                  : 'border-gray-200 dark:border-surface-700 text-gray-400 hover:text-accent-500'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-accent-500' : ''}`} />
                            </button>

                            <button
                              onClick={() => handleDeleteHistory(d.id)}
                              className="p-1.5 rounded-lg border border-gray-200 dark:border-surface-700 text-gray-400 hover:text-rose-500 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all cursor-pointer ml-auto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
