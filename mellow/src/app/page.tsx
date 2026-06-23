'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import DownloaderForm from '@/components/DownloaderForm';
import { Sparkles, Download, ShieldCheck, Heart, History, HelpCircle, Star, ArrowRight, Zap, Eye, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Zap,
      title: 'High-Speed Extractions',
      desc: 'Connect to our high-performance CDN to fetch videos and images in fractions of a second.',
      glow: 'shadow-blue-500/10'
    },
    {
      icon: ShieldCheck,
      title: 'Supabase RLS Protected',
      desc: 'All search history logs and collection entries are protected behind strict Row Level Security rules.',
      glow: 'shadow-emerald-500/10'
    },
    {
      icon: Heart,
      title: 'Custom Favorites Folder',
      desc: 'Organize your downloaded items by saving them into custom collections and favorites folders.',
      glow: 'shadow-pink-500/10'
    },
    {
      icon: History,
      title: 'Real-time History logs',
      desc: 'Automatically keep track of downloaded media files and search queries with delete support.',
      glow: 'shadow-purple-500/10'
    }
  ];

  const faqs = [
    {
      q: 'Is it free to use Mellow?',
      a: 'Yes, Mellow is 100% free for public usage. You can download unlimited reels and posts. Authenticated accounts receive free access to logs and favorites management.'
    },
    {
      q: 'Do I need to sign in to download content?',
      a: 'No! You can paste any Instagram Reel or Post link and download it anonymously. Signing up is optional but allows you to save favorites and track history.'
    },
    {
      q: 'Which media types are supported?',
      a: 'We support Instagram Reels, single photo posts, video posts, and carousel uploads. Slide previews are rendered for carousel posts.'
    },
    {
      q: 'Are the media downloads safe?',
      a: 'Absolutely. We proxy CDN links directly from Instagram servers. No malware, no ads, and no cookies are embedded.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Content Creator',
      text: 'Mellow is hands-down the fastest Instagram downloader. The glassmorphic design is beautiful, and saving to favorites saves me so much time!',
      stars: 5
    },
    {
      name: 'David Chen',
      role: 'Social Media Manager',
      text: 'An absolute lifesaver. The admin panel and download statistics let us track usage spikes, and the UI looks incredibly futuristic.',
      stars: 5
    },
    {
      name: 'Elena Rostova',
      role: 'UI Designer',
      text: 'Stunning interface. The floating particle background and animations make downloading content feel premium. 10/10.',
      stars: 5
    }
  ];

  return (
    <div className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pb-28 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 text-primary-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Next-gen Media Downloader
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-[1.15]"
        >
          Download Instagram Media <br className="hidden sm:inline" />
          <span className="text-gradient">Instantly and Effortlessly</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Save Reels, high-res photos, and carousel uploads in high definition. Organize downloads with bookmarks, check statistics, and manage history.
        </motion.p>

        {/* Downloader Form */}
        <DownloaderForm />
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-black/5 dark:bg-white/[0.01] border-y border-white/5 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gradient mb-4">
              Designed for Speed & Security
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Explore custom features built with Next.js 15 and Supabase for the ultimate media downloading utility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`glass-panel rounded-3xl p-6 hover:shadow-xl ${f.glow} hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-5 border border-primary-500/20 text-primary-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gradient mb-4">
              Get Media in 3 Simple Steps
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Save your favorite posts locally in high resolution under 15 seconds.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t border-dashed border-white/10 -z-10"></div>
            {[
              { num: '01', title: 'Copy URL', desc: 'Copy any Instagram Reel or Post link from your phone or desktop.' },
              { num: '02', title: 'Paste & Fetch', desc: 'Paste the URL into our smart search bar and hit the fetch button.' },
              { num: '03', title: 'Save Local', desc: 'Download the source file directly to your system storage.' }
            ].map((step, i) => (
              <div key={i} className="flex-1 glass-panel rounded-3xl p-6 flex flex-col items-center text-center relative border border-white/5">
                <span className="text-3xl font-extrabold text-primary-500/20 absolute top-4 right-6">{step.num}</span>
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-primary-500/10 mb-4">
                  {i + 1}
                </div>
                <h4 className="font-bold mb-2">{step.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-black/5 dark:bg-white/[0.01] border-y border-white/5 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gradient mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find quick answers to common queries regarding downloading and security.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-sm md:text-base hover:text-primary-500 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    activeFaq === i ? 'max-h-40 pb-5 border-t border-white/5 pt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed' : 'max-h-0'
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-gradient mb-4">
              Loved by Thousands of Users
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See what creators and managers have to say about the Mellow experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/5">
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs md:text-sm">{t.name}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{t.role}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      {!user && (
        <section className="py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto glass-panel-glow rounded-3xl p-10 flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-gradient">
              Unlock Your Premium Dashboard
            </h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
              Sign up today to track your download history, sync bookmarks across devices, and organize your favorite media in custom collections.
            </p>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
            >
              Sign Up Now &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
