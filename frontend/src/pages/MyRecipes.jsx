import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import EditRecipeModal from '../components/EditRecipeModal';
import { fetchMyRecipes, deleteRecipe } from '../services/api';
import { ChefHat, Plus, AlertCircle, RefreshCw, BookOpen, Layers, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MyRecipes({ onNavigateToAdd, showNotification }) {
  const { t } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  const loadMyRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMyRecipes();
      if (res && res.data) {
        setRecipes(res.data);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error('Error fetching my recipes:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load your recipes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyRecipes();
  }, []);

  const handleDeleteRecipe = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      if (showNotification) showNotification('Recipe deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      if (showNotification) showNotification('Failed to delete recipe', 'error');
    }
  };

  const handleRecipeUpdated = (updated) => {
    setRecipes((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    if (showNotification) showNotification('Recipe updated successfully!', 'success');
  };

  const totalIngredientsCount = recipes.reduce(
    (sum, r) => sum + (r.ingredients?.length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Chef Profile Header Banner */}
      <div className="bg-gradient-to-r from-orange-100/80 via-amber-50 to-stone-100 dark:from-zinc-900 dark:via-zinc-850 dark:to-zinc-900 rounded-3xl sm:rounded-[36px] p-6 sm:p-12 border border-orange-200/80 dark:border-zinc-800 mb-10 shadow-card dark:shadow-card-dark transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-200/60 dark:bg-brand-950/80 text-brand-900 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
                <ChefHat className="w-3.5 h-3.5" />
                <span>{t('myNotebookTitle')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight font-display">
                {t('myKitchen')}
              </h1>
              <p className="text-stone-600 dark:text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                {t('myNotebookSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadMyRecipes}
              title="Refresh recipes"
              className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-750 text-stone-700 dark:text-zinc-300 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onNavigateToAdd}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('publishNewRecipe')}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-orange-200/60 dark:border-zinc-800 flex flex-wrap gap-8 text-xs sm:text-sm font-bold text-stone-700 dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span><strong className="text-stone-900 dark:text-white text-base">{recipes.length}</strong> {t('dishesCount')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span><strong className="text-stone-900 dark:text-white text-base">{totalIngredientsCount}</strong> {t('ingredients')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Vyanjan Culinary Library</span>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 shadow-sm animate-pulse">
              <div className="aspect-4/3 bg-stone-200 dark:bg-zinc-800" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-stone-200 dark:bg-zinc-800 rounded-md w-3/4" />
                <div className="h-3.5 bg-stone-200 dark:bg-zinc-800 rounded-md w-full" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-lg w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="max-w-lg mx-auto text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-red-200 dark:border-red-900/60 shadow-card">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">Failed to load recipes</h3>
          <p className="text-stone-500 dark:text-zinc-400 text-xs mt-1">{error}</p>
          <button
            onClick={loadMyRecipes}
            className="mt-5 px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recipes.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl sm:rounded-[36px] border border-stone-200 dark:border-zinc-800 shadow-card max-w-xl mx-auto px-6">
          <div className="w-18 h-18 mx-auto rounded-3xl bg-orange-100 dark:bg-zinc-800 text-brand-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-inner">
            <ChefHat className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-black text-stone-900 dark:text-white font-display">{t('noMyRecipesYet')}</h3>
          <p className="text-stone-500 dark:text-zinc-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            {t('startSharingFirst')}
          </p>
          <button
            onClick={onNavigateToAdd}
            className="mt-8 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-brand-500/25 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('publishNewRecipe')}</span>
          </button>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onSelect={(r) => setSelectedRecipe(r)}
              onDelete={handleDeleteRecipe}
              onEdit={(r) => setEditingRecipe(r)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onUpdated={handleRecipeUpdated}
        />
      )}
    </div>
  );
}
