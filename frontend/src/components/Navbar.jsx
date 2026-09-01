import React, { useState } from 'react';
import { Utensils, Plus, Compass, Sparkles, LogIn, LogOut, User, ChefHat, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-xl border-b border-stone-200/80 dark:border-zinc-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 shrink-0">
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white font-display">
                  Vyanjan
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-[10px] sm:text-[11px] font-bold text-stone-400 dark:text-zinc-500 -mt-1 tracking-widest uppercase hidden xs:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Explore Feed */}
            <button
              onClick={() => handleTabClick('home')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-stone-900 dark:bg-zinc-800 text-white shadow-md'
                  : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-zinc-850'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('explore')}</span>
            </button>

            {/* My Kitchen */}
            {user && (
              <button
                onClick={() => handleTabClick('my-recipes')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                  activeTab === 'my-recipes'
                    ? 'bg-stone-900 dark:bg-zinc-800 text-white shadow-md'
                    : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-zinc-850'
                }`}
              >
                <ChefHat className="w-4 h-4 text-brand-500" />
                <span>{t('myKitchen')}</span>
              </button>
            )}

            {/* Share Recipe Button */}
            <button
              onClick={() => handleTabClick('add')}
              className={`flex items-center space-x-2 px-4 lg:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-md ${
                activeTab === 'add'
                  ? 'bg-brand-700 text-white ring-2 ring-brand-400 ring-offset-2 shadow-glow'
                  : 'bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 text-white shadow-brand-500/25 hover:shadow-glow hover:-translate-y-0.5'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('shareRecipe')}</span>
            </button>

            {/* Multi-Language Selector */}
            <LanguageSelector />

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            {/* User Profile / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-3 border-l border-stone-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 dark:bg-zinc-850 border border-stone-200/80 dark:border-zinc-800">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white text-[11px] font-black flex items-center justify-center">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-xs font-bold text-stone-800 dark:text-zinc-200">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title={t('signOut')}
                  className="p-2.5 rounded-2xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-stone-300 dark:border-zinc-700 font-bold text-xs sm:text-sm text-stone-800 dark:text-zinc-200 hover:border-stone-900 dark:hover:border-white hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-950 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('signIn')}</span>
              </button>
            )}
          </div>

          {/* Mobile Right Actions: Language + Theme Toggle + Hamburger Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <LanguageSelector />
            <ThemeToggle className="p-2" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-2xl border-b border-stone-200 dark:border-zinc-800 px-4 py-5 space-y-3 shadow-xl animate-fadeIn">
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-50/80 dark:bg-zinc-900 border border-orange-200/60 dark:border-zinc-800 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-bold flex items-center justify-center">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs font-bold text-stone-900 dark:text-white truncate">{user.name}</p>
                <p className="text-[11px] text-stone-500 dark:text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => handleTabClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left transition-colors ${
              activeTab === 'home'
                ? 'bg-stone-900 dark:bg-zinc-800 text-white'
                : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{t('explore')}</span>
          </button>

          {user && (
            <button
              onClick={() => handleTabClick('my-recipes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left transition-colors ${
                activeTab === 'my-recipes'
                  ? 'bg-stone-900 dark:bg-zinc-800 text-white'
                  : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-850'
              }`}
            >
              <ChefHat className="w-4 h-4 text-brand-500" />
              <span>{t('myKitchen')}</span>
            </button>
          )}

          <button
            onClick={() => handleTabClick('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-left transition-colors ${
              activeTab === 'add'
                ? 'bg-stone-900 dark:bg-zinc-800 text-white'
                : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-850'
            }`}
          >
            <Plus className="w-4 h-4 text-brand-500 stroke-[3]" />
            <span>{t('shareRecipe')}</span>
          </button>

          <div className="pt-3 border-t border-stone-200 dark:border-zinc-800">
            {user ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('signOut')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('signIn')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
