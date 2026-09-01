import React, { useState, useEffect } from 'react';
import { X, BookOpen, Layers, Clock, Eye, Loader2 } from 'lucide-react';
import { fetchUserRecipes } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';

export default function AdminUserRecipesModal({ user, onClose, onPreviewRecipe }) {
  const { lang, t } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserRecipes(user._id)
        .then((res) => {
          if (res?.data) setRecipes(res.data);
          else setRecipes([]);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 z-10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-500 dark:text-zinc-400 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 font-black text-lg flex items-center justify-center shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Chef {user.name}'s Dishes
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              {user.email} &bull; {recipes.length} {t('dishes')} published
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 dark:text-zinc-500 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500 mb-2" />
            <p className="text-xs font-bold">Loading dishes...</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-950/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-zinc-600" />
            <p className="text-xs font-bold">This chef hasn't published any recipes yet.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recipes.map((recipe) => {
              const trans = getTranslatedRecipe(recipe, lang);
              return (
                <div
                  key={recipe._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-850 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={recipe.imageUrl}
                      alt={trans.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {trans.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                        {recipe.ingredients?.length || 0} {t('ingredientsIndex')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      if (onPreviewRecipe) onPreviewRecipe(recipe);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-600 hover:text-zinc-950 dark:text-amber-400 text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

