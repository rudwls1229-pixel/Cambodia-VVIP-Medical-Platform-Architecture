import { useState } from 'react';
import { SlidersHorizontal, Plane, ChevronRight, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import BookingWizard from './BookingWizard';

export default function MedicalArtisans() {
  const { t } = useLanguage();
  const { addScheduleItem, activeFilter, setActiveFilter } = useAppData();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('region_all');
  const [wizardArtisan, setWizardArtisan] = useState(null);

  const categories = [
    { id: 'cat_all' },
    { id: 'cat_dental' },
    { id: 'cat_eye' },
    { id: 'cat_derma' },
    { id: 'cat_plastic' },
    { id: 'cat_other' }
  ];

  const clinicEvents = [
    {
      id: 1,
      title: t('proc_1'),
      clinicName: t('clinic_1'),
      category: "cat_plastic",
      rating: "4.9",
      reviews: 1254,
      originalPrice: 25000000,
      discountPrice: 15000000,
      discountRate: 40,
      image: "https://images.unsplash.com/photo-1519014616548-bf5fe4add90b?auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      title: t('proc_2'),
      clinicName: t('clinic_2'),
      category: "cat_dental",
      rating: "4.8",
      reviews: 842,
      originalPrice: 8500000,
      discountPrice: 6800000,
      discountRate: 20,
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
    }
  ];

  const filteredEvents = activeFilter === 'cat_all' 
    ? clinicEvents 
    : clinicEvents.filter(e => e.category === activeFilter);

  return (
    <div className="pt-12 px-6 pb-20 relative">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-serif text-gold-500 mb-1">{t('clinics_title')}</h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase">{t('clinics_sub')}</p>
        </div>
        <button 
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 bg-obsidian-800/80 border border-white/10 px-3 py-2 rounded-lg text-xs tracking-wider hover:border-gold-500/50 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t('filter')}
        </button>
      </header>

      {/* Category Filter Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs transition-colors border ${
              activeFilter === cat.id 
                ? 'bg-gold-500/10 border-gold-500 text-gold-500 font-medium' 
                : 'bg-obsidian-800 border-white/5 text-gray-400'
            }`}
          >
            {t(cat.id)}
          </button>
        ))}
      </div>

      {/* Selected Logistic Filter Display */}
      {selectedPickup !== 'region_all' && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-[10px] text-gray-500 tracking-widest uppercase">{t('logistics')}</span>
          <span className="text-xs text-gold-500 bg-gold-500/10 px-2 py-1 rounded border border-gold-500/20">{t(selectedPickup)}</span>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {filteredEvents.map((event) => (
            <motion.div 
              layout
              key={event.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ layout: { type: "spring", bounce: 0.4, duration: 0.8 } }}
              className="bg-obsidian-800/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm group p-4 flex gap-4 items-center cursor-pointer hover:border-gold-500/30 transition-colors"
              onClick={() => setWizardArtisan({ name: event.clinicName })}
            >
              {/* Left Thumbnail */}
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-0 left-0 bg-gold-500 text-obsidian-900 text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">BEST</div>
              </div>
              
              {/* Right Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                <div>
                  <h3 className="font-serif text-[13px] text-gray-100 mb-0.5 truncate leading-tight">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                    <span className="text-[10px] text-gray-400 tracking-wider truncate max-w-[120px]">{event.clinicName}</span>
                    <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                      <Star className="w-2.5 h-2.5 text-gold-500 fill-gold-500 shrink-0" />
                      <span className="text-gold-500 font-medium">{event.rating}</span>
                      <span>({event.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-gray-500 line-through decoration-gray-500/50 mb-0.5">
                      {event.originalPrice.toLocaleString()}원
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-serif text-gold-500 leading-none">{event.discountRate}%</span>
                      <span className="text-sm font-medium text-gray-100 leading-none">{event.discountPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-obsidian-900 transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {t('no_artisans')}
          </div>
        )}
      </div>

      {/* Global Filter Modal Overlay */}
      <AnimatePresence>
        {showFilter && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-obsidian-800 border-t border-gold-500/30 rounded-t-3xl p-6 pb-safe"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl text-gold-500">{t('concierge_filters')}</h2>
                <button onClick={() => setShowFilter(false)} className="p-2 rounded-full hover:bg-white/5">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <label className="text-xs text-gray-400 tracking-widest uppercase mb-3 block">{t('vvip_pickup')}</label>
                <div className="space-y-2">
                  {[
                    "region_all",
                    "region_pnh",
                    "region_icn",
                    "region_sgbac"
                  ].map(zoneId => (
                    <button 
                      key={zoneId}
                      onClick={() => { setSelectedPickup(zoneId); setShowFilter(false); }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedPickup === zoneId ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-obsidian-900 border-white/5 text-gray-300 hover:border-white/20'}`}
                    >
                      <Plane className={`w-4 h-4 ${selectedPickup === zoneId ? 'text-gold-500' : 'text-gray-500'}`} />
                      <span className="text-sm">{t(zoneId)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowFilter(false)}
                className="w-full bg-gold-500 text-obsidian-900 font-serif text-lg py-4 rounded-xl hover:bg-gold-400 transition-colors uppercase"
              >
                {t('apply_pref')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wizardArtisan && (
          <BookingWizard 
            artisanName={wizardArtisan.name}
            onClose={() => setWizardArtisan(null)}
            onConfirm={() => {
              addScheduleItem(wizardArtisan.name);
              setWizardArtisan(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
