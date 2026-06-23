import React from 'react';
import { Download, Calendar, Activity, BarChart2 } from 'lucide-react';
import { DashboardStats } from '@/types';

interface AnalyticsCardsProps {
  stats: DashboardStats;
}

export default function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Total Downloads',
      value: stats.totalDownloads,
      icon: Download,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-500',
      description: 'Lifetime media fetches',
    },
    {
      title: 'This Week',
      value: stats.downloadsThisWeek,
      icon: Calendar,
      color: 'from-accent-500/20 to-rose-500/20 text-accent-500',
      description: 'Downloads in last 7 days',
    },
    {
      title: 'Top Media Type',
      value: stats.mostDownloadedType.toUpperCase() || 'N/A',
      icon: Activity,
      color: 'from-purple-500/20 to-violet-500/20 text-purple-500',
      description: 'Your favorite format',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-panel rounded-3xl p-6 relative overflow-hidden flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-400">{c.title}</span>
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {c.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {c.description}
              </span>
            </div>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
