import React from 'react';
import { Bell, CheckCircle2, ChevronRight, MapPin, Siren } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { formatDistanceToNow } from 'date-fns';
import { kk } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationsPage: React.FC = () => {
  const { alerts } = useAlerts();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const { sendDemoCrimeAlert } = useNotifications();

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <header className="bg-[#1E3A8A] px-6 py-4 flex justify-between items-center z-50 shadow-md">
        <h1 className="text-sm font-black text-white uppercase tracking-widest">Хабарламалар</h1>
        <CheckCircle2 size={20} className="text-white opacity-80" />
      </header>

      <div className="p-4 space-y-4">
        <button
          type="button"
          onClick={sendDemoCrimeAlert}
          className="w-full bg-[#DC2626] text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-100 active:scale-[0.99] transition-all"
        >
          <Siren size={16} />
          Демо тревога (дыбыспен)
        </button>

        {activeAlerts.length > 0 ? (
          activeAlerts.map(alert => (
            <Link 
              key={alert.id} 
              to={`/alert/${alert.id}`}
              className="ios-card bg-white p-4 flex gap-4 items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                <Bell size={24} className="text-[#DC2626]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[10px] font-black text-[#6B7280] uppercase">Дереу ескерту!</span>
                  <span className="text-[9px] font-bold text-[#6B7280] opacity-60">
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: kk })}
                  </span>
                </div>
                <h3 className="text-sm font-black text-[#111827] truncate uppercase tracking-tight">
                  Жаңа оқиға: {alert.name}
                </h3>
                <div className="flex items-center gap-1 text-[9px] font-bold text-[#1E3A8A] mt-1 uppercase">
                  <MapPin size={10} className="text-[#DC2626]" />
                  <span className="truncate">{alert.lastSeenLocation}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#E5E7EB]" />
            </Link>
          ))
        ) : (
          <div className="ios-card p-12 text-center bg-white flex flex-col items-center justify-center">
            <Bell size={48} className="text-[#E5E7EB] mb-4" />
            <h3 className="text-sm font-black text-[#111827] uppercase">Жаңа хабарламалар жоқ</h3>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase mt-1 opacity-60">Жүйе қалыпты жұмыс істеп тұр</p>
          </div>
        )}
      </div>
    </div>
  );
};
