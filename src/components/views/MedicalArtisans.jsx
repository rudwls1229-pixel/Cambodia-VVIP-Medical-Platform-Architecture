import { useState, useEffect } from 'react';
import { SlidersHorizontal, Plane, ChevronRight, X, Star, MapPin, Clock, ShieldCheck, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import BookingWizard from './BookingWizard';

// Premium assets (External URLs for mobile compatibility)
const stemCellHero = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80';
const dentalHero = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80';
const breastHero = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80';
const noseHero = 'https://images.unsplash.com/photo-1516549221187-df702830cb3d?auto=format&fit=crop&q=80';

export default function MedicalArtisans() {
  const { t, lang } = useLanguage();
  const { addScheduleItem, activeFilter, setActiveFilter } = useAppData();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('region_all');
  const [wizardArtisan, setWizardArtisan] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);

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
      image: stemCellHero,
      description: lang === 'KO' 
        ? "시그니처 줄기세포 안티에이징 리프팅은 최첨단 줄기세포 배양액을 사용하여 피부 본연의 재생 능력을 극대화하고 깊은 주름을 근본적으로 개선하는 하이엔드 리프팅 시술입니다."
        : "Signature Stem Cell Anti-Aging Lift is a high-end lifting procedure that maximizes skin's natural regenerative ability and fundamentally improves deep wrinkles using state-of-the-art stem cell culture media.",
      duration: "90 min",
      recovery: "3-5 Days",
      doctors: [
        { name: t('dr_choi'), spec: t('dr_choi_spec'), img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80" },
        { name: t('dr_park'), spec: t('dr_park_spec'), img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80" }
      ],
      address: "8, Nonhyeon-ro 175-gil, Gangnam-gu, Seoul"
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
      image: dentalHero,
      description: lang === 'KO'
        ? "3D 프리미엄 임플란트는 디지털 가이드 시스템을 통해 오차 없는 정밀한 식립을 보장하며, 시술 당일 식사가 가능한 원데이 보철 시스템을 제공합니다."
        : "3D Premium Implant guarantees precise placement without errors through a digital guide system and provides a one-day prosthetic system that allows meals on the same day of the procedure.",
      duration: "120 min",
      recovery: "1-2 Weeks",
      doctors: [
        { name: "Dr. James Han", spec: "Oral Surgeon", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80" }
      ],
      address: "12, Gangnam-daero 94-gil, Gangnam-gu, Seoul"
    },
    {
      id: 3,
      title: t('proc_3'),
      clinicName: t('clinic_3'),
      category: "cat_plastic",
      rating: "5.0",
      reviews: 512,
      originalPrice: 35000000,
      discountPrice: 21000000,
      discountRate: 40,
      image: breastHero,
      description: lang === 'KO'
        ? "Full HD 프리미엄 가슴 성형은 최첨단 내시경 장비를 사용하여 통증과 흉터를 최소화하며, 고객의 체형에 가장 자연스럽고 조화로운 라인을 완성합니다."
        : "Full HD Premium Breast Augmentation uses state-of-the-art endoscopic equipment to minimize pain and scarring, creating the most natural and harmonious lines for each body type.",
      duration: "150 min",
      recovery: "7-10 Days",
      doctors: [
        { name: "Dr. Kim Sung-hun", spec: "Breast Surgery Specialist", img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80" }
      ],
      address: "24, Dosan-daero 13-gil, Gangnam-gu, Seoul"
    },
    {
      id: 4,
      title: t('proc_4'),
      clinicName: t('clinic_4'),
      category: "cat_plastic",
      rating: "4.9",
      reviews: 728,
      originalPrice: 18000000,
      discountPrice: 12600000,
      discountRate: 30,
      image: noseHero,
      description: lang === 'KO'
        ? "구조적 코 성형은 단순히 높이는 것이 아니라 코의 내부 구조를 튼튼하게 재건하여 아름다운 모양과 호흡 기능을 동시에 개선하는 프리미엄 성형 솔루션입니다."
        : "Structural Nose Reshaping is a premium solution that doesn't just increase height but reconstructs the internal structure of the nose to improve both aesthetic shape and breathing function.",
      duration: "120 min",
      recovery: "5-7 Days",
      doctors: [
        { name: "Dr. Lee Do-hyun", spec: "Rhinoplasty Artisan", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80" }
      ],
      address: "15, Apgujeong-ro 28-gil, Gangnam-gu, Seoul"
    }
  ];

  const filteredEvents = activeFilter === 'cat_all' 
    ? clinicEvents 
    : clinicEvents.filter(e => e.category === activeFilter);

  // Scroll to top when detail view opens
  useEffect(() => {
    if (selectedClinic) window.scrollTo(0, 0);
  }, [selectedClinic]);

  return (
    <div className="pt-12 px-6 pb-24 relative min-h-screen bg-obsidian-900">
      <AnimatePresence mode="wait">
        {!selectedClinic ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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

            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <motion.div 
                  layout
                  key={event.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-obsidian-800/80 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm group p-4 flex gap-4 items-center cursor-pointer hover:border-gold-500/30 transition-colors"
                  onClick={() => setSelectedClinic(event)}
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/10 relative">
                    <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-0 left-0 bg-gold-500 text-obsidian-900 text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">BEST</div>
                  </div>
                  
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
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-obsidian-900 overflow-y-auto scrollbar-hide"
          >
            {/* Top Navigation Bar (Sticky-ish) */}
            <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
              <button onClick={() => setSelectedClinic(null)} className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Banner Image */}
            <div className="relative w-full aspect-[4/3]">
              <img src={selectedClinic.image} alt={selectedClinic.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent" />
            </div>

            {/* Clinic Info Body */}
            <div className="px-6 -mt-16 relative z-10 space-y-8 pb-32">
              <div className="bg-obsidian-800/80 border border-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                <h1 className="text-2xl font-serif text-white mb-2">{selectedClinic.title}</h1>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-gold-500 font-medium text-sm">{selectedClinic.clinicName}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
                    <span className="text-white font-bold">{selectedClinic.rating}</span>
                    <span className="text-gray-500">({selectedClinic.reviews.toLocaleString()} {t('reviews_count')})</span>
                  </div>
                </div>

                <div className="bg-obsidian-900/50 rounded-2xl p-5 border border-gold-500/20">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-gray-500 line-through">{selectedClinic.originalPrice.toLocaleString()}원</span>
                    <span className="text-gold-500 font-serif text-2xl">{selectedClinic.discountRate}% OFF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm font-medium tracking-wider uppercase">Exclusive VIP Price</span>
                    <span className="text-2xl font-serif text-white font-bold">{selectedClinic.discountPrice.toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-obsidian-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t('duration')}</p>
                    <p className="text-xs text-white font-medium">{selectedClinic.duration}</p>
                  </div>
                </div>
                <div className="bg-obsidian-800/40 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t('recovery')}</p>
                    <p className="text-xs text-white font-medium">{selectedClinic.recovery}</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <section>
                <h3 className="text-lg font-serif text-gold-500 mb-3 border-l-2 border-gold-500 pl-3">{t('about_procedure')}</h3>
                <p className="text-sm text-gray-400 leading-relaxed italic">
                  "{selectedClinic.description}"
                </p>
              </section>

              {/* Medical Staff */}
              <section>
                <h3 className="text-lg font-serif text-gold-500 mb-4 border-l-2 border-gold-500 pl-3">{t('medical_staff')}</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedClinic.doctors.map((doc, i) => (
                    <div key={i} className="shrink-0 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold-500/20 mb-2">
                        <img src={doc.img} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs text-white font-medium">{doc.name}</p>
                      <p className="text-[10px] text-gray-500">{doc.spec}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location */}
              <section>
                <h3 className="text-lg font-serif text-gold-500 mb-3 border-l-2 border-gold-500 pl-3">{t('location')}</h3>
                <div className="bg-obsidian-800/40 border border-white/5 rounded-2xl p-5 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                  <div>
                    <p className="text-xs text-white font-medium mb-1">{selectedClinic.clinicName}</p>
                    <p className="text-xs text-gray-400 leading-normal">{selectedClinic.address}</p>
                  </div>
                </div>
                <div className="w-full h-40 bg-obsidian-800 rounded-2xl mt-4 border border-white/5 overflow-hidden grayscale opacity-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-[10px] uppercase tracking-[0.3em]">Map Preview Locked</div>
                </div>
              </section>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-obsidian-900/90 backdrop-blur-xl border-t border-gold-500/20 z-[60]">
              <button 
                onClick={() => setWizardArtisan({ name: selectedClinic.clinicName })}
                className="w-full bg-gold-500 text-obsidian-900 font-serif text-lg py-4 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.3)] active:scale-95 transition-all"
              >
                {t('reserve_now')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Filter Modal Overlay */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="w-full max-w-md bg-obsidian-800 border-t border-gold-500/30 rounded-t-3xl p-6 pb-safe">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl text-gold-500">{t('concierge_filters')}</h2>
                <button onClick={() => setShowFilter(false)} className="p-2 rounded-full hover:bg-white/5"><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="mb-6">
                <label className="text-xs text-gray-400 tracking-widest uppercase mb-3 block">{t('vvip_pickup')}</label>
                <div className="space-y-2">
                  {["region_all", "region_pnh", "region_icn", "region_sgbac"].map(zoneId => (
                    <button key={zoneId} onClick={() => { setSelectedPickup(zoneId); setShowFilter(false); }} className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedPickup === zoneId ? 'bg-gold-500/10 border-gold-500 text-gold-500' : 'bg-obsidian-900 border-white/5 text-gray-300 hover:border-white/20'}`}><Plane className={`w-4 h-4 ${selectedPickup === zoneId ? 'text-gold-500' : 'text-gray-500'}`} /><span className="text-sm">{t(zoneId)}</span></button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFilter(false)} className="w-full bg-gold-500 text-obsidian-900 font-serif text-lg py-4 rounded-xl hover:bg-gold-400 transition-colors uppercase">{t('apply_pref')}</button>
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
