import React, { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import { CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// Production Code-Splitting: Lazy load major view chunks
const Home = lazy(() => import('./pages/Home'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));

export default function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'my-recipes' | 'add'
  const [toast, setToast] = useState(null);

  // Trigger toast alert
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Called when a new recipe is uploaded
  const handleRecipeCreated = (newRecipe) => {
    showToast(`🎉 "${newRecipe.title}" published to Vyanjan feed!`, 'success');
    setActiveTab('my-recipes');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#09090b] text-stone-900 dark:text-zinc-100 selection:bg-brand-500 selection:text-white transition-colors duration-300">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
            <div
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-semibold transition-all ${
                toast.type === 'error'
                  ? 'bg-red-900/90 text-white border-red-700'
                  : 'bg-stone-900/95 dark:bg-zinc-800 text-white border-stone-700 dark:border-zinc-700'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Main Navbar with Theme Toggle & Multi-Language */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content Area with Suspense and Error Boundary */}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            {/* Tab 1: Home Feed */}
            {activeTab === 'home' && (
              <Home
                onNavigateToAdd={() => setActiveTab('add')}
                showNotification={showToast}
              />
            )}

            {/* Tab 2: My Kitchen / All Recipes */}
            {activeTab === 'my-recipes' && (
              <MyRecipes
                onNavigateToAdd={() => setActiveTab('add')}
                showNotification={showToast}
              />
            )}

            {/* Tab 3: Add Recipe */}
            {activeTab === 'add' && (
              <AddRecipe
                onRecipeCreated={handleRecipeCreated}
                onCancel={() => setActiveTab('home')}
              />
            )}
          </Suspense>
        </main>

        {/* Clean Foodie Footer */}
        <footer className="mt-auto border-t border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 dark:text-white tracking-tight text-lg">Vyanjan</span>
              <span className="text-stone-300 dark:text-zinc-700">&bull;</span>
              <span className="text-xs text-stone-500 dark:text-zinc-400">Artisanal Food & Recipe Community</span>
            </div>

            <p className="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for food lovers everywhere.
            </p>

            <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-zinc-500 font-medium">
              <span>&copy; {new Date().getFullYear()} Vyanjan</span>
              <span>&bull;</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
