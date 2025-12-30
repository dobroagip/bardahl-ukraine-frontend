import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-6 animate-in fade-in slide-in-from-left-2 ${className}`}>
      <button 
        onClick={items[0]?.onClick} 
        className="hover:text-yellow-500 transition-colors flex items-center gap-1"
      >
        <Home size={12} />
      </button>
      
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={10} className="text-zinc-600" />
          {item.isActive ? (
            <span className="text-white font-bold truncate max-w-[200px] md:max-w-md">
              {item.label}
            </span>
          ) : (
            <button 
              onClick={item.onClick}
              disabled={!item.onClick}
              className={`transition-colors ${item.onClick ? 'hover:text-yellow-500 cursor-pointer' : 'cursor-default'}`}
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;