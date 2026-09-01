import React from 'react';
import { LayoutDashboard, BookOpen, Users, Server, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AdminSidebar({ activeTab, setActiveTab, counts }) {
  const { t } = useLanguage();

  const tabs = [
    {
      id: 'dashboard',
      label: t('overview'),
      icon: LayoutDashboard,
    },
    {
      id: 'recipes',
      label: t('recipes'),
      icon: BookOpen,
      badge: counts.recipes,
    },
    {
      id: 'users',
      label: t('users'),
      icon: Users,
      badge: counts.users,
    },
    {
      id: 'settings',
      label: t('adminTeam'),
      icon: Shield,
    },
    {
      id: 'system',
      label: t('systemHealth'),
      icon: Server,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 sm:pb-0 bg-white dark:bg-zinc-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel -mx-2 px-2 sm:mx-0 sm:px-2 transition-colors">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shrink-0 select-none ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/70'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black ${
                  isActive
                    ? 'bg-zinc-950 text-amber-400'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
