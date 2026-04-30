import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Car, Hotel, Languages, PenTool, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookingWizard({ onClose, onConfirm, artisanName }) {
  const { t, lang, setLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  
  const [selectedEscort, setSelectedEscort] = useState('none');
  const [selectedLogistics, setSelectedLogistics] = useState('self');
  const [selectedHotel, setSelectedHotel] = useState('self');
  const [selectedLangPref, setSelectedLangPref] = useState('en_ko');
  
  const [expandedSections, setExpandedSections] = useState({});
  const [showNotice, setShowNotice] = useState(false);

  const steps = [
    { id: 1, icon: Calendar, title: t('wiz_step1') },
    { id: 2, icon: Languages, title: t('wiz_step_escort') },
    { id: 3, icon: Car, title: t('wiz_step2') },
    { id: 4, icon: Hotel, title: t('wiz_step_hotel') },
    { id: 5, icon: Languages, title: t('wiz_step3') },
    { id: 6, icon: PenTool, title: t('wiz_step4') }
  ];

  const toggleDate = (date) => {
    const dateStr = date.toDateString();
    setSelectedDates(prev => 
      prev.includes(dateStr) 
        ? prev.filter(d => d !== dateStr) 
        : [...prev, dateStr]
    );
  };

  const toggleDetail = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
          <div>
            <h2 className="font-serif text-xl text-gold-500">{t('wiz_title')}</h2>
            <p className="text-xs text-gray-400 mt-1">{artisanName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-obsidian-800 rounded-lg p-1 border border-white/5">
              {['EN', 'KO', 'KM'].map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${lang === l ? 'bg-gold-500 text-obsidian-900' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
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
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-serif">{t('wiz_step1')}</h3>
                  <span className="text-[10px] text-gold-500 font-mono tracking-widest">{selectedDates.length} DAYS SELECTED</span>
                </div>
                
                <div className="bg-obsidian-800/50 border border-white/5 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-1 text-gold-500"><ChevronLeft size={20}/></button>
                    <span className="text-xs font-serif tracking-widest">{viewDate.toLocaleString(lang === 'KO' ? 'ko-KR' : 'default', { month: 'long', year: 'numeric' }).toUpperCase()}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-1 text-gold-500"><ChevronRight size={20}/></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-[10px] text-gray-500 py-2">{d}</div>)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => <div key={i} />)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                      const isSelected = selectedDates.includes(dateObj.toDateString());
                      const isToday = new Date().toDateString() === dateObj.toDateString();
                      
                      return (
                        <button 
                          key={day} 
                          onClick={() => toggleDate(dateObj)}
                          className={`aspect-square rounded-lg text-xs transition-all relative flex items-center justify-center ${
                            isSelected ? 'bg-gold-500 text-obsidian-900 font-bold' : 
                            isToday ? 'border border-gold-500/30 text-gold-500' : 'text-gray-400 hover:bg-white/5'
                          }`}
                        >
                          {day}
                          {isSelected && <motion.div layoutId="date-glow" className="absolute inset-0 bg-gold-500 blur-sm -z-10 opacity-30" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic text-center uppercase tracking-tighter">You can select multiple dates or a range by clicking each day.</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step_escort')}</h3>
                
                {[
                  { id: 'none', title: t('log_escort_none_title'), sub: t('log_escort_none_sub'), detail: t('log_self_detail') },
                  { id: 'full', title: t('log_escort_full_title'), sub: t('log_escort_full_sub'), detail: t('log_vip_detail'), premium: true }
                ].map(opt => (
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedEscort === opt.id ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedEscort(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-white">{opt.title}</h4>
                          {opt.premium && <span className="text-[9px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">PREMIUM</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{opt.sub}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleDetail(`escort_${opt.id}`); }}
                          className="text-[9px] text-gold-500 mt-2 font-bold tracking-widest uppercase hover:underline"
                        >
                          {expandedSections[`escort_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}
                        </button>
                      </div>
                      {selectedEscort === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>
                      {expandedSections[`escort_${opt.id}`] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-4 mt-4 border-t border-white/5">
                            <p className="text-[11px] text-gray-400 italic leading-relaxed">{opt.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step2')}</h3>
                
                {[
                  { id: 'self', title: t('log_self_title'), sub: t('log_self_sub'), detail: t('log_self_detail') },
                  { id: 'icn_vip', title: t('log_vip_title'), sub: t('log_vip_car'), detail: t('log_vip_detail'), price: '$680' }
                ].map(opt => (
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedLogistics === opt.id ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedLogistics(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-white">{opt.title}</h4>
                          {opt.price && <span className="text-[9px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">{opt.price}</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{opt.sub}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleDetail(`log_${opt.id}`); }} className="text-[9px] text-gold-500 mt-2 font-bold tracking-widest uppercase hover:underline">{expandedSections[`log_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}</button>
                      </div>
                      {selectedLogistics === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>{expandedSections[`log_${opt.id}`] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 mt-4 border-t border-white/5"><p className="text-[11px] text-gray-400 italic leading-relaxed">{opt.detail}</p></div></motion.div>}</AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step_hotel')}</h3>
                
                {[
                  { id: 'self', title: t('log_hotel_self_title'), sub: t('log_hotel_self_sub'), detail: t('log_hotel_self_detail') },
                  { id: 'request', title: t('log_hotel_title'), sub: t('log_hotel_sub'), detail: t('log_hotel_detail'), premium: true }
                ].map(opt => (
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedHotel === opt.id ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedHotel(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-white">{opt.title}</h4>
                          {opt.premium && <span className="text-[9px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono">VIP</span>}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{opt.sub}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleDetail(`hotel_${opt.id}`); }} className="text-[9px] text-gold-500 mt-2 font-bold tracking-widest uppercase hover:underline">{expandedSections[`hotel_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}</button>
                      </div>
                      {selectedHotel === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>{expandedSections[`hotel_${opt.id}`] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 mt-4 border-t border-white/5"><p className="text-[11px] text-gray-400 italic leading-relaxed">{opt.detail}</p></div></motion.div>}</AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg font-serif mb-6">{t('wiz_step3')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'en_ko', flags: '🇰🇷 🇺🇸', label: 'English / Korean' },
                    { id: 'km_ko', flags: '🇰🇷 🇰🇭', label: 'Khmer / Korean' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setSelectedLangPref(opt.id)}
                      className={`flex items-center gap-6 p-6 rounded-2xl border transition-all ${selectedLangPref === opt.id ? 'bg-gold-500/10 border-gold-500' : 'bg-obsidian-800 border-white/5 opacity-60'}`}
                    >
                      <span className="text-3xl shrink-0">{opt.flags}</span>
                      <div className="text-left">
                        <h4 className={`text-sm font-medium ${selectedLangPref === opt.id ? 'text-gold-500' : 'text-gray-300'}`}>{opt.label}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Dedicated Interpreter</p>
                      </div>
                      {selectedLangPref === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 ml-auto" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-8">
                <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-gold-500" />
                </div>
                <h3 className="text-2xl font-serif mb-2 uppercase tracking-tighter">Review Request</h3>
                <p className="text-sm text-gray-400 mb-8 px-8 leading-relaxed">Your medical journey is about to begin. Please review your preferences below.</p>
                <div className="bg-obsidian-800 border border-white/10 rounded-2xl p-6 text-left space-y-3">
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-gray-500">Hospital</span><span className="text-white font-medium">{artisanName}</span></div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-gray-500">Schedule</span><span className="text-gold-500 font-bold">{selectedDates.length > 0 ? `${selectedDates.length} Days Selected` : 'No dates selected'}</span></div>
                  <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-gray-500">Logistics</span><span className="text-white font-medium uppercase">{selectedLogistics}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Language</span><span className="text-white font-medium uppercase">{selectedLangPref.replace('_', ' / ')}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/5 pb-safe shrink-0">
          <button 
            onClick={handleNext} 
            className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif text-lg font-bold hover:bg-gold-400 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-95"
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
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-obsidian-900 border border-gold-500/30 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold-500" />
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-serif text-gold-500 mb-4 uppercase tracking-widest">Policy Agreement</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-8">
                {t('wiz_payment_notice')}
              </p>
              <div className="space-y-3">
                <button 
                  onClick={handleFinalConfirm}
                  className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif font-bold hover:bg-gold-400 transition-all"
                >
                  I AGREE & CONFIRM
                </button>
                <button 
                  onClick={() => setShowNotice(false)}
                  className="w-full bg-white/5 text-gray-400 py-3 rounded-xl text-xs font-medium hover:text-white transition-colors uppercase tracking-widest"
                >
                  Return to Edit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
