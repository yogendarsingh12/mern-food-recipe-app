import React, { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import { Heart } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

// Lazy load public Home feed
const Home = lazy(() => import('./pages/Home'));

export default function App() {
  const { t } = useLanguage();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#09090b] text-stone-900 dark:text-zinc-100 selection:bg-orange-500 selection:text-zinc-950 transition-colors duration-300">
        {/* Public Discovery Navbar */}
        <Navbar />

        {/* Main Public Recipe Discovery Feed */}
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        </main>

        {/* Clean Foodie Footer */}
        <footer className="mt-auto border-t border-stone-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-stone-900 dark:text-white tracking-tight text-lg">Vyanjan</span>
              <span className="text-stone-300 dark:text-zinc-700">&bull;</span>
              <span className="text-xs text-stone-500 dark:text-zinc-400">Artisanal Food & Masterclass Recipes</span>
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
