import React, { useState, useRef } from 'react';
import { X, Plus, UploadCloud, Loader2, AlertCircle, ChefHat } from 'lucide-react';
import { updateRecipe } from '../services/api';

export default function EditRecipeModal({ recipe, onClose, onUpdated }) {
  const [title, setTitle] = useState(recipe.title || '');
  const [description, setDescription] = useState(recipe.description || '');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [instructions, setInstructions] = useState(recipe.instructions || '');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(recipe.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!recipe) return null;

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    if (trimmed.includes(',')) {
      const splitItems = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
      setIngredients((prev) => [...prev, ...splitItems]);
    } else {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setIngredientInput('');
  };

  const handleRemoveIngredient = (idxToRemove) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 5MB limit.');
      return;
    }
    setErrorMsg('');
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Recipe title is required.');
      return;
    }

    if (ingredients.length === 0 && !ingredientInput.trim()) {
      setErrorMsg('At least one ingredient is required.');
      return;
    }

    if (!instructions.trim()) {
      setErrorMsg('Cooking instructions are required.');
      return;
    }

    let finalIngredients = [...ingredients];
    if (ingredientInput.trim()) {
      const leftovers = ingredientInput.split(',').map((s) => s.trim()).filter(Boolean);
      finalIngredients = [...finalIngredients, ...leftovers];
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('ingredients', JSON.stringify(finalIngredients));
      formData.append('instructions', instructions.trim());
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await updateRecipe(recipe._id, formData);
      onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error('Update recipe error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 dark:bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 z-10 my-8 max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-zinc-800 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white font-display">Edit Recipe</h2>
              <p className="text-xs text-stone-500 dark:text-zinc-400">Update recipe details and ingredients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-zinc-800 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-5 space-y-5 flex-1 pr-1">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              Recipe Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              Description <span className="text-stone-400 dark:text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm text-stone-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              Cover Image <span className="text-stone-400 dark:text-zinc-500 font-normal">(Leave unchanged or upload new)</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-2xl object-cover border border-stone-200 dark:border-zinc-700"
                />
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-300 transition-colors"
              >
                {imageFile ? 'Change Selected Photo' : 'Upload New Photo'}
              </button>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              Ingredients <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2.5">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                placeholder="Type ingredient and press Enter"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs text-stone-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-stone-50 dark:bg-zinc-950 rounded-xl border border-stone-200 dark:border-zinc-800 max-h-36 overflow-y-auto">
              {ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-medium shadow-2xs"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 mb-1.5">
              Cooking Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-xs leading-relaxed text-stone-900 dark:text-white"
              required
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
