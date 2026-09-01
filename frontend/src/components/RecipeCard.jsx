import React, { useState, memo } from 'react';
import { Clock, Eye, Layers, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';
import LazyImage from './LazyImage';

function RecipeCardComponent({ recipe, onSelect }) {
  const { lang, t } = useLanguage();
  const displayRecipe = getTranslatedRecipe(recipe, lang);

  const [isLiked, setIsLiked] = useState(() => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('recipe_likes') || '{}');
      return !!savedLikes[recipe._id];
    } catch {
      return false;
    }
  });

  const toggleLike = (e) => {
    e.stopPropagation();
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    try {
      const savedLikes = JSON.parse(localStorage.getItem('recipe_likes') || '{}');
      if (newLiked) {
        savedLikes[recipe._id] = true;
      } else {
        delete savedLikes[recipe._id];
      }
      localStorage.setItem('recipe_likes', JSON.stringify(savedLikes));
    } catch (err) {
      console.error(err);
    }
  };

  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div 
      onClick={() => onSelect(displayRecipe)}
      className="group relative bg-white dark:bg-zinc-900/95 rounded-3xl sm:rounded-[32px] overflow-hidden border border-stone-200/90 dark:border-zinc-800 shadow-card dark:shadow-card-dark hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer select-none"
    >
      {/* Image Container with Fixed Height and Gradient Scrim */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800 shrink-0">
        <LazyImage
          src={recipe.imageUrl}
          alt={displayRecipe.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-70 group-hover:opacity-50 transition-opacity pointer-events-none" />

        {/* Top Badges Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md text-stone-900 dark:text-zinc-100 text-xs font-black shadow-md">
            <Layers className="w-3.5 h-3.5 text-brand-600 dark:text-amber-400" />
            <span>{displayRecipe.ingredients?.length || 0} {t('ingredients')}</span>
          </span>

          {/* Interactive Favorite / Like button */}
          <button
            onClick={toggleLike}
            title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md ${
              isLiked
                ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
                : 'bg-black/40 hover:bg-black/70 text-white hover:scale-105'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-white stroke-white' : 'stroke-white'}`} />
          </button>
        </div>

        {/* Author badge on bottom of image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white drop-shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-600 to-amber-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
              {(recipe.user?.name || recipe.authorName || 'C').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold truncate max-w-[140px]">
              {recipe.user?.name || recipe.authorName || 'Master Chef'}
            </span>
          </div>

          {formattedDate && (
            <span className="text-[11px] font-medium text-stone-300 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body with Fixed Balanced Grid Layout */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
        {/* Title with Balanced 2-Line Height */}
        <div className="min-h-[3.25rem] flex items-center">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 font-display leading-tight">
            {displayRecipe.title}
          </h3>
        </div>

        {/* Description with Uniform 2-Line Clamping */}
        <div className="min-h-[2.5rem] flex items-start">
          <p className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
            {displayRecipe.description || 'Delightful culinary masterclass crafted with hand-picked ingredients.'}
          </p>
        </div>

        {/* Ingredient Chips Preview Bar */}
        <div className="h-7 flex items-center gap-1.5 overflow-hidden">
          {displayRecipe.ingredients && displayRecipe.ingredients.slice(0, 3).map((ing, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-orange-50/80 dark:bg-zinc-800 border border-orange-200/60 dark:border-zinc-700 text-brand-900 dark:text-brand-400 text-[11px] font-bold truncate max-w-[110px]"
            >
              {ing}
            </span>
          ))}
          {displayRecipe.ingredients && displayRecipe.ingredients.length > 3 && (
            <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 text-[11px] font-bold shrink-0">
              +{displayRecipe.ingredients.length - 3}
            </span>
          )}
        </div>

        {/* Card Footer CTA - Perfectly Pinned to Bottom */}
        <div className="mt-auto pt-3.5 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>{t('viewMasterclass')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
          <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-zinc-800 group-hover:bg-brand-600 dark:group-hover:bg-brand-500 group-hover:text-white flex items-center justify-center text-stone-500 dark:text-zinc-400 transition-all duration-300 shadow-xs">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RecipeCardComponent);
