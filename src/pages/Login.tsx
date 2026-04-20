import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, ShieldCheck, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Login: React.FC = () => {
  const [step, setStep] = useState<'iin' | 'code'>('iin');
  const [iin, setIin] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (iin.length !== 12) {
      setError('ЖСН 12 саннан тұруы керек');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setStep('code');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(iin, code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-8 max-w-md mx-auto relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full relative z-10"
      >
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-[#1E3A8A] rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-100">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#111827] tracking-tighter mb-1 uppercase">DEREU</h1>
          <p className="text-[#6B7280] font-bold uppercase text-[10px] tracking-widest">Мемлекеттік қауіпсіздік жүйесі</p>
        </div>

        <div className="ios-card p-8 bg-white">
          <AnimatePresence mode="wait">
            {step === 'iin' ? (
              <motion.form
                key="iin"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendCode}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">ЖСН</label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="12 таңбалы ЖСН"
                      value={iin}
                      onChange={(e) => setIin(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 pl-12 pr-4 text-sm font-bold text-[#111827] focus:ring-2 focus:ring-blue-100 transition-all"
                      disabled={isSubmitting}
                    />
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E3A8A]" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#DC2626] text-[10px] font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={14} />
                    <span>ҚАТЕ: {error.toUpperCase()}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1E3A8A] text-white rounded-xl py-4 font-black text-xs tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 uppercase"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (
                    <>
                      <span>Растау сұранысы</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="code"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerify}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Растау коды</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#F3F4F6] border-none rounded-xl py-4 px-4 text-center text-3xl font-black tracking-[0.5em] text-[#111827] focus:ring-2 focus:ring-blue-100 transition-all"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  <p className="text-[10px] font-bold text-[#6B7280] mt-4 uppercase">
                    Кез-келген 4 санды енгізіңіз
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-[#DC2626] text-[10px] font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={14} />
                    <span>ҚАТЕ: {error.toUpperCase()}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#DC2626] text-white rounded-xl py-4 font-black text-xs tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 uppercase"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : "Жүйеге кіру"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('iin')}
                    className="w-full text-[#6B7280] font-bold py-2 text-[10px] hover:text-[#1E3A8A] uppercase tracking-widest transition-all"
                  >
                    ЖСН өзгерту
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest opacity-50">
          <span>ҚАУІПСІЗ_МЕМ_ЖҮЙЕ</span>
          <div className="w-1 h-1 bg-[#6B7280] rounded-full"></div>
          <span>АЛМАТЫ_ӨҢІРІ</span>
        </div>
      </motion.div>
    </div>
  );
};
