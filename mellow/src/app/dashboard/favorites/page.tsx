'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Favorite, Download } from '@/types';
import { Loader2, Heart, Play, Image, Layers, Trash2, Download as DownloadIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Favorites() {
  const router = useRouter();
  const { user, authLoading } = useAuth();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, download:downloads(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        fetchFavorites();
      }
    }
  }, [user, authLoading, router]);

  const handleUnfavorite = async (favId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favId);

      if (error) throw error;
      setFavorites(favorites.filter((f) => f.id !== favId));
    } catch (err) {
      console.error('Failed to unfavorite:', err);
    }
  };

  const triggerDownload = (d: Download) => {
    try {
      const a = document.createElement('a');
      a.href = d.thumbnail || ''; // In real app, download link is stored or retrieved
      a.download = `mellow-fav-${d.id}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download trigger failed:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="text-sm font-semibold text-gray-400">Loading your favorites...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-white/5">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <Heart className="w-6 h-6 text-accent-500 fill-accent-500" />
          Saved Favorites
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Access your bookmarked media files and collection snapshots.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-panel rounded-3xl py-16 px-6 text-center text-gray-400">
          <p className="text-sm font-semibold">No favorites saved yet.</p>
          <p className="text-xs mt-1">Bookmark downloads from the home preview card to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {favorites.map((fav) => {
              const d = fav.download;
              if (!d) return null;
              return (
                <motion.div
                  key={fav.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel rounded-3xl overflow-hidden border border-white/10 group relative flex flex-col justify-between"
                >
                  {/* Image banner */}
                  <div className="w-full aspect-[16/10] bg-black/30 overflow-hidden relative border-b border-white/5 flex items-center justify-center">
                    {d.thumbnail ? (
                      <img
                        src={d.thumbnail}
                        alt="Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-900/40 to-accent-900/40 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-accent-400" />
                      </div>
                    )}
                    {/* Media Type badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[10px] font-bold text-white uppercase">
                      {d.media_type === 'reel' ? (
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      ) : d.media_type === 'image' ? (
                        <Image className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Layers className="w-3.5 h-3.5 text-white" />
                      )}
                      {d.media_type}
                    </div>
                  </div>

                  {/* Details and Actions */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <a
                        href={d.media_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:underline flex items-center gap-1 mb-4 truncate w-full"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {d.media_url}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                      <button
                        onClick={() => triggerDownload(d)}
                        className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary-500/10 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" /> Download
                      </button>

                      <button
                        onClick={() => handleUnfavorite(fav.id)}
                        className="p-2 rounded-xl border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-rose-500 transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
