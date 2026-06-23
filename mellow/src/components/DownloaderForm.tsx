'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link2, Sparkles, Loader2, Play, Image, Layers, Heart, Download, Check, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadResult {
  shortcode: string;
  media_url: string;
  media_type: 'reel' | 'image' | 'carousel';
  thumbnail: string;
  download_links: string[];
  caption: string;
  db_record_id?: string;
}

export default function DownloaderForm() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const steps = [
    'Validating link integrity...',
    'Establishing secure proxy connection...',
    'Fetching remote media payload...',
    'Bypassing CDN restrictions...',
    'Compiling download links...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 900);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const validateUrl = (input: string) => {
    if (!input.trim()) {
      setError('');
      return false;
    }
    const match = input.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) {
      setError('Please enter a valid Instagram Reel or Post URL (e.g. instagram.com/reel/...)');
      return false;
    }
    setError('');
    return true;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      validateUrl(text);
    } catch (err) {
      console.warn('Clipboard read failed: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    setLoading(true);
    setResult(null);
    setIsFavorited(false);
    setCarouselIndex(0);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user?.id || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch download links');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      alert('You must sign in to save items to your favorites.');
      return;
    }
    if (!result?.db_record_id) return;

    setFavLoading(true);
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error: deleteErr } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('download_id', result.db_record_id);

        if (deleteErr) throw deleteErr;
        setIsFavorited(false);
      } else {
        // Add to favorites
        const { error: insertErr } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            download_id: result.db_record_id,
          });

        if (insertErr) throw insertErr;
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const triggerDownloadFile = async (downloadUrl: string, filename: string) => {
    try {
      // Create a temporary link element and click it
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('File download trigger failed:', err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Downloader Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel-glow rounded-3xl p-8 mb-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-500 animate-pulse" />
          Instagram Reel & Post Downloader
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                validateUrl(e.target.value);
              }}
              placeholder="Paste Instagram Reel or Post Link..."
              className="w-full pl-12 pr-24 py-4 rounded-2xl border border-white/10 dark:border-white/5 bg-white/5 focus:bg-white/10 dark:bg-black/20 dark:focus:bg-black/30 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-sm md:text-base placeholder-gray-400"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-xs font-semibold hover:text-primary-500 transition-colors"
            >
              Paste Link
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !url || !!error}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400 text-white font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Fetch Media
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-xs font-semibold text-rose-500 pl-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Loading Steps Animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 py-4"
            >
              <div className="w-full max-w-md bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <motion.span
                key={loadingStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs font-semibold text-gray-400"
              >
                {steps[loadingStep]}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Downloader Preview & Actions Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden"
          >
            {/* Left Column: Media Preview */}
            <div className="w-full md:w-2/5 aspect-[4/5] rounded-2xl bg-black/40 overflow-hidden relative border border-white/10 group flex items-center justify-center">
              {result.media_type === 'reel' ? (
                <>
                  <video
                    src={result.download_links[0]}
                    poster={result.thumbnail}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white pointer-events-none">
                    <Play className="w-3.5 h-3.5 fill-white" /> Reel
                  </div>
                </>
              ) : result.media_type === 'image' ? (
                <>
                  <img
                    src={result.download_links[0]}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white pointer-events-none">
                    <Image className="w-3.5 h-3.5" /> Post Image
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={result.download_links[carouselIndex]}
                    alt={`Preview slide ${carouselIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-xs font-bold text-white pointer-events-none">
                    <Layers className="w-3.5 h-3.5" /> Carousel ({carouselIndex + 1}/{result.download_links.length})
                  </div>
                  {/* Slider Controls */}
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between pointer-events-none">
                    <button
                      disabled={carouselIndex === 0}
                      onClick={() => setCarouselIndex(prev => prev - 1)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-white disabled:opacity-40 hover:bg-black/80 transition-colors pointer-events-auto cursor-pointer"
                    >
                      &larr;
                    </button>
                    <button
                      disabled={carouselIndex === result.download_links.length - 1}
                      onClick={() => setCarouselIndex(prev => prev + 1)}
                      className="p-2 rounded-xl bg-black/60 border border-white/10 text-white disabled:opacity-40 hover:bg-black/80 transition-colors pointer-events-auto cursor-pointer"
                    >
                      &rarr;
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Actions */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 border border-primary-500/20">
                    Ready to Save
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    ID: {result.shortcode}
                  </span>
                </div>

                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6 italic">
                  &ldquo;{result.caption}&rdquo;
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      triggerDownloadFile(
                        result.download_links[result.media_type === 'carousel' ? carouselIndex : 0],
                        `mellow-${result.shortcode}-${result.media_type === 'carousel' ? carouselIndex + 1 : 'download'}`
                      )
                    }
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-primary-500/20 cursor-pointer"
                  >
                    <Download className="w-5 h-5" /> Download Media File
                  </button>

                  {user && result.db_record_id && (
                    <button
                      onClick={handleFavorite}
                      disabled={favLoading}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isFavorited
                          ? 'border-accent-500/30 bg-accent-500/10 text-accent-500'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-accent-500'
                      }`}
                      aria-label="Add to favorites"
                    >
                      {favLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isFavorited ? (
                        <Heart className="w-5 h-5 fill-accent-500" />
                      ) : (
                        <Heart className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>

                {!user && (
                  <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1.5">
                    <span>💡 Sign in to unlock download logs and save to favorites!</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
