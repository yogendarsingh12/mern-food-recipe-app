import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import { CheckCircle2, AlertCircle, Heart, ChefHat, LogIn } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// Production Code-Splitting: Lazy load major view chunks
const Home = lazy(() => import('./pages/Home'));
const AddRecipe = lazy(() => import('./pages/AddRecipe'));
const MyRecipes = lazy(() => import('./pages/MyRecipes'));
const AuthModal = lazy(() => import('./components/AuthModal'));

export default function App() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'my-recipes' | 'add'
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Initialize user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('recipe_user');
      const storedToken = localStorage.getItem('recipe_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to load user from localStorage:', err);
    }
  }, []);

  // Trigger toast alert
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth Success Handler
  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    showToast(`Welcome to Vyanjan, Chef ${userData.name}!`, 'success');
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('recipe_token');
    localStorage.removeItem('recipe_user');
    setUser(null);
    setActiveTab('home');
    showToast('Logged out successfully.', 'success');
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

        {/* Main Navbar with Theme Toggle */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Auth Modal (Lazy-Loaded) */}
        <Suspense fallback={null}>
          {authModalOpen && (
            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
        </Suspense>

        {/* Main Content Area with Suspense and Error Boundary */}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            {/* Tab 1: Home Feed */}
            {activeTab === 'home' && (
              <Home
                onNavigateToAdd={() => setActiveTab('add')}
                showNotification={showToast}
                currentUser={user}
              />
            )}

            {/* Tab 2: My Recipes (Protected) */}
            {activeTab === 'my-recipes' && (
              user ? (
                <MyRecipes
                  user={user}
                  onNavigateToAdd={() => setActiveTab('add')}
                  showNotification={showToast}
                />
              ) : (
                <div className="max-w-md mx-auto px-4 py-24 text-center">
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-stone-200 dark:border-zinc-800 shadow-card">
                    <ChefHat className="w-12 h-12 text-brand-600 dark:text-brand-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Sign in to View Your Kitchen</h2>
                    <p className="text-stone-500 dark:text-zinc-400 text-xs mt-2">
                      Access your personal culinary notebook, edit your dishes, and manage your published recipes on Vyanjan.
                    </p>
                    <button
                      onClick={() => setAuthModalOpen(true)}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 inline-flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Tab 3: Add Recipe */}
            {activeTab === 'add' && (
              <AddRecipe
                user={user}
                onOpenAuth={() => setAuthModalOpen(true)}
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
