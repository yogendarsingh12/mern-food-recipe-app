import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  UtensilsCrossed, 
  ChefHat, 
  User, 
  Share2, 
  Printer, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Maximize2, 
  Minimize2, 
  Type, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';

export default function RecipeModal({ recipe, onClose }) {
  const { lang, t } = useLanguage();
  const displayRecipe = getTranslatedRecipe(recipe, lang);

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [servingScale, setServingScale] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Interactive View Modes: 'standard' | 'theater' | 'cooking-focus'
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'xl'

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isExpanded]);

  // Kitchen Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert(`⏰ ${t('kitchenTimer')}: ${displayRecipe.title}!`);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, displayRecipe.title, t]);

  if (!recipe) return null;

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayRecipe.title,
        text: displayRecipe.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe URL copied to clipboard! 📋');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const getInstructionFontSize = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg leading-relaxed';
    if (fontSize === 'xl') return 'text-lg sm:text-2xl leading-loose font-medium';
    return 'text-sm sm:text-base leading-relaxed';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Dynamic Modal Card (Standard vs Expanded Fullscreen Theater Mode) */}
      <div
        className={`relative bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden z-10 my-auto flex flex-col border border-stone-200 dark:border-zinc-800 transition-all duration-300 ${
          isExpanded
            ? 'w-full max-w-7xl h-[96vh] rounded-3xl sm:rounded-[40px]'
            : 'w-full max-w-4xl max-h-[94vh] rounded-3xl sm:rounded-[36px]'
        }`}
      >
        {/* Cinematic Header Image */}
        <div className={`relative w-full bg-stone-900 shrink-0 transition-all duration-300 ${isExpanded ? 'h-64 sm:h-80' : 'h-64 sm:h-96'}`}>
          <img
            src={displayRecipe.imageUrl}
            alt={displayRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Top Floating Control Bar */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Font Size Adjuster for Kitchen Cooking Mode */}
            <div className="flex items-center bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/20">
              <button
                type="button"
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xl' : 'normal')}
                title={`Text Size: ${fontSize.toUpperCase()}`}
                className="px-2.5 py-1 text-white text-xs font-bold flex items-center gap-1 hover:text-amber-400 transition-colors"
              >
                <Type className="w-3.5 h-3.5" />
                <span className="font-mono text-[10px] uppercase">{fontSize}</span>
              </button>
            </div>

            {/* Expand / Maximize Screen Size Toggle Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Exit Expanded View (Standard Mode)' : 'Expand to Fullscreen Theater View'}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105 border ${
                isExpanded
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-black/40 hover:bg-black/70 text-white border-white/20'
              }`}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Print Recipe */}
            <button
              onClick={handlePrint}
              title={t('print')}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Share Recipe */}
            <button
              onClick={handleShare}
              title={t('share')}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              title="Close modal"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Metadata Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white z-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-orange-200 font-semibold mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
                <User className="w-3.5 h-3.5" />
                <span>{displayRecipe.user?.name || displayRecipe.authorName || 'Community Chef'}</span>
              </span>
              {formattedDate && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedDate}</span>
                </span>
              )}
              {isExpanded && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 backdrop-blur-md border border-amber-400/30 font-bold">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Cinematic Full View</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight font-display drop-shadow-md">
              {displayRecipe.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body with Side-by-Side on Expanded Mode */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
          {/* Description Callout */}
          {displayRecipe.description && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-zinc-850 dark:to-zinc-800 border border-orange-200/80 dark:border-zinc-700 rounded-2xl p-5 text-stone-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed italic shadow-xs">
              "{displayRecipe.description}"
            </div>
          )}

          {/* Layout Split when Expanded: 2 Columns on Lg screens */}
          <div className={isExpanded ? 'grid grid-cols-1 lg:grid-cols-12 gap-8' : 'space-y-8'}>
            {/* Left Column in Expanded View (Tools & Ingredients) */}
            <div className={isExpanded ? 'lg:col-span-5 space-y-6' : 'space-y-6'}>
              {/* Interactive Kitchen Tools: Servings Scaler & Kitchen Timer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Servings Scaler */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-850/80 border border-stone-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-5 h-5 text-brand-600 dark:text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{t('servingsScale')}</p>
                      <p className="text-[10px] text-stone-500 dark:text-zinc-400">Scale portions</p>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-stone-200 dark:border-zinc-700">
                    {[1, 2, 3].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setServingScale(scale)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                          servingScale === scale
                            ? 'bg-brand-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
                        }`}
                      >
                        {scale}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Built-in Kitchen Timer */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-zinc-850/80 border border-stone-200 dark:border-zinc-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{t('kitchenTimer')}</p>
                      <p className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatTimer(timerSeconds)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {timerSeconds === 0 ? (
                      <div className="flex gap-1">
                        {[5, 10, 15].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => {
                              setTimerSeconds(mins * 60);
                              setIsTimerRunning(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 text-[11px] font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-100"
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setIsTimerRunning(!isTimerRunning)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white"
                        >
                          {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            setIsTimerRunning(false);
                            setTimerSeconds(0);
                          }}
                          className="p-1.5 rounded-lg bg-stone-200 dark:bg-zinc-700 text-stone-700 dark:text-zinc-300"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                    <UtensilsCrossed className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    <span>{t('ingredientsChecklist')}</span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300">
                      {displayRecipe.ingredients?.length || 0} items ({servingScale}x)
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {displayRecipe.ingredients?.map((ingredient, idx) => {
                    const isChecked = !!checkedIngredients[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleIngredient(idx)}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                          isChecked
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-stone-400 dark:text-zinc-500 line-through'
                            : 'bg-stone-50/80 dark:bg-zinc-850/80 hover:bg-orange-50/50 dark:hover:bg-zinc-800 border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 font-medium'
                        }`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-400 dark:text-zinc-600 shrink-0" />
                        )}
                        <span className="text-sm">{ingredient}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column in Expanded View (Cooking Masterclass Instructions) */}
            <div className={isExpanded ? 'lg:col-span-7' : ''}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2 font-display">
                  <ChefHat className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>{t('cookingInstructions')}</span>
                </h3>
              </div>

              <div className={`bg-stone-50 dark:bg-zinc-850/80 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-200 whitespace-pre-line shadow-xs ${getInstructionFontSize()}`}>
                {displayRecipe.instructions}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-zinc-950 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 dark:text-zinc-400 font-semibold">
              Bon Appétit! 👨‍🍳
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-brand-600 dark:text-amber-400 font-bold hover:underline hidden sm:inline"
            >
              {isExpanded ? 'Switch to Standard Modal' : 'Switch to Fullscreen Theater View ↗'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-zinc-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold text-xs sm:text-sm transition-colors shadow-md"
            >
              {t('doneCooking')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
