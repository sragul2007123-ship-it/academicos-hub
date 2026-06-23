'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, User, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-gradient">
          Mellow
        </span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-sm font-medium hover:text-primary-500 transition-colors">
          Home
        </Link>
        {user && (
          <>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary-500 transition-colors flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/dashboard/favorites" className="text-sm font-medium hover:text-primary-500 transition-colors flex items-center gap-1">
              <Heart className="w-4 h-4 text-accent-500" /> Favorites
            </Link>
            {user.user_role === 'admin' && (
              <Link href="/admin" className="text-sm font-medium text-accent-500 hover:text-accent-600 transition-colors flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> Admin
              </Link>
            )}
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="hidden md:flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <Link href="/dashboard/profile" className="flex items-center gap-2 group">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border border-primary-500 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
              )}
              <span className="text-sm font-semibold max-w-[120px] truncate group-hover:text-primary-500 transition-colors">
                {user.name}
              </span>
            </Link>
            <button
              onClick={signOut}
              className="p-2.5 rounded-xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold shadow-lg hover:shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg border border-white/10 text-gray-500 dark:text-gray-400 hover:text-primary-500"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-white/10 text-gray-500 dark:text-gray-400"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full glass-panel border-b border-white/10 py-6 px-8 flex flex-col gap-5 md:hidden z-40"
          >
            <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-semibold hover:text-primary-500">
              Home
            </Link>
            {user && (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-semibold hover:text-primary-500 flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/dashboard/favorites" onClick={() => setIsOpen(false)} className="text-base font-semibold hover:text-primary-500 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-accent-500" /> Favorites
                </Link>
                {user.user_role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="text-base font-semibold text-accent-500 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" /> Admin Panel
                  </Link>
                )}
                <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="text-base font-semibold hover:text-primary-500 flex items-center gap-2">
                  <User className="w-5 h-5" /> Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full text-left text-base font-semibold text-rose-500 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
