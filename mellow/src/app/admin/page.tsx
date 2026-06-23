'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { User, AdminStats } from '@/types';
import { ShieldAlert, Loader2, Users, Ban, ShieldCheck, Download, Activity, EyeOff, BarChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  
  const [usersList, setUsersList] = useState<User[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  const [stats, setStats] = useState<AdminStats>({
    totalDownloads: 0,
    downloadsThisWeek: 0,
    mostDownloadedType: 'N/A',
    totalUsers: 0,
    bannedUsers: 0,
  });

  const loadAdminData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch admin data');

      setUsersList(data.users || []);
      setDownloads(data.downloads || []);

      // Calculate stats
      const totalDownloads = data.downloadsCount;
      const bannedCount = (data.users || []).filter((u: User) => u.is_banned).length;

      // Downloads this week
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weeklyDownloads = (data.downloads || []).filter((d: any) => new Date(d.downloaded_at) >= sevenDaysAgo).length;

      // Type frequencies
      const frequencies = { reel: 0, image: 0, carousel: 0 };
      (data.downloads || []).forEach((d: any) => {
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
        totalDownloads,
        downloadsThisWeek: weeklyDownloads,
        mostDownloadedType: topType,
        totalUsers: (data.users || []).length,
        bannedUsers: bannedCount,
      });
    } catch (err) {
      console.error('Admin panel load error:', err);
      router.replace('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else if (user.user_role !== 'admin') {
        router.replace('/dashboard');
      } else {
        loadAdminData();
      }
    }
  }, [user, authLoading, router]);

  const handleToggleBan = async (targetUserId: string, currentBanState: boolean) => {
    setActionLoadingId(targetUserId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          targetUserId,
          isBanned: !currentBanState,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to toggle user ban state');

      // Update state local
      const updatedList = usersList.map((u) =>
        u.id === targetUserId ? { ...u, is_banned: !currentBanState } : u
      );
      setUsersList(updatedList);
      setStats((prev) => ({
        ...prev,
        bannedUsers: prev.bannedUsers + (currentBanState ? -1 : 1),
      }));
    } catch (err: any) {
      alert(err.message || 'Error occurred during target ban update.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="text-sm font-semibold text-gray-400">Loading system parameters...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-white/5">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <ShieldAlert className="w-6 h-6 text-accent-500 animate-pulse" />
          System Administration Panel
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Monitor user accounts, downloads volume, and manage ban lists.
        </p>
      </div>

      {/* Admin stats widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
          { title: 'Banned Users', value: stats.bannedUsers, icon: Ban, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
          { title: 'System Downloads', value: stats.totalDownloads, icon: Download, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
          { title: 'Weekly Downloads', value: stats.downloadsThisWeek, icon: Activity, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-panel rounded-3xl p-5 flex items-center justify-between border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.title}</span>
                <span className="text-2xl font-extrabold tracking-tight mt-1">{c.value}</span>
              </div>
              <div className={`p-3 rounded-xl border ${c.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* User Directory */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-gradient text-sm md:text-base">User Database</h3>
          <span className="text-xs font-mono text-gray-400">Total Profile Nodes: {usersList.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-gray-400 uppercase font-bold tracking-wider">
                <th className="p-4 pl-6">Profile</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">User Level</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 pr-6 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors font-medium">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.name || 'User'} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-500 font-bold flex items-center justify-center">
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="font-bold">{u.name}</span>
                  </td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4 capitalize">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.user_role === 'admin'
                        ? 'border-accent-500/20 bg-accent-500/10 text-accent-500'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}>
                      {u.user_role}
                    </span>
                  </td>
                  <td className="p-4">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4 pr-6 text-right">
                    {u.user_role === 'admin' ? (
                      <span className="text-[10px] text-gray-500 font-bold italic">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleToggleBan(u.id, u.is_banned)}
                        disabled={actionLoadingId === u.id}
                        className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] transition-all cursor-pointer inline-flex items-center gap-1 ${
                          u.is_banned
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                            : 'border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                        }`}
                      >
                        {actionLoadingId === u.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : u.is_banned ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" /> Lift Ban
                          </>
                        ) : (
                          <>
                            <Ban className="w-3.5 h-3.5" /> Ban User
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
