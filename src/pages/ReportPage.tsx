import React, { useState } from 'react';
import { Camera, MapPin, Send, Loader2, CheckCircle2, ChevronLeft, Calendar, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useAlerts } from '../context/AlertContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapComponent } from '../components/MapComponent';

export const ReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alerts, addReport } = useAlerts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    alertId: '',
    message: '',
    locationName: '',
    photo: null as string | null
  });

  const handlePhotoUpload = () => {
    setFormData(prev => ({ ...prev, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.alertId || !formData.message) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addReport({
      alertId: formData.alertId,
      reporterId: user?.id || 'anon',
      message: formData.message,
      location: formData.locationName || undefined,
      photoUrl: formData.photo || undefined,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[80vh] bg-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-50 text-[#10B981] rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-xl font-black text-[#111827] mb-2 uppercase">Рахмет!</h2>
        <p className="text-[#6B7280] text-sm mb-10 max-w-xs font-medium">Сіздің мәліметтеріңіз сәтті жіберілді. Сіздің көмегіңіз қауіпсіздік үшін өте маңызды.</p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-[#1E3A8A] text-white rounded-xl py-4 font-black uppercase text-sm shadow-lg shadow-blue-100"
        >
          Басты бетке қайту
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <header className="bg-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50 border-b border-[#E5E7EB]">
        <button onClick={() => navigate(-1)} className="text-[#1E3A8A]">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-sm font-black text-[#111827] uppercase tracking-widest">Ақпарат жіберу</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Incident Info Section */}
        <div className="ios-card p-5 space-y-4 bg-white">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-[#1E3A8A]" />
              Оқиға түрі
            </label>
            <select
              value={formData.alertId}
              onChange={(e) => setFormData(prev => ({ ...prev, alertId: e.target.value }))}
              className="w-full bg-[#F3F4F6] border-none rounded-xl py-3.5 px-4 text-sm font-bold text-[#111827] focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
              required
            >
              <option value="" disabled>Оқиғаны таңдаңыз...</option>
              {alerts.filter(a => a.status === 'active').map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-[#DC2626]" />
              Орналасқан жердің сипаттамасы
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
              placeholder="Мекен-жайы немесе бағдар..."
              className="w-full bg-[#F3F4F6] border-none rounded-xl py-3.5 px-4 text-sm font-bold text-[#111827] focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-[#1E3A8A]" />
              Қосымша ақпарат
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Көрген оқиғаңыз туралы толық мәлімет..."
              className="w-full bg-[#F3F4F6] border-none rounded-xl py-3.5 px-4 h-32 text-sm font-bold text-[#111827] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              required
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="ios-card p-5 bg-white">
          <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest block mb-3">Сурет жүктеу</label>
          <button
            type="button"
            onClick={handlePhotoUpload}
            className="w-full border-2 border-dashed border-[#E5E7EB] rounded-2xl py-8 flex flex-col items-center justify-center gap-2 text-[#6B7280] hover:bg-[#F3F4F6] transition-all"
          >
            {formData.photo ? (
              <img src={formData.photo} alt="Алдын ала қарау" className="w-20 h-20 object-cover rounded-xl border border-[#E5E7EB]" />
            ) : (
              <Camera size={24} />
            )}
            <span className="text-[10px] font-black uppercase text-[#1E3A8A]">Суретті қосу (Фото)</span>
          </button>
        </div>

        {/* Automatic Info */}
        <div className="ios-card p-5 bg-white grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest block mb-1">Уақыты</label>
            <div className="flex items-center gap-2 text-sm font-black text-[#111827]">
              <Calendar size={14} className="text-[#1E3A8A]" />
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-right">
            <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest block mb-1">GPS Күйі</label>
            <span className="text-[10px] font-black text-[#10B981] uppercase">Қосулы</span>
          </div>
        </div>

        {/* Mini Map */}
        <div className="ios-card h-40 overflow-hidden relative border border-[#E5E7EB] bg-white">
          <MapComponent alerts={[]} center={[43.238949, 76.889709]} zoom={15} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MapPin size={32} className="text-[#DC2626] drop-shadow-lg" fill="currentColor" opacity={0.5} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#DC2626] text-white rounded-2xl py-5 font-black text-sm tracking-widest shadow-lg shadow-red-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : (
            <>
              <Send size={18} />
              <span>Ақпаратты жіберу</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
