import { useState } from 'react';
import { Plane, Car, Hotel, Utensils, ArrowRight, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Concierge() {
  const { t } = useLanguage();
  const [selectedProc, setSelectedProc] = useState(null);

  const procedures = [
    { id: 'proc1', name: t('est_proc1'), krw: 12000000, usd: 8800 },
    { id: 'proc2', name: t('est_proc2'), krw: 8500000, usd: 6200 },
    { id: 'proc3', name: t('est_proc3'), krw: 25000000, usd: 18500 }
  ];

  const services = [
    {
      id: 1,
      title: t('srv_fasttrack'),
      icon: Plane,
      image: "https://images.unsplash.com/photo-1544261494-df0ea6383e6f?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: t('srv_limo'),
      icon: Car,
      image: "https://images.unsplash.com/photo-1549429440-621e25e98bb4?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: t('srv_hotel'),
      icon: Hotel,
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      title: t('srv_diet'),
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="pt-12 px-6 pb-24">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-serif text-gold-500 mb-2">{t('concierge_title')}</h1>
        <p className="text-sm text-gray-400 tracking-widest uppercase">{t('concierge_sub')}</p>
      </header>

      {/* Price Estimator */}
      <section className="mb-12 bg-obsidian-800/40 border border-gold-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-gold-500" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-gray-100">{t('est_title')}</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">{t('est_sub')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {procedures.map(proc => (
            <button 
              key={proc.id}
              onClick={() => setSelectedProc(proc)}
              className={`px-4 py-2 rounded-full text-xs transition-colors border ${
                selectedProc?.id === proc.id 
                  ? 'bg-gold-500 text-obsidian-900 border-gold-500 font-medium' 
                  : 'bg-obsidian-900 border-white/10 text-gray-400 hover:border-gold-500/50'
              }`}
            >
              {proc.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {selectedProc && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-obsidian-900 border border-gold-500/30 rounded-xl p-5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <span className="text-xs text-gray-400 tracking-widest uppercase">{t('est_total')} (KRW)</span>
                <span className="text-2xl font-serif text-gray-100">{selectedProc.krw.toLocaleString()} <span className="text-sm text-gray-500">원</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 tracking-widest uppercase">{t('est_total')} (USD)</span>
                <span className="text-3xl font-serif text-gold-500">${selectedProc.usd.toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="space-y-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden group cursor-pointer border border-gold-500/10 hover:border-gold-500/40 transition-colors"
            >
              <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian-900 via-obsidian-900/80 to-transparent" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-3 group-hover:bg-gold-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-gold-500" />
                </div>
                <h2 className="text-lg font-serif text-gray-100 max-w-[70%]">{service.title}</h2>
                
                <button className="absolute right-6 bottom-6 flex items-center gap-2 text-[10px] text-gold-500 tracking-widest uppercase group-hover:text-gold-400">
                  {t('btn_request')} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
