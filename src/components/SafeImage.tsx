import { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackEmoji?: string;
  priority?: boolean;
  onLoad?: () => void;
}

export default function SafeImage({ 
  src, 
  alt, 
  className = 'w-full h-full object-cover', 
  fallbackEmoji = '🍽️', 
  priority = false,
  onLoad 
}: SafeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Reset states if src changes
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div 
        role="img"
        aria-label={alt}
        className={`w-full h-full bg-gradient-to-br from-amber-400/90 via-orange-500/90 to-amber-600/90 flex flex-col items-center justify-center text-white shadow-inner select-none p-2 relative overflow-hidden group ${className}`}
      >
        <span className="text-3xl drop-shadow-md transform transition-transform duration-300 group-hover:scale-125">
          {fallbackEmoji}
        </span>
        <span className="text-[10px] font-bold text-white/80 line-clamp-1 mt-1 text-center px-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton Shimmer while loading */}
      {!loaded && (
        <div 
          aria-hidden="true"
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center z-0"
        >
          <span className="text-xl opacity-30 select-none">{fallbackEmoji}</span>
        </div>
      )}

      <img 
        src={src} 
        alt={alt} 
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`} 
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => setFailed(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
}
