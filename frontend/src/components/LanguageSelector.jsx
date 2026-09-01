import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, Search, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ className = '' }) {
  const { lang, setLanguage, currentLanguageObj, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language / भाषा चुनें"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-2xl bg-stone-100 dark:bg-zinc-800/90 hover:bg-stone-200 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 border border-stone-200/80 dark:border-zinc-700/80 text-xs font-bold transition-all shadow-xs"
      >
        <span className="text-base leading-none">{currentLanguageObj.flag}</span>
        <span className="hidden sm:inline font-mono">{currentLanguageObj.code.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-zinc-800 z-50 overflow-hidden flex flex-col animate-fadeIn">
          {/* Header with Search */}
          <div className="p-3 border-b border-stone-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400 dark:text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language / भाषा खोजें..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            </div>
          </div>

          {/* Language List */}
          <div className="overflow-y-auto p-1.5 max-h-64 divide-y divide-stone-100 dark:divide-zinc-800/40">
            {filteredLanguages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-amber-400 font-bold'
                      : 'text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.flag}</span>
                    <div className="text-left">
                      <span className="text-xs font-bold block leading-tight">{item.nativeName}</span>
                      <span className="text-[10px] text-stone-400 dark:text-zinc-500 font-normal">
                        {item.name} ({item.code.toUpperCase()})
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600 dark:text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

