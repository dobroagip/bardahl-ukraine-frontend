
import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  isPending: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isPending }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isPending) {
      setIsVisible(true);
      setProgress(0);
      
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 30) return prev + 5;
          if (prev < 70) return prev + 2;
          if (prev < 90) return prev + 0.5;
          return prev;
        });
      }, 100);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 400);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => clearInterval(interval);
  }, [isPending]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isPending ? 1 : 0 }}
    >
      <div 
        className="h-full bg-yellow-500 shadow-[0_0_15px_#FFD700,0_0_5px_#FFD700] transition-all duration-300 ease-out relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-20 animate-pulse" style={{ left: 'auto', right: 0 }} />
      </div>
    </div>
  );
};

export default ProgressBar;
