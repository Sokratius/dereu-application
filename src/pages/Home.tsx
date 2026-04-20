import React from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { cn } from '../lib/utils';
import { useNotifications } from '../hooks/useNotifications';

import { MapComponent } from '../components/MapComponent';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { alerts } = useAlerts();
  const { sendDemoCrimeAlert } = useNotifications();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const latestAlert = activeAlerts[0]; // Highlight the first active one

  const simulateAlert = () => {
    sendDemoCrimeAlert();
  };

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden bg-white">
      {/* Blue Header */}
      <header className="bg-[#1E3A8A] px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-white font-black text-lg">D</span>
          </div>
          <h1 className="text-lg font-black text-white tracking-widest uppercase">DEREU</h1>
        </div>
        <button 
          onClick={simulateAlert}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* Geolocation Bar */}
      <div className="bg-[#2563EB] px-4 sm:px-6 py-2.5 flex items-center gap-2 z-40 border-t border-blue-400/30">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Алматы, GPS қосулы</span>
      </div>

      {/* Map Content */}
      <div className="flex-1 relative">
        <MapComponent alerts={activeAlerts} />
        
        {/* Warning Card at Bottom */}
        {latestAlert && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-24 left-3 sm:left-4 right-3 sm:right-4 z-50"
          >
            <div className="ios-card overflow-hidden">
              <div className="bg-[#DC2626] px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Дереу ескерту!</span>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
              <div className="p-4 flex gap-4">
                <img 
                  src={latestAlert.photoUrl} 
                  alt={latestAlert.name} 
                  className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#111827] text-sm uppercase mb-1">{latestAlert.name}, {latestAlert.age || '28'} жаста</h3>
                  <p className="text-[10px] text-[#6B7280] line-clamp-2 leading-relaxed mb-3 font-medium">
                    {latestAlert.description}
                  </p>
                  <Link 
                    to={`/alert/${latestAlert.id}`}
                    className="inline-block bg-[#1E3A8A] text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-sm shadow-blue-100"
                  >
                    Толығырақ
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

