
import React, { useState } from 'react';
// Removed CATEGORIES import as it is not exported from constants and is unused here.
import { VISCOSITIES, ADDITIVE_FILTERS, OEM_APPROVALS } from '../constants';
import { Filter, ChevronDown, Check, ChevronRight, Grid, Fuel, DollarSign } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onCategorySelect: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, onFilterChange, onCategorySelect }) => {
  const { t, categories } = useLanguage();
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    price: true,
    viscosity: true,
    volume: true,
    approvals: true,
    purpose: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // --- HANDLERS ---
  const handleCategoryClick = (id: string) => {
    onCategorySelect(id);
    // Only scroll on large screens, on mobile the sidebar is a drawer
    if (window.innerWidth >= 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViscosityChange = (v: string) => {
    const newVisc = filters.viscosities.includes(v)
      ? filters.viscosities.filter(item => item !== v)
      : [...filters.viscosities, v];
    onFilterChange({ ...filters, viscosities: newVisc });
  };

  const handleApprovalChange = (v: string) => {
    const newAppr = filters.approvals.includes(v)
      ? filters.approvals.filter(item => item !== v)
      : [...filters.approvals, v];
    onFilterChange({ ...filters, approvals: newAppr });
  };

  const handleVolumeChange = (vol: string) => {
    const newVols = filters.volumes.includes(vol)
      ? filters.volumes.filter(item => item !== vol)
      : [...filters.volumes, vol];
    onFilterChange({ ...filters, volumes: newVols });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
    onFilterChange({
      ...filters,
      priceRange: { ...filters.priceRange, [type]: val }
    });
  };

  // --- DATA PREP ---
  const sidebarCategories = categories.filter(c => c.id !== 'all' && c.id !== 'catalog');
  const volumes = ['1L', '4L', '5L', '20L', '60L', '205L', '300ml', '400ml'];

  const sectionHeaderClass = "w-full flex items-center justify-between text-white font-black uppercase text-[10px] tracking-[0.2em] mb-4 group hover:text-yellow-500 transition-colors cursor-pointer py-2";
  const badgeClass = "bg-yellow-500 text-black w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ml-2";

  return (
    <div className="w-full space-y-6">
      
      {/* SECTION 1: CATALOG NAVIGATION */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-800/40 p-5 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-black text-white uppercase tracking-[0.15em] text-[10px] flex items-center gap-3">
                <Grid size={16} className="text-yellow-500" />
                {t('sidebar.catalog')}
            </h3>
        </div>
        <nav className="p-2">
            <ul className="space-y-1">
                <li>
                    <button 
                        onClick={() => handleCategoryClick('all')}
                        className={`w-full flex items-center justify-between p-4 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all group ${
                            filters.categories.length === 0 || filters.categories.includes('all')
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                        }`}
                    >
                        <span>{t('sidebar.all_products')}</span>
                        {(filters.categories.length === 0 || filters.categories.includes('all')) && <ChevronRight size={16} strokeWidth={3} />}
                    </button>
                </li>

                {sidebarCategories.map((cat) => {
                    const isActive = filters.categories.includes(cat.id);
                    return (
                        <li key={cat.id}>
                            <button
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-[1.2rem] text-xs font-black uppercase tracking-wider transition-all group border border-transparent ${
                                    isActive 
                                    ? 'bg-zinc-800 border-yellow-500/30 text-white' 
                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                <span>{cat.name}</span>
                                <ChevronRight 
                                    size={16} 
                                    strokeWidth={3}
                                    className={`transition-transform ${isActive ? 'text-yellow-500 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} 
                                />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
      </div>

      {/* SECTION 2: FILTERS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-800/40 p-5 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-black text-white uppercase tracking-[0.15em] text-[10px] flex items-center gap-3">
                <Filter size={16} className="text-yellow-500" />
                {t('sidebar.filters')}
            </h3>
        </div>

        <div className="divide-y divide-zinc-800/50">
            
            {/* PRICE */}
            <div className="p-6">
                <button onClick={() => toggleSection('price')} className={sectionHeaderClass}>
                    <span className="flex items-center gap-2"><DollarSign size={14} className="text-yellow-500" /> {t('sidebar.price')}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${openSections.price ? 'rotate-180' : ''}`} />
                </button>
                
                {openSections.price && (
                    <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[9px] font-black uppercase">{t('common.from')}</span>
                                <input 
                                    type="number" 
                                    value={filters.priceRange.min || ''}
                                    onChange={(e) => handlePriceChange(e, 'min')}
                                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-xs font-bold text-white focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[9px] font-black uppercase">{t('common.to')}</span>
                                <input 
                                    type="number" 
                                    value={filters.priceRange.max || ''}
                                    onChange={(e) => handlePriceChange(e, 'max')}
                                    className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-xs font-bold text-white focus:border-yellow-500 outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                            <div className="absolute inset-y-0 bg-yellow-500/50 left-[0%] right-[0%]" />
                        </div>
                    </div>
                )}
            </div>

            {/* PURPOSE */}
            <div className="p-6">
                <button onClick={() => toggleSection('purpose')} className={sectionHeaderClass}>
                    <span className="flex items-center gap-2"><Fuel size={14} className="text-yellow-500"/> {t('sidebar.purpose')} {filters.approvals.filter(a => ADDITIVE_FILTERS.includes(a)).length > 0 && <span className={badgeClass}>{filters.approvals.filter(a => ADDITIVE_FILTERS.includes(a)).length}</span>}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${openSections.purpose ? 'rotate-180' : ''}`} />
                </button>

                {openSections.purpose && (
                    <div className="space-y-1 animate-in fade-in max-h-60 overflow-y-auto custom-scrollbar pr-2 pt-1">
                        {ADDITIVE_FILTERS.map((app) => (
                            <label key={app} className="flex items-center justify-between cursor-pointer group hover:bg-zinc-800/50 p-2.5 rounded-xl transition-all -mx-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${filters.approvals.includes(app) ? 'bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-black border-zinc-700 group-hover:border-zinc-500'}`}>
                                        {filters.approvals.includes(app) && <Check size={12} className="text-black" strokeWidth={4} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={filters.approvals.includes(app)} onChange={() => handleApprovalChange(app)} />
                                    <span className={`text-xs font-bold ${filters.approvals.includes(app) ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {app}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* VISCOSITY */}
            <div className="p-6">
                <button onClick={() => toggleSection('viscosity')} className={sectionHeaderClass}>
                    <span className="flex items-center gap-2">Вязкость SAE {filters.viscosities.length > 0 && <span className={badgeClass}>{filters.viscosities.length}</span>}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${openSections.viscosity ? 'rotate-180' : ''}`} />
                </button>

                {openSections.viscosity && (
                    <div className="space-y-1 animate-in fade-in max-h-60 overflow-y-auto custom-scrollbar pr-2 pt-1">
                        {VISCOSITIES.map((visc) => (
                            <label key={visc} className="flex items-center justify-between cursor-pointer group hover:bg-zinc-800/50 p-2.5 rounded-xl transition-all -mx-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${filters.viscosities.includes(visc) ? 'bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-black border-zinc-700 group-hover:border-zinc-500'}`}>
                                        {filters.viscosities.includes(visc) && <Check size={12} className="text-black" strokeWidth={4} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={filters.viscosities.includes(visc)} onChange={() => handleViscosityChange(visc)} />
                                    <span className={`text-xs font-bold ${filters.viscosities.includes(visc) ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {visc.replace('SAE ', '')}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

             {/* OEM APPROVALS */}
             <div className="p-6">
                <button onClick={() => toggleSection('approvals')} className={sectionHeaderClass}>
                    <span className="flex items-center gap-2">Допуски OEM {filters.approvals.filter(a => OEM_APPROVALS.includes(a)).length > 0 && <span className={badgeClass}>{filters.approvals.filter(a => OEM_APPROVALS.includes(a)).length}</span>}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${openSections.approvals ? 'rotate-180' : ''}`} />
                </button>

                {openSections.approvals && (
                    <div className="space-y-1 animate-in fade-in max-h-60 overflow-y-auto custom-scrollbar pr-2 pt-1">
                        {OEM_APPROVALS.map((app) => (
                            <label key={app} className="flex items-center justify-between cursor-pointer group hover:bg-zinc-800/50 p-2.5 rounded-xl transition-all -mx-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${filters.approvals.includes(app) ? 'bg-yellow-500 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-black border-zinc-700 group-hover:border-zinc-500'}`}>
                                        {filters.approvals.includes(app) && <Check size={12} className="text-black" strokeWidth={4} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={filters.approvals.includes(app)} onChange={() => handleApprovalChange(app)} />
                                    <span className={`text-xs font-bold ${filters.approvals.includes(app) ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {app}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

             {/* VOLUME */}
             <div className="p-6">
                <button onClick={() => toggleSection('volume')} className={sectionHeaderClass}>
                    <span className="flex items-center gap-2">{t('sidebar.volume')} {filters.volumes.length > 0 && <span className={badgeClass}>{filters.volumes.length}</span>}</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${openSections.volume ? 'rotate-180' : ''}`} />
                </button>

                {openSections.volume && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in pt-1">
                        {volumes.map((vol) => {
                             const isSelected = filters.volumes.includes(vol);
                             return (
                                <button
                                    key={vol}
                                    onClick={() => handleVolumeChange(vol)}
                                    className={`text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-xl border-2 transition-all active:scale-95 ${
                                        isSelected 
                                        ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/10' 
                                        : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
                                    }`}
                                >
                                    {vol}
                                </button>
                             )
                        })}
                    </div>
                )}
            </div>

        </div>
      </div>

    </div>
  );
};

export default Sidebar;
