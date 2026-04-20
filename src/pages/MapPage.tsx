import React, { useState } from 'react';
import { MapComponent } from '../components/MapComponent';
import { useAlerts } from '../context/AlertContext';
import { Search, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export const MapPage: React.FC = () => {
  const { alerts } = useAlerts();
  const [filter, setFilter] = useState<'all' | 'missing_person' | 'suspect' | 'emergency'>('all');

  const filteredAlerts = filter === 'all' 
    ? alerts.filter(a => a.status === 'active')
    : alerts.filter(a => a.status === 'active' && a.type === filter);

  return (
    <div className="h-screen flex flex-col relative bg-[#F3F4F6]">
      {/* Map Header */}
      <div className="absolute top-6 left-4 right-4 z-[1000] space-y-3">
        <div className="ios-card bg-white/95 backdrop-blur-md p-1.5 flex items-center gap-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Аймақты іздеу..."
              className="w-full bg-transparent border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-[#111827] focus:ring-0 placeholder:text-[#6B7280] uppercase tracking-wide"
            />
          </div>
          <div className="h-8 w-[1px] bg-[#E5E7EB] mx-1"></div>
          <div className="flex items-center gap-2 px-3">
            <MapPin size={16} className="text-[#DC2626]" />
            <span className="text-[10px] font-black text-[#1E3A8A] uppercase">Алматы</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <CategoryPill active={filter === 'all'} onClick={() => setFilter('all')} label="Барлығы" />
          <CategoryPill active={filter === 'missing_person'} onClick={() => setFilter('missing_person')} label="Жоғалғандар" color="#2563EB" />
          <CategoryPill active={filter === 'suspect'} onClick={() => setFilter('suspect')} label="Күдіктілер" color="#F59E0B" />
          <CategoryPill active={filter === 'emergency'} onClick={() => setFilter('emergency')} label="Қауіпті аймақ" color="#DC2626" />
        </div>
      </div>

      <div className="flex-1">
        <MapComponent alerts={filteredAlerts} zoom={13} />
      </div>

      {/* Floating Info */}
      <div className="absolute top-36 left-4 z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm border border-[#E5E7EB] p-3 rounded-2xl shadow-lg max-w-[160px]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 bg-[#DC2626] rounded-full animate-pulse shadow-sm"></div>
            <span className="text-[9px] font-black text-[#DC2626] uppercase">Белсенді хабарлама</span>
          </div>
          <div className="text-[10px] font-bold text-[#111827] leading-tight">Қазіргі аймақта 2 белсенді оқиға тіркелген.</div>
        </div>
      </div>
    </div>
  );
};

const CategoryPill: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  label: string;
  color?: string;
}> = ({ active, onClick, label, color = "#1E3A8A" }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-md whitespace-nowrap border-2",
      active 
        ? "bg-white text-[#111827] ring-1 ring-black/5" 
        : "bg-white/80 backdrop-blur-md text-[#6B7280] border-transparent opacity-80"
    )}
    style={active ? { borderColor: color } : {}}
  >
    {active && <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>}
    {label}
  </button>
);
