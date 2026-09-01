import React from 'react';
import { BookOpen, Users, Crown, Layers, ArrowUpRight, Clock, ChevronRight, Activity, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';

export default function Dashboard({ stats, onNavigateTab, onPreviewRecipe }) {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Metric Cards with Luxury Glows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Recipes */}
        <div 
          onClick={() => onNavigateTab('recipes')}
          className="bg-white dark:bg-zinc-900/95 hover:bg-slate-50 dark:hover:bg-zinc-850 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:border-amber-400/50 dark:hover:border-amber-500/50 shadow-xs dark:shadow-panel transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{t('totalRecipes')}</span>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {stats?.totalRecipes ?? 0}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t('activeCluster')}</span>
          </p>
        </div>

        {/* Total Registered Chefs */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="bg-white dark:bg-zinc-900/95 hover:bg-slate-50 dark:hover:bg-zinc-850 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:border-blue-400/50 dark:hover:border-blue-500/50 shadow-xs dark:shadow-panel transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{t('registeredChefs')}</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {stats?.totalUsers ?? 0}
          </h3>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t('communityContributors')}</span>
          </p>
        </div>

        {/* Active Admins */}
        <div className="bg-white dark:bg-zinc-900/95 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{t('activeAdmins')}</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {stats?.totalAdmins ?? 1}
          </h3>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-2">{t('executivePrivileges')}</p>
        </div>

        {/* Ingredients Count */}
        <div className="bg-white dark:bg-zinc-900/95 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{t('ingredientsIndex')}</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            {stats?.totalIngredients ?? 0}
          </h3>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-2">{t('uniqueIngredients')}</p>
        </div>
      </div>

      {/* System Pulse & Quick Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t('platformHealth')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Database cluster connected &bull; Cloudinary media stream ready &bull; JWT security verified
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-750 inline-flex items-center gap-1.5 shadow-xs"
          >
            <span>{t('publicApp')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Two Columns: Recent Recipes & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Recipes */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel p-6 sm:p-7 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>{t('recentActivity')}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('recipes')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recentRecipes && stats.recentRecipes.length > 0 ? (
              stats.recentRecipes.map((recipe) => {
                const trans = getTranslatedRecipe(recipe, lang);
                return (
                  <div
                    key={recipe._id}
                    onClick={() => onPreviewRecipe(recipe)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-850/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={recipe.imageUrl}
                        alt={trans.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="max-w-[180px] sm:max-w-xs">
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                          {trans.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-500 truncate">By {recipe.authorName || 'Community Chef'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 flex items-center gap-1 font-mono shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 dark:text-zinc-500 py-8 text-center">No recipes uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Chefs */}
        <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel p-6 sm:p-7 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{t('users')}</span>
            </h3>
            <button
              onClick={() => onNavigateTab('users')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-xs border border-slate-300 dark:border-zinc-700">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === 'admin' 
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400' 
                      : 'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 dark:text-zinc-500 py-8 text-center">No registered users yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
