import React, { useState, useEffect, useMemo, useCallback } from 'react';
import HeroSection from '../components/HeroSection';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import EditRecipeModal from '../components/EditRecipeModal';
import { fetchRecipes, deleteRecipe } from '../services/api';
import { ChefHat, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';

export default function Home({ onNavigateToAdd, showNotification, currentUser }) {
  const { t } = useLanguage();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Performance: Debounce search input by 250ms to prevent expensive re-filtering per keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Load recipes from backend API
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchRecipes();
      if (res && res.data) {
        setRecipes(res.data);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Delete recipe handler
  const handleDeleteRecipe = useCallback(async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
      if (showNotification) {
        showNotification('Recipe deleted successfully', 'success');
      }
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      const msg = err.response?.data?.message || 'Failed to delete recipe.';
      if (showNotification) {
        showNotification(msg, 'error');
      }
    }
  }, [showNotification]);

  // Recipe updated handler
  const handleRecipeUpdated = useCallback((updated) => {
    setRecipes((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    if (showNotification) {
      showNotification('Recipe updated successfully!', 'success');
    }
  }, [showNotification]);

  // Filtered recipes memoized against debouncedSearchQuery and selectedCategory
  const filteredRecipes = useMemo(() => {
    const query = debouncedSearchQuery.toLowerCase().trim();

    return recipes.filter((recipe) => {
      const titleMatch = recipe.title?.toLowerCase().includes(query);
      const descMatch = recipe.description?.toLowerCase().includes(query);
      const ingMatch = recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(query)
      );
      const matchesSearch = query ? (titleMatch || descMatch || ingMatch) : true;

      if (selectedCategory === 'All') return matchesSearch;

      const categoryKeywords = selectedCategory.toLowerCase().split(' ');
      const matchesCategory = categoryKeywords.some(
        (kw) =>
          recipe.title?.toLowerCase().includes(kw) ||
          recipe.description?.toLowerCase().includes(kw) ||
          recipe.ingredients?.some((ing) => ing.toLowerCase().includes(kw))
      );

      return matchesSearch && matchesCategory;
    });
  }, [recipes, debouncedSearchQuery, selectedCategory]);

  return (
    <div className="min-h-screen">
      {/* Hero with Search and Filters */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalRecipes={recipes.length}
      />

      {/* Main Recipe Feed Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Section Title & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight flex items-center gap-2 font-display">
              <span>{t('showingRecipes')}</span>
              <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-800 dark:text-brand-300">
                {filteredRecipes.length}
              </span>
            </h2>
            <p className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5">
              {debouncedSearchQuery ? `Showing results for "${debouncedSearchQuery}"` : t('tagline')}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={loadRecipes}
              title="Refresh feed"
              className="p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-600 dark:text-zinc-400 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onNavigateToAdd}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/20 hover:shadow-brand-600/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('shareRecipe')}</span>
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col h-full"
              >
                <div className="h-56 bg-stone-200 dark:bg-zinc-800 w-full" />
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-5 bg-stone-200 dark:bg-zinc-800 rounded-md w-3/4" />
                    <div className="h-3.5 bg-stone-200 dark:bg-zinc-800 rounded-md w-full" />
                    <div className="h-3.5 bg-stone-200 dark:bg-zinc-800 rounded-md w-2/3" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-lg w-16" />
                    <div className="h-6 bg-stone-200 dark:bg-zinc-800 rounded-lg w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-lg mx-auto text-center py-16 px-4 bg-white dark:bg-zinc-900 rounded-3xl border border-red-200 dark:border-red-800/60 shadow-card">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-white">Could not load recipes</h3>
            <p className="text-stone-600 dark:text-zinc-400 text-sm mt-2 max-w-sm mx-auto">{error}</p>
            <button
              onClick={loadRecipes}
              className="mt-6 px-6 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:bg-stone-800 transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200/80 dark:border-zinc-800 shadow-card max-w-2xl mx-auto px-6">
            <div className="w-16 h-16 sm:w-18 sm:h-18 mx-auto rounded-3xl bg-orange-50 dark:bg-zinc-800 text-brand-600 dark:text-amber-400 flex items-center justify-center mb-5 shadow-inner">
              <ChefHat className="w-8 h-8 sm:w-9 sm:h-9" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white font-display">
              {debouncedSearchQuery ? t('noRecipesFound') : t('noMyRecipesYet')}
            </h3>
            <p className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              {debouncedSearchQuery
                ? t('tryAdjustingSearch')
                : t('startSharingFirst')}
            </p>
            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
              {debouncedSearchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 font-semibold text-stone-700 dark:text-zinc-300 text-xs sm:text-sm hover:bg-stone-50 dark:hover:bg-zinc-800"
                >
                  {t('clearFilters')}
                </button>
              )}
              <button
                onClick={onNavigateToAdd}
                className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-600/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('shareRecipe')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Recipe Responsive Grid (Uniform Heights & Memoized) */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                currentUser={currentUser}
                onSelect={(rec) => setSelectedRecipe(rec)}
                onDelete={handleDeleteRecipe}
                onEdit={(rec) => setEditingRecipe(rec)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
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
