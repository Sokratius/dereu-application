import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Alert } from '../types';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { kk } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { getCrimePointLabel } from '../lib/crimePoints';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="ios-card overflow-hidden bg-white mb-4"
    >
      <Link to={`/alert/${alert.id}`}>
        <div className={cn(
          "px-4 py-1.5 flex items-center justify-between",
          alert.type === 'emergency' ? "bg-[#DC2626]" : "bg-[#1E3A8A]"
        )}>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {alert.type === 'missing_person' ? 'Жоғалған адам' : alert.type === 'suspect' ? 'Күдікті' : 'Төтенше жағдай'}
          </span>
          <span className="text-[9px] font-bold text-white opacity-80 uppercase">
            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true, locale: kk })}
          </span>
        </div>
        
        <div className="p-4 flex gap-4">
          <div className="relative shrink-0">
            <img
              src={alert.photoUrl}
              alt={alert.name}
              className="w-20 h-20 rounded-xl object-cover border border-[#E5E7EB]"
              referrerPolicy="no-referrer"
            />
            {alert.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <ShieldCheck size={16} className="text-[#2563EB]" fill="currentColor" fillOpacity={0.2} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="text-[15px] font-black text-[#111827] truncate uppercase mb-1">
                {alert.name}{alert.age ? `, ${alert.age} жаста` : ''}
              </h3>
              {alert.crimePoint && (
                <span className="inline-flex mb-1 px-2 py-1 rounded-lg bg-[#EEF2FF] text-[#1E3A8A] text-[9px] font-black uppercase tracking-wide">
                  {getCrimePointLabel(alert.crimePoint)}
                </span>
              )}
              <p className="text-[11px] text-[#6B7280] line-clamp-2 font-medium leading-relaxed">
                {alert.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F4F6]">
              <div className="flex items-center text-[10px] font-bold text-[#1E3A8A] gap-1 truncate max-w-30">
                <MapPin size={12} className="text-[#DC2626]" />
                <span className="truncate uppercase">{alert.lastSeenLocation}</span>
              </div>
              <div className="text-[10px] font-bold text-[#2563EB] flex items-center gap-1 uppercase">
                <span>Толығырақ</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
