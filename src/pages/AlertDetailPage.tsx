import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Phone, Send, Info, Shirt, ShieldCheck } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { formatDistanceToNow } from 'date-fns';
import { kk } from 'date-fns/locale';
import { getCrimePointLabel } from '../lib/crimePoints';

export const AlertDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alerts } = useAlerts();
  
  const alert = alerts.find(a => a.id === id);

  if (!alert) {
    return (
      <div className="p-8 text-center mt-20 bg-white min-h-screen">
        <h2 className="text-xl font-black text-[#111827]">Деректер табылмады</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-[#2563EB] font-bold uppercase text-xs">Басты бетке қайту</button>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen pb-32">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 border-b border-[#E5E7EB]">
        <button onClick={() => navigate(-1)} className="text-[#1E3A8A]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div>
          <h2 className="text-sm font-black text-[#DC2626] uppercase tracking-widest leading-none">Дереу ескерту!</h2>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase mt-1">
            {alert.type === 'missing_person' ? 'Іздеудегі адам' : alert.type === 'suspect' ? 'Іздеудегі күдікті' : 'Төтенше жағдай'}
          </p>
          {alert.crimePoint && (
            <p className="text-[9px] font-black text-[#1E3A8A] uppercase mt-1">
              Пункт: {getCrimePointLabel(alert.crimePoint)}
            </p>
          )}
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Main Photo Card */}
        <div className="ios-card overflow-hidden bg-white">
          <img 
            src={alert.photoUrl} 
            alt={alert.name} 
            className="w-full h-80 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="p-5">
            <h1 className="text-2xl font-black text-[#111827] uppercase tracking-tight">
              {alert.name}{alert.age ? `, ${alert.age} жаста` : ''}
            </h1>
            <div className="flex items-center gap-2 text-[#6B7280] text-[10px] font-bold mt-2 uppercase">
              <Clock size={12} className="text-[#DC2626]" />
              <span>Соңғы жаңарту: {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: kk })}</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3">
          <DetailSection 
            icon={<Info size={20} className="text-[#1E3A8A]" />} 
            title="Оқиға мәліметі" 
            content={alert.description} 
          />
          
          {alert.specialNotes && (
            <DetailSection 
              icon={<Shirt size={20} className="text-[#1E3A8A]" />} 
              title="Ерекше белгілері / Қосымша" 
              content={alert.specialNotes} 
            />
          )}
          
          <DetailSection 
            icon={<MapPin size={20} className="text-[#DC2626]" />} 
            title="Соңғы көрінген жері" 
            content={alert.lastSeenLocation} 
          />

          <DetailSection 
            icon={<ShieldCheck size={20} className="text-green-600" />} 
            title="Жауапты орган" 
            content={alert.authorityName} 
          />

          {alert.crimeDetails && alert.crimeDetails.length > 0 && (
            <div className="ios-card p-4 bg-white">
              <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3">Пункт бойынша толық мәлімет</h4>
              <div className="space-y-2">
                {alert.crimeDetails.map((detail) => (
                  <div key={`${detail.label}-${detail.value}`} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#F3F4F6]">
                    <p className="text-[10px] font-black text-[#1E3A8A] uppercase mb-1">{detail.label}</p>
                    <p className="text-sm font-semibold text-[#111827]">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Warning Footer Section */}
        <div className="bg-[#DC2626] rounded-3xl p-6 text-white text-center shadow-lg shadow-red-100">
          <h3 className="text-lg font-black uppercase mb-1">Қауіпсіз болыңыз!</h3>
          <p className="text-xs font-medium opacity-90 mb-6">
            Күдіктіні көрген жағдайда өзіңіз ұстауға тырыспаңыз. Дереу полицияға хабарласыңыз немесе ақпарат жіберіңіз.
          </p>
          
          <div className="flex gap-3">
            <a 
              href="tel:102"
              className="flex-1 bg-white text-[#DC2626] py-3.5 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <Phone size={16} fill="currentColor" />
              Қоңырау шалу
            </a>
            <button 
              onClick={() => navigate('/report')}
              className="flex-1 bg-[#1E3A8A] text-white py-3.5 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
            >
              <Send size={16} />
              Ақпарат жіберу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailSection: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="ios-card p-4 flex gap-4 items-start bg-white">
    <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-sm font-semibold text-[#111827] leading-relaxed">{content}</p>
    </div>
  </div>
);
