import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminPageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 animate-fadeIn text-zinc-300">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-18 h-18 rounded-full bg-brand-500/20 animate-ping" />
        <div className="relative w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-amber-400 flex items-center justify-center shadow-xl">
          <ShieldCheck className="w-7 h-7" />
        </div>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-zinc-500 animate-pulse">
        Loading Admin Studio...
      </p>
    </div>
  );
}

