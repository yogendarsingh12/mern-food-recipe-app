import React, { useState } from 'react';
import { X, Layers, ChefHat, Clock, UtensilsCrossed, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';

export default function RecipePreviewModal({ recipe, onClose }) {
  const { lang } = useLanguage();
  const displayRecipe = getTranslatedRecipe(recipe, lang);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 z-10 my-auto flex flex-col transition-all duration-300 ${
          isExpanded
            ? 'w-full max-w-6xl h-[95vh] rounded-3xl sm:rounded-[36px]'
            : 'w-full max-w-3xl max-h-[90vh] rounded-3xl'
        }`}
      >
        {/* Cinematic Header Image */}
        <div className={`relative w-full bg-stone-900 shrink-0 transition-all duration-300 ${isExpanded ? 'h-72 sm:h-80' : 'h-64 sm:h-72'}`}>
          <img
            src={displayRecipe.imageUrl}
            alt={displayRecipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Standard View' : 'Maximize Preview'}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-md inline-block">
                Chef {displayRecipe.user?.name || displayRecipe.authorName || 'Community Chef'}
              </span>
              {isExpanded && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Maximized View</span>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display">{displayRecipe.title}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {displayRecipe.description && (
            <p className="text-slate-600 dark:text-zinc-300 italic bg-slate-50 dark:bg-zinc-950 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 leading-relaxed">
              "{displayRecipe.description}"
            </p>
          )}

          {/* Grid Layout on expanded */}
          <div className={isExpanded ? 'grid grid-cols-1 md:grid-cols-12 gap-8' : 'space-y-6'}>
            {/* Ingredients */}
            <div className={isExpanded ? 'md:col-span-5' : ''}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3 font-display">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                <span>Ingredients ({displayRecipe.ingredients?.length || 0})</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {displayRecipe.ingredients?.map((ing, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium"
                  >
                    &bull; {ing}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className={isExpanded ? 'md:col-span-7' : ''}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-3 font-display">
                <ChefHat className="w-4 h-4 text-amber-500" />
                <span>Cooking Instructions</span>
              </h3>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed text-sm">
                {displayRecipe.instructions}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
          >
            {isExpanded ? 'Switch to Standard Size' : 'Maximize Size (Theater View)'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
