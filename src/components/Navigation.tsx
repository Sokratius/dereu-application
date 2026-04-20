import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, Bell, Plus, LifeBuoy } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export const Navigation: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB] pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-[430px] mx-auto grid grid-cols-5 items-end h-[76px] sm:h-20 px-2.5 sm:px-3">
        <NavItem to="/" icon={<Home size={22} strokeWidth={2.2} />} label="Басты" />
        <NavItem to="/notifications" icon={<Bell size={22} strokeWidth={2.2} />} label="Хабарламалар" />

        <div className="flex flex-col items-center justify-end pb-1">
          <NavLink
            to="/report"
            className={({ isActive }) =>
              cn(
                "w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] -translate-y-3 sm:-translate-y-4 flex items-center justify-center shadow-2xl transition-all active:scale-95",
                isActive 
                  ? "bg-[#DC2626] text-white shadow-red-200 rotate-45" 
                  : "bg-[#1E3A8A] text-white shadow-blue-200"
              )
            }
          >
            <Plus size={28} strokeWidth={3} className={cn("transition-transform sm:w-8 sm:h-8")} />
          </NavLink>
          <span className="text-[9px] sm:text-[10px] font-black text-[#1E3A8A] uppercase -mt-1.5 sm:-mt-2 tracking-widest">Дереу</span>
        </div>

        <NavItem to="/map" icon={<MapIcon size={22} strokeWidth={2.2} />} label="Карта" />
        <NavItem to={user?.role === 'admin' ? "/admin" : "/profile"} icon={<LifeBuoy size={22} strokeWidth={2.2} />} label={user?.role === 'admin' ? "Әкімші" : "Профиль"} />
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center space-y-0.5 sm:space-y-1 transition-all duration-200",
          isActive ? "text-[#1E3A8A]" : "text-slate-400 hover:text-slate-600"
        )
      }
    >
      {icon}
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tight">{label}</span>
    </NavLink>
  );
};
