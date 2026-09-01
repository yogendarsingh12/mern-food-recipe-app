import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Sparkles,
  Lock,
  LogIn
} from 'lucide-react';
import { createRecipe } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function AddRecipe({ user, onOpenAuth, onRecipeCreated, onCancel }) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fadeIn">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 sm:p-12 border border-stone-200 dark:border-zinc-800 shadow-xl">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight font-display">
            {t('chefSignInRequired')}
          </h2>
          <p className="text-stone-600 dark:text-zinc-400 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            {t('signInToAccessKitchen')}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-stone-300 dark:border-zinc-700 font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 text-xs transition-colors"
            >
              {t('explore')}
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('signIn')} / {t('createAccount')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;

    if (trimmed.includes(',')) {
      const splitItems = trimmed.split(',').map((item) => item.trim()).filter(Boolean);
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
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image exceeds 5MB limit. Please choose a smaller photo.');
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a recipe title.');
      return;
    }

    if (ingredients.length === 0 && !ingredientInput.trim()) {
      setErrorMsg('Please add at least one ingredient.');
      return;
    }

    if (!instructions.trim()) {
      setErrorMsg('Please write cooking instructions.');
      return;
    }

    if (!imageFile) {
      setErrorMsg('Please upload a recipe cover photo.');
      return;
    }

    let finalIngredients = [...ingredients];
    if (ingredientInput.trim()) {
      const leftover = ingredientInput.split(',').map((s) => s.trim()).filter(Boolean);
      finalIngredients = [...finalIngredients, ...leftover];
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('ingredients', JSON.stringify(finalIngredients));
      formData.append('instructions', instructions.trim());
      formData.append('image', imageFile);

      const response = await createRecipe(formData);

      setSuccessMsg('🎉 Recipe published successfully to Vyanjan!');
      
      setTimeout(() => {
        if (onRecipeCreated) {
          onRecipeCreated(response.data);
        }
      }, 1200);

    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create recipe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white text-xs font-bold mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('explore')}</span>
          </button>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight font-display flex items-center gap-3">
            {t('publishNewRecipe')}
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
          </h1>
          <p className="mt-1.5 text-stone-600 dark:text-zinc-400 text-xs sm:text-sm">
            Posting as <strong className="text-stone-900 dark:text-white">Chef {user.name}</strong> &bull; Share your culinary creation with food lovers.
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 flex items-start gap-3 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs sm:text-sm font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl sm:rounded-[32px] p-6 sm:p-12 border border-stone-200 dark:border-zinc-800 shadow-card dark:shadow-card-dark space-y-8 transition-colors">
        {/* Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 mb-2">
            {t('recipeTitle')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Creamy Tuscan Garlic Chicken"
            maxLength={120}
            className="w-full px-5 py-3.5 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 text-sm sm:text-base font-medium transition-all"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 mb-2">
            {t('shortDescription')} <span className="text-stone-400 dark:text-zinc-500 font-normal normal-case">(Optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief overview or flavor profile of this delicious dish..."
            rows={3}
            maxLength={500}
            className="w-full px-5 py-3.5 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Cover Photo Upload */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 mb-2">
            {t('coverPhoto')} <span className="text-red-500">*</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
          />

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 dark:border-zinc-700 hover:border-brand-500 dark:hover:border-brand-400 hover:bg-orange-50/30 dark:hover:bg-zinc-800/40 rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-3xl bg-orange-100 dark:bg-zinc-800 group-hover:scale-110 text-brand-600 dark:text-amber-400 flex items-center justify-center mb-4 transition-all duration-300 shadow-sm">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-stone-800 dark:text-zinc-200">
                {t('dropPhotoHere')}
              </p>
              <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1 font-medium">
                {t('supportsFormats')}
              </p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-zinc-800 bg-stone-100 dark:bg-zinc-800 max-h-80 shadow-md">
              <img
                src={imagePreview}
                alt="Upload Preview"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-white dark:bg-zinc-900 text-stone-900 dark:text-white font-bold rounded-xl text-xs shadow-lg hover:bg-stone-100 transition-all"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs shadow-lg hover:bg-red-700 transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ingredients Builder */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 mb-2">
            {t('ingredients')} <span className="text-red-500">*</span>
          </label>
          
          <div className="flex gap-2">
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
              placeholder={t('typeIngredientPlaceholder')}
              className="flex-1 px-5 py-3.5 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 text-sm font-medium transition-all"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-6 py-3.5 rounded-2xl bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addBtn')}</span>
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 p-4 bg-stone-50 dark:bg-zinc-950 rounded-2xl border border-stone-200 dark:border-zinc-800">
              {ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-bold shadow-xs"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="w-4 h-4 rounded-full text-stone-400 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cooking Instructions */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-stone-800 dark:text-zinc-200 mb-2">
            {t('cookingInstructions')} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={t('instructionsPlaceholder')}
            rows={7}
            className="w-full px-5 py-4 rounded-2xl border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 text-sm leading-relaxed font-medium transition-all"
            required
          />
        </div>

        {/* Form Actions */}
        <div className="pt-6 border-t border-stone-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-stone-300 dark:border-zinc-700 font-bold text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors text-xs"
          >
            {t('cancelBtn')}
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-orange-500 hover:from-brand-500 hover:to-orange-400 text-white font-black text-xs sm:text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('publishing')}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>{t('publishBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
