import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-transparent py-8 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="font-bold text-gradient text-sm">Mellow</span>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} Mellow. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-0.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-accent-500 fill-accent-500" /> for the modern web.
          </span>
        </div>

        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          <a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
