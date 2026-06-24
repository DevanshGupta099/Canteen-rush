import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className: string;
  fallbackEmoji: string;
  priority?: boolean;
}

export default function SafeImage({ src, alt, className, fallbackEmoji, priority = false }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div 
        role="img"
        aria-label={alt}
        className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl shadow-inner select-none animate-fade-in"
      >
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setFailed(true)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
