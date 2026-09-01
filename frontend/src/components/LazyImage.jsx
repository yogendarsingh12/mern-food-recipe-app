import React, { useState } from 'react';

/**
 * Production Progressive Lazy Image Component
 * Renders an animated blur skeleton while loading and handles broken image URLs gracefully
 */
export default function LazyImage({ src, alt, className = '', fallbackSrc, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const defaultFallback = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80';
  const effectiveSrc = hasError ? (fallbackSrc || defaultFallback) : src;

  return (
    <div className="relative w-full h-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
      {/* Shimmer Placeholder while image is loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-stone-200 dark:bg-zinc-800 animate-pulse" />
      )}

      <img
        src={effectiveSrc}
        alt={alt || 'Recipe Cover'}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`${className} ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } transition-all duration-500 ease-out`}
        {...props}
      />
    </div>
  );
}

