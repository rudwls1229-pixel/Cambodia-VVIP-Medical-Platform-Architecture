import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ScanLine, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function VirtualTryOn({ onClose }) {
  const { t } = useLanguage();
  const [stage, setStage] = useState('scanning'); // scanning, complete

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('complete');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-obsidian-900 flex flex-col"
    >
      <div className="absolute top-12 right-6 z-50">
        <button onClick={onClose} className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute top-12 left-0 w-full text-center z-40 drop-shadow-lg">
        <h2 className="font-serif text-2xl text-gold-500">{t('tryon_title')}</h2>
        {stage === 'scanning' && (
          <p className="text-xs text-white tracking-widest uppercase mt-2 animate-pulse">{t('tryon_scanning')}</p>
        )}
      </div>

      <div className="relative flex-1 bg-obsidian-900 overflow-hidden flex items-center justify-center">
        {/* Mock user face image */}
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800&h=1200" 
          alt="User Face" 
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${stage === 'complete' ? 'brightness-110 saturate-110' : 'brightness-75 grayscale'}`}
        />

        {/* Scanning Laser Effect */}
        <AnimatePresence>
          {stage === 'scanning' && (
            <>
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                className="absolute left-0 right-0 h-1 bg-gold-500 shadow-[0_0_20px_4px_rgba(212,175,55,0.8)] z-20"
              />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay z-10" />
              
              {/* Facial Tracking Points */}
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <div className="w-48 h-64 border border-gold-500/50 rounded-[50%] relative">
                  <div className="absolute -left-2 top-1/3 w-4 h-px bg-gold-500" />
                  <div className="absolute -right-2 top-1/3 w-4 h-px bg-gold-500" />
                  <div className="absolute left-1/2 -bottom-2 w-px h-4 bg-gold-500" />
                  <div className="absolute left-1/2 top-1/2 w-full h-px bg-gold-500/20 -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute left-1/2 top-1/2 w-px h-full bg-gold-500/20 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Results Overlay */}
        <AnimatePresence>
          {stage === 'complete' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-6 right-6 z-30 space-y-4"
            >
              <div className="bg-black/60 backdrop-blur-md border border-gold-500/40 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ScanLine className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] text-gray-300 tracking-widest uppercase">{t('tryon_sym')}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">96.8%</span>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-gold-500" />
                    <span className="text-[10px] text-gray-300 tracking-widest uppercase">{t('tryon_age')}</span>
                  </div>
                  <span className="text-2xl font-serif text-white">32 <span className="text-xs text-gray-400">Yrs</span></span>
                </div>
              </div>
              
              <button onClick={onClose} className="w-full bg-gold-500 text-obsidian-900 py-4 rounded-xl font-serif text-lg hover:bg-gold-400 transition-colors">
                View Recommendations
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
