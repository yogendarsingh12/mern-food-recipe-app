import React from 'react';
import { Crown, LogOut, ExternalLink, Activity, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function AdminNavbar({ adminUser, onLogout }) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800/80 text-slate-900 dark:text-white shadow-xs dark:shadow-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40 shrink-0">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                  Vyanjan
                </span>
                <span className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  {t('studio')}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-zinc-500 -mt-0.5 tracking-wider uppercase hidden xs:block">
                {t('executiveControl')}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Operational Status */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>Platform Online &bull; Active</span>
            </div>

            {/* Public App Link */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all border border-slate-200 dark:border-zinc-800"
            >
              <span>{t('publicApp')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 text-[10px] sm:text-[11px] font-black flex items-center justify-center">
                  {adminUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[90px]">{adminUser.name}</p>
                  <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase">{t('superAdmin')}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title={t('signOut')}
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-slate-400 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-800/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
