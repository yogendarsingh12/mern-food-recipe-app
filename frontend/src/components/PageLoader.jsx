import React from 'react';
import { ChefHat } from 'lucide-react';

/**
 * Branded Suspense fallback spinner for lazy-loaded route chunks
 */
export default function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse */}
        <div className="absolute w-20 h-20 rounded-full bg-brand-500/20 dark:bg-brand-500/10 animate-ping" />
        
        {/* Icon Circle */}
        <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/25 animate-bounce-slow">
          <ChefHat className="w-8 h-8" />
        </div>
      </div>
      
      <p className="mt-5 text-sm font-bold text-stone-700 dark:text-zinc-300 font-display tracking-wide animate-pulse">
        Prepping Masterclass Kitchen...
      </p>
    </div>
  );
}

