'use client';

import React, { useState } from 'react';
import { Download as DownloadType } from '@/types';
import { Play, Image, Layers, Trash2, Heart, ExternalLink, Download, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadHistoryProps {
  downloads: DownloadType[];
  favorites: string[]; // list of download IDs that are favorited
  onDelete: (id: string) => Promise<void>;
  onToggleFavorite: (downloadId: string, isFav: boolean) => Promise<void>;
}

export default function DownloadHistory({
  downloads,
  favorites,
  onDelete,
  onToggleFavorite,
}: DownloadHistoryProps) {
  const [search, setSearch] = useState('');

  const filtered = downloads.filter((d) =>
    d.media_url.toLowerCase().includes(search.toLowerCase()) ||
    d.media_type.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMediaBadge = (type: string) => {
    switch (type) {
      case 'reel':
        return <Play className="w-3.5 h-3.5 fill-white text-white" />;
      case 'image':
        return <Image className="w-3.5 h-3.5 text-white" />;
      case 'carousel':
        return <Layers className="w-3.5 h-3.5 text-white" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Search Filter Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gradient">Download History</h3>
        <div className="w-full md:w-80 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search history by URL or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 dark:border-white/5 bg-white/5 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm placeholder-gray-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl py-12 px-6 text-center text-gray-400">
          <p className="text-sm font-semibold">No recent downloads found.</p>
          <p className="text-xs mt-1">Start by pasting a link on the home page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((d) => {
              const isFav = favorites.includes(d.id);
              return (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel rounded-3xl overflow-hidden border border-white/10 group relative flex flex-col justify-between"
                >
                  {/* Thumbnail Banner */}
                  <div className="w-full aspect-[16/10] bg-black/30 overflow-hidden relative border-b border-white/5 flex items-center justify-center">
                    {d.thumbnail ? (
                      <img
                        src={d.thumbnail}
                        alt="Media Thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-900/40 to-accent-900/40 flex items-center justify-center">
                        <Download className="w-8 h-8 text-primary-400" />
                      </div>
                    )}
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[10px] font-bold text-white uppercase">
                      {getMediaBadge(d.media_type)}
                      {d.media_type}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-gray-400 font-semibold mb-2">
                        {formatDate(d.downloaded_at)}
                      </div>
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

                    {/* Actions Panel */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                      <button
                        onClick={() => onToggleFavorite(d.id, isFav)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isFav
                            ? 'border-accent-500/20 bg-accent-500/10 text-accent-500'
                            : 'border-white/10 hover:bg-white/10 text-gray-400 hover:text-accent-500'
                        }`}
                        title={isFav ? 'Remove Favorite' : 'Save to Favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-accent-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => onDelete(d.id)}
                        className="p-2 rounded-xl border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-all cursor-pointer ml-auto"
                        title="Delete from History"
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
