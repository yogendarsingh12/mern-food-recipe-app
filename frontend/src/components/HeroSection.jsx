import React from 'react';
import { Search, Sparkles, X, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CATEGORIES = [
  { id: 'All', key: 'catAll', emoji: '🍽️' },
  { id: 'Italian', key: 'catItalian', emoji: '🍕' },
  { id: 'Indian', key: 'catIndian', emoji: '🍛' },
  { id: 'Asian', key: 'catAsian', emoji: '🍜' },
  { id: 'Burger', key: 'catBurger', emoji: '🍔' },
  { id: 'Healthy', key: 'catHealthy', emoji: '🥗' },
  { id: 'Breakfast', key: 'catBreakfast', emoji: '🥞' },
  { id: 'Desserts', key: 'catDesserts', emoji: '🍰' },
];

const TRENDING_TAGS = ['Tuscan Chicken', 'Margherita Pizza', 'Butter Chicken', 'Smash Burger', 'Tiramisu'];

export default function HeroSection({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, totalRecipes }) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-100/70 via-amber-50/40 to-[#fafaf9] dark:from-zinc-950 dark:via-zinc-900/80 dark:to-[#09090b] pt-10 pb-14 sm:pt-18 sm:pb-22 border-b border-stone-200/70 dark:border-zinc-800/80 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-400/20 via-amber-400/15 to-rose-400/15 dark:from-brand-500/10 dark:via-amber-500/5 dark:to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top floating pill badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl border border-orange-200/90 dark:border-zinc-700/90 text-brand-900 dark:text-amber-400 text-xs font-black tracking-wider uppercase shadow-md shadow-orange-500/5 mb-6 animate-pulse-slow">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400 fill-brand-600 dark:fill-amber-400" />
          <span>{t('heroBadge')}</span>
          <span className="text-stone-300 dark:text-zinc-700">&bull;</span>
          <span className="text-stone-600 dark:text-zinc-400 font-bold">{totalRecipes} Recipes</span>
        </div>

        {/* Main Editorial Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-stone-950 dark:text-white tracking-tight font-display leading-[1.08]">
          {t('heroTitle1')} <br />
          <span className="bg-gradient-to-r from-brand-600 via-orange-500 to-amber-500 dark:from-brand-400 dark:via-orange-300 dark:to-amber-300 bg-clip-text text-transparent drop-shadow-xs">
            {t('heroTitle2')}
          </span>
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-600 dark:text-zinc-400 font-medium leading-relaxed">
          {t('heroSubtitle')}
        </p>

        {/* Search Bar Input Container with Glow */}
        <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white dark:bg-zinc-900/95 rounded-2xl sm:rounded-3xl shadow-2xl shadow-stone-200/80 dark:shadow-black/60 border border-stone-200 dark:border-zinc-800 p-2 sm:p-2.5 focus-within:ring-4 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all duration-300">
            <div className="pl-3 sm:pl-4 pr-2 sm:pr-3 text-stone-400 dark:text-zinc-500">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-brand-600 dark:text-amber-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full py-2.5 sm:py-3.5 text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 bg-transparent text-sm sm:text-base font-medium focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 rounded-full mr-1.5 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Trending Tags */}
          <div className="mt-3.5 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-stone-500 dark:text-zinc-400 font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
              <span>{t('trending')}:</span>
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-zinc-850 hover:bg-orange-50 dark:hover:bg-zinc-800 border border-stone-200/80 dark:border-zinc-750 text-stone-700 dark:text-zinc-300 font-semibold text-[11px] transition-all hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills with 100% i18n Translation */}
        <div className="mt-8 sm:mt-10 flex items-center sm:justify-center overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 sm:gap-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-orange-500 text-white shadow-lg shadow-brand-500/25 scale-105 ring-2 ring-brand-400 ring-offset-2 dark:ring-offset-zinc-950'
                    : 'bg-white dark:bg-zinc-900 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200/90 dark:border-zinc-800 shadow-xs hover:-translate-y-0.5'
                }`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span>{t(cat.key)}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Metrics Bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-orange-200/50 dark:border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-stone-200/60 dark:border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white font-display">20+</p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{t('dishesCount')}</p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-stone-200/60 dark:border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400 font-display">4.9 ★</p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{t('rating')}</p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-stone-200/60 dark:border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-display">100%</p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{t('freeAccess')}</p>
          </div>
          <div className="p-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-stone-200/60 dark:border-zinc-800/60">
            <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-display">Cloud</p>
            <p className="text-xs text-stone-500 dark:text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{t('cloudSync')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
