import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Car, Languages, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookingWizard({ onClose, onConfirm, artisanName }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLogistics, setSelectedLogistics] = useState('icn_vip');
  const [expandedLogistics, setExpandedLogistics] = useState(null);

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const steps = [
    { id: 1, icon: Calendar, title: t('wiz_step1') },
    { id: 2, icon: Car, title: t('wiz_step2') },
    { id: 3, icon: Languages, title: t('wiz_step3') },
    { id: 4, icon: PenTool, title: t('wiz_step4') }
  ];

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
        <div className="flex justify-between px-8 py-6 relative">
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute top-1/2 left-10 h-0.5 bg-gold-500 -translate-y-1/2 z-0" 
            animate={{ width: `${((step - 1) / 3) * 100}%`, maxWidth: 'calc(100% - 5rem)' }}
            transition={{ duration: 0.3 }}
          />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.id ? 'bg-gold-500 text-obsidian-900' : 'bg-obsidian-800 text-gray-500 border border-white/10'}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step1')}</h3>
                
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6 px-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gold-500/10 rounded-full text-gold-500 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h4 className="font-serif text-lg tracking-[0.2em] text-gray-100">
                    {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </h4>
                  <button onClick={nextMonth} className="p-2 hover:bg-gold-500/10 rounded-full text-gold-500 transition-colors">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="bg-obsidian-800/50 border border-white/5 rounded-2xl p-4">
                  <div className="grid grid-cols-7 mb-4">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfMonth(viewDate) }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth(viewDate) }).map((_, i) => {
                      const day = i + 1;
                      const isSelected = selectedDate.getDate() === day && 
                                       selectedDate.getMonth() === viewDate.getMonth() && 
                                       selectedDate.getFullYear() === viewDate.getFullYear();
                      
                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day))}
                          className={`aspect-square flex items-center justify-center rounded-xl text-sm transition-all duration-300 ${
                            isSelected 
                              ? 'bg-gold-500 text-obsidian-900 font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                              : 'text-gray-300 hover:bg-white/5'
                          }`}
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
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step2')}</h3>
                
                <div className="space-y-4">
                  {/* Option 1: VIP Pickup */}
                  <div className={`border rounded-2xl transition-all duration-300 ${selectedLogistics === 'icn_vip' ? 'bg-gold-500/10 border-gold-500/50' : 'bg-obsidian-800 border-white/5'}`}>
                    <div 
                      onClick={() => setSelectedLogistics('icn_vip')}
                      className="p-5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className={`font-medium ${selectedLogistics === 'icn_vip' ? 'text-gold-500' : 'text-gray-300'}`}>
                            {t('log_vip_title')}
                          </h4>
                          <span className="text-[10px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">{t('log_vip_escort')}</span>
                        </div>
                        <p className="text-xs text-gray-400">{t('log_vip_car')}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedLogistics(expandedLogistics === 'icn_vip' ? null : 'icn_vip'); }}
                          className="text-[10px] text-gold-500 mt-2 hover:underline tracking-wider uppercase font-medium"
                        >
                          {expandedLogistics === 'icn_vip' ? `(CLOSE)` : `(DETAILS)`}
                        </button>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedLogistics === 'icn_vip' ? 'border-gold-500' : 'border-gray-600'}`}>
                        {selectedLogistics === 'icn_vip' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLogistics === 'icn_vip' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden px-5 pb-5"
                        >
                          <div className="pt-4 border-t border-white/10 space-y-2">
                            <p className="text-[11px] text-gray-400 leading-relaxed italic">
                              "{t('log_vip_detail')}"
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Option 2: Self Arrival */}
                  <div className={`border rounded-2xl transition-all duration-300 ${selectedLogistics === 'self' ? 'bg-gold-500/10 border-gold-500/50' : 'bg-obsidian-800 border-white/5'}`}>
                    <div 
                      onClick={() => setSelectedLogistics('self')}
                      className="p-5 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <h4 className={`font-medium ${selectedLogistics === 'self' ? 'text-gold-500' : 'text-gray-300'}`}>
                          {t('log_self_title')}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">{t('log_self_sub')}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedLogistics(expandedLogistics === 'self' ? null : 'self'); }}
                          className="text-[10px] text-gold-500 mt-2 hover:underline tracking-wider uppercase font-medium"
                        >
                          {expandedLogistics === 'self' ? `(CLOSE)` : `(DETAILS)`}
                        </button>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedLogistics === 'self' ? 'border-gold-500' : 'border-gray-600'}`}>
                        {selectedLogistics === 'self' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLogistics === 'self' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden px-5 pb-5"
                        >
                          <div className="pt-4 border-t border-white/10 space-y-2">
                            <p className="text-[11px] text-gray-400 leading-relaxed italic">
                              "{t('log_self_detail')}"
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step3')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="bg-gold-500/10 border border-gold-500/50 rounded-xl p-6 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🇰🇷 🇺🇸</span>
                    <h4 className="text-sm font-medium text-gold-500">English / Korean</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Native Speaker</p>
                  </button>
                  <button className="bg-obsidian-800 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center opacity-70">
                    <span className="text-3xl mb-2">🇰🇷 🇰🇭</span>
                    <h4 className="text-sm font-medium text-gray-300">Khmer / Korean</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Native Speaker</p>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step4')}</h3>
                <div className="bg-obsidian-800 border border-white/10 rounded-2xl h-48 flex items-center justify-center relative overflow-hidden group">
                  <p className="text-gray-500 text-sm italic group-hover:opacity-0 transition-opacity">Sign here</p>
                  {/* Mock signature path animation */}
                  <svg className="absolute inset-0 w-full h-full p-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 200 100">
                    <motion.path 
                      d="M20,50 Q40,20 60,50 T100,50 T140,40 T180,60" 
                      fill="transparent" 
                      stroke="#D4AF37" 
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/5 pb-safe">
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="w-full bg-gold-500/10 border border-gold-500 text-gold-500 py-4 rounded-xl font-serif text-lg hover:bg-gold-500 hover:text-obsidian-900 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={onConfirm}
              className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif text-lg hover:bg-gold-400 transition-colors"
            >
              {t('wiz_confirm')}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
