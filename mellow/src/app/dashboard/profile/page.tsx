'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2, User as UserIcon, Mail, ShieldAlert, BadgeInfo, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
  const router = useRouter();
  const { user, authLoading, refreshProfile } = useAuth();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace('/login');
      } else {
        setName(user.name || '');
        setAvatarUrl(user.avatar_url || '');
      }
    }
  }, [user, authLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateErr } = await supabase
        .from('users')
        .update({
          name,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile details.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <span className="text-sm font-semibold text-gray-400">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-white/5">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2">
          <UserIcon className="w-6 h-6 text-primary-500" />
          Profile Settings
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          Customize your profile credentials and avatar links.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-8">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-500"
              onError={() => setAvatarUrl('')}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-500/20 text-primary-500 flex items-center justify-center text-2xl font-bold border border-primary-500/20">
              {name ? name.charAt(0).toUpperCase() : <UserIcon className="w-6 h-6" />}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-extrabold text-lg">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-white/10 dark:border-white/5 bg-white/5 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm font-semibold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl border border-white/10 dark:border-white/5 bg-white/5 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm font-semibold"
            />
          </div>

          {/* Account Role / Meta Info */}
          <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
            <BadgeInfo className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Level</span>
              <span className="text-xs font-bold text-gradient capitalize flex items-center gap-1 mt-0.5">
                {user?.user_role === 'admin' ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5 text-accent-500" /> Administrator Privilege
                  </>
                ) : (
                  'Standard Member'
                )}
              </span>
            </div>
          </div>

          {/* Status alerts */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle className="w-4.5 h-4.5" /> Profile settings updated successfully!
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs font-bold"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-primary-500/10 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
