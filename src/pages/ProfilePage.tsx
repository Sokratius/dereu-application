import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Info, ExternalLink, Settings, History, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProfilePage: React.FC = () => {
  const { user, logout, setRole } = useAuth();

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      {/* Header Bar */}
      <header className="bg-[#1E3A8A] px-6 py-4 flex justify-between items-center z-50 shadow-md">
        <h1 className="text-sm font-black text-white uppercase tracking-widest">Профиль</h1>
        <button onClick={logout} className="text-white opacity-80 hover:opacity-100 transition-all">
          <LogOut size={20} />
        </button>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="ios-card p-6 flex flex-col items-center text-center bg-white">
          <div className="w-24 h-24 bg-[#F3F4F6] rounded-[28px] flex items-center justify-center mb-4 relative shadow-inner">
            <User size={40} className="text-[#1E3A8A]" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#2563EB] rounded-full border-4 border-white flex items-center justify-center shadow-lg">
              <ShieldCheck size={16} className="text-white" />
            </div>
          </div>
          <h2 className="text-xl font-black text-[#111827] uppercase tracking-tighter">
            {user?.role === 'admin' ? 'Жүйе әкімшісі' : 'Пайдаланушы'}
          </h2>
          <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mt-1 opacity-80">
            ЖСН: {user?.iin}
          </p>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          <div>
            <SectionHeader title="Баптаулар" />
            <div className="ios-card overflow-hidden bg-white">
              <MenuButton icon={<Settings size={18} className="text-[#1E3A8A]" />} label="Құрылғы параметрлері" />
              <MenuDivider />
              <MenuButton icon={<History size={18} className="text-[#1E3A8A]" />} label="Хабарламалар тарихы" />
            </div>
          </div>

          <div>
            <SectionHeader title="Рөлді таңдау (Сынақ)" />
            <div className="ios-card p-2 flex gap-2 bg-white">
              <RoleButton 
                active={user?.role === 'user'} 
                onClick={() => setRole('user')} 
                label="Пайдаланушы" 
              />
              <RoleButton 
                active={user?.role === 'admin'} 
                onClick={() => setRole('admin')} 
                label="Әкімші" 
              />
            </div>
          </div>

          <div>
            <SectionHeader title="Ақпарат" />
            <div className="ios-card overflow-hidden bg-white">
              <MenuButton icon={<Info size={18} className="text-[#1E3A8A]" />} label="DEREU ережелері" />
              <MenuDivider />
              <MenuButton icon={<ExternalLink size={18} className="text-[#1E3A8A]" />} label="Қауіпсіздік стандарттары" />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 pb-12 text-center">
          <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-40 leading-relaxed">
            DEREU ҚАУІПСІЗДІК ЖҮЙЕСІ v4.2.0<br/>
            ҚОРҒАЛҒАН ШИФРЛАУ БЕЛСЕНДІ
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3 className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2 pl-2">{title}</h3>
);

const MenuDivider = () => <div className="ml-14 border-t border-[#F3F4F6]" />;

const MenuButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-[#F9FAFB] transition-all">
    <div className="flex items-center gap-4">
      <div className="shrink-0">{icon}</div>
      <span className="text-sm font-bold text-[#111827]">{label}</span>
    </div>
    <ChevronRight size={18} className="text-[#E5E7EB]" />
  </button>
);

const RoleButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm",
      active ? "bg-[#1E3A8A] text-white" : "bg-[#F3F4F6] text-[#6B7280]"
    )}
  >
    {label}
  </button>
);
