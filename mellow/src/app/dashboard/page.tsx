'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Download, Favorite, DashboardStats } from '@/types';
import AnalyticsCards from '@/components/AnalyticsCards';
import DownloadHistory from '@/components/DownloadHistory';
import { Loader2, Sparkles, AlertCircle, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // list of download_ids
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalDownloads: 0,
    downloadsThisWeek: 0,
    mostDownloadedType: 'N/A',
  });

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Fetch Downloads history
      const { data: downloadsData, error: downloadsErr } = await supabase
        .from('downloads')
        .select('*')
        .eq('user_id', user.id)
        .order('downloaded_at', { ascending: false });

      if (downloadsErr) throw downloadsErr;

      // 2. Fetch Favorites list
      const { data: favoritesData, error: favoritesErr } = await supabase
        .from('favorites')
        .select('download_id')
        .eq('user_id', user.id);

      if (favoritesErr) throw favoritesErr;

      const favIds = (favoritesData || []).map((f) => f.download_id);

      setDownloads(downloadsData || []);
      setFavoriteIds(favIds);

      // 3. Compute Stats
      computeAnalytics(downloadsData || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const computeAnalytics = (data: Download[]) => {
    const total = data.length;
    
    // Weekly calculation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thisWeek = data.filter((d) => new Date(d.downloaded_at) >= sevenDaysAgo).length;

    // Type frequencies
    const frequencies = { reel: 0, image: 0, carousel: 0 };
    data.forEach((d) => {
      if (d.media_type in frequencies) {
        frequencies[d.media_type as 'reel' | 'image' | 'carousel']++;
      }
    });

    let topType: 'reel' | 'image' | 'carousel' | 'N/A' = 'N/A';
    let maxCount = 0;
    Object.entries(frequencies).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topType = type as 'reel' | 'image' | 'carousel';
      }
    });

    setStats({
      totalDownloads: total,
      downloadsThisWeek: thisWeek,
      mostDownloadedType: topType,
    });
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading, router]);

  const handleDeleteHistory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state
      const updated = downloads.filter((d) => d.id !== id);
      setDownloads(updated);
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id));
      computeAnalytics(updated);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleToggleFavorite = async (downloadId: string, isFav: boolean) => {
    if (!user) return;
    try {
      if (isFav) {
        // Unfavorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('download_id', downloadId);

        if (error) throw error;
        setFavoriteIds(favoriteIds.filter((id) => id !== downloadId));
      } else {
        // Favorite
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            download_id: downloadId,
          });

        if (error) throw error;
        setFavoriteIds([...favoriteIds, downloadId]);
      }
    } catch (err) {
      console.error('Toggle favorite failed:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="text-sm font-semibold text-gray-400">Loading your space...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-primary-500" />
            Dashboard
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Hi {user?.name || 'User'}, manage and monitor your fetched media files.
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center gap-1.5 shadow-lg shadow-primary-500/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> New Download
        </Link>
      </div>

      {/* Analytics widgets */}
      <AnalyticsCards stats={stats} />

      {/* History widget */}
      <DownloadHistory
        downloads={downloads}
        favorites={favoriteIds}
        onDelete={handleDeleteHistory}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
