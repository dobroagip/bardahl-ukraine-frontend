
import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '', containerClassName = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (placeholderRef.current) {
            observer.unobserve(placeholderRef.current);
          }
        }
      },
      {
        rootMargin: '200px', // Load before it enters the viewport
        threshold: 0.01,
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={placeholderRef} 
      className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}
    >
      {/* Shimmer Placeholder - only visible while not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 animate-shimmer bg-zinc-900" />
      )}
      
      {/* Image - only rendered when near viewport */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`
            ${className} 
            transition-all duration-700 ease-out
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        />
      )}
    </div>
  );
};

export default LazyImage;
