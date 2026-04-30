import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Car, Hotel, Languages, PenTool, ChevronLeft, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BookingWizard({ onClose, onConfirm, artisanName }) {
  const { t, lang, setLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [viewDate, setViewDate] = useState(new Date());
  
  // Range selection states
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  
  const [selectedEscort, setSelectedEscort] = useState('none');
  const [selectedLogistics, setSelectedLogistics] = useState('self');
  const [selectedHotel, setSelectedHotel] = useState('self');
  const [selectedInterpreter, setSelectedInterpreter] = useState('none');
  
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

  const handleDateClick = (date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(d);
      setRangeEnd(null);
    } else if (rangeStart && !rangeEnd) {
      if (d < rangeStart) {
        setRangeStart(d);
      } else {
        setRangeEnd(d);
      }
    }
  };

  const isDateSelected = (date) => {
    if (!rangeStart) return false;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (rangeEnd) return d >= rangeStart && d <= rangeEnd;
    return d.getTime() === rangeStart.getTime();
  };

  const isRangeEdge = (date) => {
    if (!rangeStart) return null;
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (d.getTime() === rangeStart.getTime()) return 'start';
    if (rangeEnd && d.getTime() === rangeEnd.getTime()) return 'end';
    return null;
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
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col justify-end"
    >
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-md mx-auto bg-obsidian-900 border-t border-gold-500/30 rounded-t-3xl h-[85vh] flex flex-col shadow-2xl shadow-black"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/5 shrink-0">
          <div>
            <h2 className="font-serif text-xl text-gold-500">{t('wiz_title')}</h2>
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{artisanName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-obsidian-800 rounded-lg p-1 border border-white/5 shadow-inner">
              {['EN', 'KO', 'KH'].map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${lang === l ? 'bg-gold-500 text-obsidian-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>{l}</button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex justify-between px-8 py-6 relative shrink-0">
          <div className="absolute top-1/2 left-10 right-10 h-px bg-white/5 -translate-y-1/2 z-0" />
          <motion.div className="absolute top-1/2 left-10 h-px bg-gold-500/50 -translate-y-1/2 z-0" animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 5rem)' }} />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-gold-500 text-obsidian-900 shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'bg-obsidian-800 text-gray-600 border border-white/5'}`}>
                <s.icon className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex justify-between items-end">
                  <h3 className="text-lg font-serif">{t('wiz_step1')}</h3>
                  {rangeStart && (
                    <span className="text-[10px] text-gold-500 font-mono tracking-widest bg-gold-500/5 px-2 py-1 rounded">
                      {rangeStart.toLocaleDateString(lang === 'KO' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric' })} 
                      {rangeEnd ? ` - ${rangeEnd.toLocaleDateString(lang === 'KO' ? 'ko-KR' : 'en-US', { month: 'short', day: 'numeric' })}` : ''}
                    </span>
                  )}
                </div>
                <div className="bg-obsidian-800/40 border border-white/5 rounded-3xl p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} className="p-2 text-gold-500/50 hover:text-gold-500 transition-colors"><ChevronLeft size={20}/></button>
                    <span className="text-[11px] font-serif tracking-[0.3em] text-gray-300 uppercase">{viewDate.toLocaleString(lang === 'KO' ? 'ko-KR' : 'default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} className="p-2 text-gold-500/50 hover:text-gold-500 transition-colors"><ChevronRight size={20}/></button>
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-center text-[10px] text-gray-600 py-2 font-bold">{d}</div>)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => <div key={i} />)}
                    {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                      const day = i + 1;
                      const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                      const selected = isDateSelected(dateObj);
                      const edge = isRangeEdge(dateObj);
                      const isToday = new Date().toDateString() === dateObj.toDateString();
                      return (
                        <div key={day} className="relative aspect-square">
                          <button onClick={() => handleDateClick(dateObj)} className={`w-full h-full rounded-xl text-xs transition-all flex items-center justify-center relative z-10 ${edge ? 'bg-gold-500 text-obsidian-900 font-bold shadow-lg' : selected ? 'text-gold-500 font-bold' : isToday ? 'border border-gold-500/30 text-gold-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>{day}</button>
                          {selected && rangeStart && rangeEnd && <div className={`absolute inset-y-2 bg-gold-500/15 z-0 ${edge === 'start' ? 'left-1/2 right-0 rounded-l-none' : edge === 'end' ? 'left-0 right-1/2 rounded-r-none' : 'inset-x-0'}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic text-center leading-relaxed px-10">{t('wiz_date_hint')}</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step_escort')}</h3>
                {[
                  { id: 'none', title: t('log_escort_none_title'), sub: t('log_escort_none_sub'), detail: t('log_self_detail') },
                  { id: 'full', title: t('log_escort_full_title'), sub: t('log_escort_full_sub'), detail: t('log_vip_detail'), premium: true }
                ].map(opt => (
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedEscort === opt.id ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' : 'bg-obsidian-800/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedEscort(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-gray-100">{opt.title}</h4>
                          {opt.premium && <span className="text-[8px] bg-gold-500 text-obsidian-900 px-1.5 py-0.5 rounded font-bold tracking-tighter">VIP</span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{opt.sub}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleDetail(`escort_${opt.id}`); }} className="text-[9px] text-gold-500/60 mt-2 font-bold tracking-[0.2em] uppercase hover:text-gold-500">{expandedSections[`escort_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}</button>
                      </div>
                      {selectedEscort === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>{expandedSections[`escort_${opt.id}`] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 mt-4 border-t border-white/5"><p className="text-[11px] text-gray-500 italic leading-relaxed">{opt.detail}</p></div></motion.div>}</AnimatePresence>
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
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedLogistics === opt.id ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' : 'bg-obsidian-800/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedLogistics(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-gray-100">{opt.title}</h4>
                          {opt.price && <span className="text-[9px] bg-gold-500/20 text-gold-500 px-1.5 py-0.5 rounded font-mono font-bold">{opt.price}</span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{opt.sub}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleDetail(`log_${opt.id}`); }} className="text-[9px] text-gold-500/60 mt-2 font-bold tracking-[0.2em] uppercase hover:text-gold-500">{expandedSections[`log_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}</button>
                      </div>
                      {selectedLogistics === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>{expandedSections[`log_${opt.id}`] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 mt-4 border-t border-white/5"><p className="text-[11px] text-gray-500 italic leading-relaxed">{opt.detail}</p></div></motion.div>}</AnimatePresence>
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
                  <div key={opt.id} className={`p-5 rounded-2xl border transition-all cursor-pointer ${selectedHotel === opt.id ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' : 'bg-obsidian-800/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                    <div className="flex justify-between items-start" onClick={() => setSelectedHotel(opt.id)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-gray-100">{opt.title}</h4>
                          {opt.premium && <span className="text-[8px] bg-gold-500 text-obsidian-900 px-1.5 py-0.5 rounded font-bold tracking-tighter">HOTEL</span>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">{opt.sub}</p>
                        <button onClick={(e) => { e.stopPropagation(); toggleDetail(`hotel_${opt.id}`); }} className="text-[9px] text-gold-500/60 mt-2 font-bold tracking-[0.2em] uppercase hover:text-gold-500">{expandedSections[`hotel_${opt.id}`] ? '(CLOSE)' : '(DETAILS)'}</button>
                      </div>
                      {selectedHotel === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 shrink-0 ml-4" />}
                    </div>
                    <AnimatePresence>{expandedSections[`hotel_${opt.id}`] && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="pt-4 mt-4 border-t border-white/5"><p className="text-[11px] text-gray-500 italic leading-relaxed">{opt.detail}</p></div></motion.div>}</AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-serif mb-6">{t('wiz_step3')}</h3>
                {[
                  { id: 'none', flags: '🏳️', title: t('int_none'), sub: t('int_none_sub'), free: true },
                  { id: 'kh_ko', flags: '🇰🇷 🇰🇭', title: t('int_kh_ko'), sub: t('int_kh_ko_sub') },
                  { id: 'en_ko', flags: '🇰🇷 🇺🇸', title: t('int_en_ko'), sub: t('int_en_ko_sub') }
                ].map(opt => (
                  <button 
                    key={opt.id} onClick={() => setSelectedInterpreter(opt.id)}
                    className={`w-full flex items-center gap-5 p-5 rounded-2xl border transition-all ${selectedInterpreter === opt.id ? 'bg-gold-500/10 border-gold-500 shadow-lg shadow-gold-500/5' : 'bg-obsidian-800/40 border-white/5 opacity-60 hover:opacity-100'}`}
                  >
                    <span className="text-2xl shrink-0 grayscale-[0.3]">{opt.flags}</span>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium ${selectedInterpreter === opt.id ? 'text-gold-500' : 'text-gray-300'}`}>{opt.title}</h4>
                        {opt.free && <span className="text-[8px] border border-green-500/50 text-green-500 px-1 rounded uppercase tracking-tighter font-bold">FREE</span>}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-medium">{opt.sub}</p>
                    </div>
                    {selectedInterpreter === opt.id && <CheckCircle2 className="text-gold-500 w-5 h-5 ml-auto" />}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-4">
                <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-gold-500" />
                </div>
                <h3 className="text-2xl font-serif mb-2 uppercase tracking-tighter text-white">Review Request</h3>
                <p className="text-[11px] text-gray-500 mb-8 px-10 leading-relaxed italic">Review your bespoke medical journey preferences.</p>
                <div className="bg-obsidian-800/60 border border-white/10 rounded-3xl p-6 text-left space-y-4 shadow-xl">
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3"><span className="text-gray-500 font-medium">{t('rev_hospital')}</span><span className="text-white font-serif tracking-wide">{artisanName}</span></div>
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3">
                    <span className="text-gray-500 font-medium">{t('rev_period')}</span>
                    <span className="text-gold-500 font-bold font-mono">
                      {rangeStart ? `${rangeStart.toLocaleDateString()} ${rangeEnd ? `- ${rangeEnd.toLocaleDateString()}` : ''}` : t('pol_not_selected')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-3"><span className="text-gray-500 font-medium">{t('rev_logistics')}</span><span className="text-white font-medium uppercase tracking-widest">{selectedLogistics}</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-gray-500 font-medium">{t('rev_interpreter')}</span><span className="text-white font-medium uppercase tracking-widest">{selectedInterpreter.replace('_', ' / ')}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/5 pb-safe shrink-0">
          <button onClick={handleNext} className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-2xl font-serif text-lg font-bold hover:bg-gold-400 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)] active:scale-[0.98]">
            {step < steps.length ? 'Continue' : t('wiz_confirm')}
          </button>
        </div>
      </motion.div>

      {/* Policy Agreement */}
      <AnimatePresence>
        {showNotice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm bg-obsidian-900 border border-gold-500/30 rounded-[2.5rem] p-8 text-center shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><ShieldAlert className="w-10 h-10 text-gold-500" /></div>
              <h3 className="text-xl font-serif text-gold-500 mb-4 uppercase tracking-[0.2em]">{t('pol_title')}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-10 px-2 italic">{t('wiz_payment_notice')}</p>
              <div className="space-y-4">
                <button onClick={handleFinalConfirm} className="w-full bg-gold-500 text-obsidian-900 py-4.5 rounded-2xl font-serif font-bold text-lg hover:bg-gold-400 transition-all shadow-xl active:scale-[0.97] uppercase tracking-widest">{t('pol_confirm')}</button>
                <button onClick={() => setShowNotice(false)} className="w-full bg-white/5 text-gray-500 py-3.5 rounded-2xl text-[10px] font-bold hover:text-white transition-colors uppercase tracking-[0.3em]">{t('pol_edit')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
