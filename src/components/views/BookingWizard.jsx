import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Car, Hotel, Languages, PenTool, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookingWizard({ onClose, onConfirm, artisanName }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [periodText, setPeriodText] = useState('');
  
  const [selectedEscort, setSelectedEscort] = useState('none');
  const [selectedLogistics, setSelectedLogistics] = useState('self');
  const [selectedHotel, setSelectedHotel] = useState('self');
  const [showNotice, setShowNotice] = useState(false);

  const steps = [
    { id: 1, icon: Calendar, title: t('wiz_step1') },
    { id: 2, icon: Languages, title: t('wiz_step_escort') },
    { id: 3, icon: Car, title: t('wiz_step2') },
    { id: 4, icon: Hotel, title: t('wiz_step_hotel') },
    { id: 5, icon: Languages, title: t('wiz_step3') },
    { id: 6, icon: PenTool, title: t('wiz_step4') }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(s => s + 1);
    } else {
      setShowNotice(true);
    }
  };

  const handleFinalConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-end"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md mx-auto bg-obsidian-900 border-t border-gold-500/30 rounded-t-3xl h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h2 className="font-serif text-xl text-gold-500">{t('wiz_title')}</h2>
            <p className="text-xs text-gray-400 mt-1">{artisanName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between px-8 py-6 relative shrink-0">
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-10 h-0.5 bg-gold-500 -translate-y-1/2 z-0" 
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 5rem)' }}
            transition={{ duration: 0.3 }}
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.id ? 'bg-gold-500 text-obsidian-900' : 'bg-obsidian-800 text-gray-500 border border-white/10'}`}>
                <s.icon className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-lg font-serif">{t('wiz_step1')}</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] text-gold-500 tracking-widest uppercase font-medium">Desired Period / Specific Week</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2nd-3rd week of May" 
                    value={periodText}
                    onChange={(e) => setPeriodText(e.target.value)}
                    className="w-full bg-obsidian-800 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-gold-500/50 outline-none transition-all"
                  />
                </div>

                <div className="bg-obsidian-800/50 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 text-gold-500"><ChevronLeft size={20}/></button>
                    <span className="text-xs font-serif tracking-widest">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 text-gold-500"><ChevronRight size={20}/></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-[10px] text-gray-500 py-2">{d}</div>)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => <div key={i} />)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === viewDate.getMonth();
                      return (
                        <button 
                          key={day} 
                          onClick={() => setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                          className={`aspect-square rounded-lg text-xs transition-all ${isSelected ? 'bg-gold-500 text-obsidian-900 font-bold' : 'text-gray-400 hover:bg-white/5'}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step_escort')}</h3>
                
                {/* Option 1: FREE (Top) */}
                <div 
                  onClick={() => setSelectedEscort('none')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedEscort === 'none' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-white">{t('log_escort_none_title')}</h4>
                      <p className="text-xs text-gray-400 mt-1">{t('log_escort_none_sub')}</p>
                    </div>
                    {selectedEscort === 'none' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>

                {/* Option 2: PAID */}
                <div 
                  onClick={() => setSelectedEscort('full')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedEscort === 'full' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-white">{t('log_escort_full_title')}</h4>
                        <span className="text-[10px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">PREMIUM</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t('log_escort_full_sub')}</p>
                    </div>
                    {selectedEscort === 'full' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step2')}</h3>
                
                {/* Option 1: FREE (Top) */}
                <div 
                  onClick={() => setSelectedLogistics('self')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedLogistics === 'self' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-white">{t('log_self_title')}</h4>
                      <p className="text-xs text-gray-400 mt-1">{t('log_self_sub')}</p>
                    </div>
                    {selectedLogistics === 'self' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>

                {/* Option 2: PAID */}
                <div 
                  onClick={() => setSelectedLogistics('icn_vip')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedLogistics === 'icn_vip' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-white">{t('log_vip_title')}</h4>
                        <span className="text-[10px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">$680</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t('log_vip_car')}</p>
                    </div>
                    {selectedLogistics === 'icn_vip' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step_hotel')}</h3>
                
                {/* Option 1: FREE (Top) */}
                <div 
                  onClick={() => setSelectedHotel('self')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedHotel === 'self' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-white">{t('log_hotel_self_title')}</h4>
                      <p className="text-xs text-gray-400 mt-1">{t('log_hotel_self_sub')}</p>
                    </div>
                    {selectedHotel === 'self' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>

                {/* Option 2: PAID/REQUEST */}
                <div 
                  onClick={() => setSelectedHotel('request')}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedHotel === 'request' ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-white">{t('log_hotel_title')}</h4>
                        <span className="text-[10px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">VIP</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{t('log_hotel_sub')}</p>
                    </div>
                    {selectedHotel === 'request' && <CheckCircle2 className="text-gold-500 w-5 h-5" />}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step3')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gold-500/10 border border-gold-500/50 rounded-xl p-6 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🇰🇷 🇺🇸</span>
                    <h4 className="text-sm font-medium text-gold-500">English / Korean</h4>
                  </button>
                  <button className="bg-obsidian-800 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center opacity-70">
                    <span className="text-3xl mb-2">🇰🇷 🇰🇭</span>
                    <h4 className="text-sm font-medium text-gray-300">Khmer / Korean</h4>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-8">
                <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-gold-500" />
                </div>
                <h3 className="text-2xl font-serif mb-2">Almost There</h3>
                <p className="text-sm text-gray-400 mb-8 px-8">Your bespoke medical journey is ready to be finalized. Please review the payment policy on the next screen.</p>
                <div className="bg-obsidian-800 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Hospital</span><span className="text-white font-medium">{artisanName}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Schedule</span><span className="text-white font-medium">{periodText || selectedDate.toLocaleDateString()}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Escort</span><span className="text-white font-medium uppercase">{selectedEscort}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/5 pb-safe">
          <button 
            onClick={handleNext} 
            className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif text-lg hover:bg-gold-400 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            {step < steps.length ? 'Continue' : t('wiz_confirm')}
          </button>
        </div>
      </motion.div>

      {/* Payment Notice Popup */}
      <AnimatePresence>
        {showNotice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-obsidian-900 border border-gold-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,0,0,1)]"
            >
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-serif text-gold-500 mb-4 uppercase tracking-widest">Payment Notice</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-8">
                {t('wiz_payment_notice')}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleFinalConfirm}
                  className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif font-bold hover:bg-gold-400 transition-colors"
                >
                  I AGREE & CONFIRM
                </button>
                <button 
                  onClick={() => setShowNotice(false)}
                  className="w-full bg-white/5 text-gray-400 py-3 rounded-xl text-sm font-medium hover:text-white transition-colors"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
