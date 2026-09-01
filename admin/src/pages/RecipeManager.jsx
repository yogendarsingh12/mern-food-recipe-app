import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit3, Trash2, Layers, RefreshCw, X, Plus, Download, Filter } from 'lucide-react';
import { deleteAdminRecipe } from '../services/api';
import AdminAddRecipeModal from '../components/AdminAddRecipeModal';
import { useDebounce } from '../hooks/useDebounce';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedRecipe } from '../utils/recipeTranslator';

export default function RecipeManager({ recipes, setRecipes, onEditRecipe, onPreviewRecipe, onRefresh, showNotification }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce search query to optimize table filtering performance
  const debouncedSearch = useDebounce(search, 200);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Admin Action: ${t('deleteConfirm') || 'Are you sure you want to permanently delete'} "${title}"?`)) {
      try {
        await deleteAdminRecipe(id);
        setRecipes((prev) => prev.filter((r) => r._id !== id));
        if (showNotification) showNotification(`Deleted recipe "${title}"`, 'success');
      } catch (err) {
        console.error('Delete error:', err);
        if (showNotification) showNotification('Failed to delete recipe', 'error');
      }
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recipes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vyanjan_recipes_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return recipes;

    return recipes.filter(
      (r) =>
        r.title?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.authorName?.toLowerCase().includes(query) ||
        r.ingredients?.some((i) => i.toLowerCase().includes(query))
    );
  }, [recipes, debouncedSearch]);

  return (
    <div className="bg-white dark:bg-zinc-900/90 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs dark:shadow-panel overflow-hidden animate-fadeIn transition-colors">
      {/* Table Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium hidden md:inline">
            <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of {recipes.length} {t('recipes')}
          </span>

          <button
            onClick={handleExportJSON}
            title="Export recipes data as JSON"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 border border-slate-200 dark:border-zinc-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('export')}</span>
          </button>

          <button
            onClick={onRefresh}
            title="Refresh list"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('createRecipe')}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 dark:text-zinc-400">
          <thead className="bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 font-bold border-b border-slate-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-6">{t('recipe')}</th>
              <th className="py-3.5 px-6">{t('author')}</th>
              <th className="py-3.5 px-6">{t('ingredientsIndex')}</th>
              <th className="py-3.5 px-6">{t('date')}</th>
              <th className="py-3.5 px-6 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-zinc-500">
                  {t('noRecipesFound')} "{debouncedSearch}"
                </td>
              </tr>
            ) : (
              filtered.map((recipe) => {
                const trans = getTranslatedRecipe(recipe, lang);

                return (
                  <tr
                    key={recipe._id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Recipe Image & Title */}
                    <td className="py-4 px-6 flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-700">
                        <img
                          src={recipe.imageUrl}
                          alt={trans.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                          {trans.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500 line-clamp-1 max-w-xs">
                          {trans.description || 'No description provided'}
                        </p>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                          {(recipe.user?.name || recipe.authorName || 'C').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[130px]">
                          {recipe.user?.name || recipe.authorName || 'Community Chef'}
                        </span>
                      </div>
                    </td>

                    {/* Ingredients Count */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[11px]">
                        <Layers className="w-3 h-3 text-amber-500" />
                        <span>{recipe.ingredients?.length || 0} items</span>
                      </span>
                    </td>

                    {/* Created At */}
                    <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 text-[11px]">
                      {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewRecipe(recipe)}
                          title="Preview Recipe Theater Mode"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-slate-600 dark:text-zinc-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditRecipe(recipe)}
                          title="Edit Recipe"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-zinc-300 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe._id, recipe.title)}
                          title="Delete Recipe"
                          className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-red-600 hover:text-white text-slate-600 dark:text-zinc-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Add Recipe Modal */}
      {showAddModal && (
        <AdminAddRecipeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onCreated={(newRecipe) => {
            setRecipes((prev) => [newRecipe, ...prev]);
            setShowAddModal(false);
            if (showNotification) showNotification(`🎉 Published "${newRecipe.title}" via Admin Studio!`, 'success');
          }}
        />
      )}
    </div>
  );
}
