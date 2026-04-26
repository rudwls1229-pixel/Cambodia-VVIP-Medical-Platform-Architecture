import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/logo.png';
import pkg from '../../../package.json';

export default function LoginFlow({ onLogin }) {
  const { t, setLang, lang } = useLanguage();
  const [stage, setStage] = useState('intro'); // intro, card, authenticating

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('card'), 3000);
    return () => clearTimeout(timer1);
  }, []);

  const handleBiometric = () => {
    setStage('authenticating');
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-obsidian-900 w-full max-w-md mx-auto relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />

      {/* Language Switcher for Login - Fixed at Top Right */}
      <AnimatePresence>
        {(stage === 'card' || stage === 'authenticating') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-6 right-6 z-50"
          >
            <div className="relative flex bg-obsidian-900 border border-gold-500/30 rounded-full p-1 shadow-lg shadow-gold-500/5">
              {['EN', 'KO', 'KM'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`relative z-10 w-12 py-1 text-[10px] font-medium tracking-widest transition-colors duration-300 text-center ${
                    lang === l ? 'text-obsidian-900' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {l}
                </button>
              ))}
              <motion.div
                className="absolute top-1 bottom-1 w-12 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                initial={false}
                animate={{ x: lang === 'EN' ? 0 : lang === 'KO' ? 48 : 96 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center z-10"
          >
            <div className="w-32 h-32 mx-auto mb-6">
              <img src={logoImg} alt="THE SEOUL PRIVATE Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            </div>
            <h1 className="text-2xl tracking-[0.2em] font-light mb-1">THE SEOUL</h1>
            <h1 className="text-2xl tracking-[0.2em] font-bold text-gold-500 mb-8">PRIVATE</h1>
            
            {/* K-MEDI CAM Sub-branding */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="pt-8 border-t border-gold-500/20 w-48 mx-auto"
            >
              <p className="text-[10px] tracking-[0.3em] text-gray-500 mb-1 uppercase">{t('powered_by')}</p>
              <h2 className="text-sm font-serif tracking-[0.15em] text-gray-300">K-MEDI CAM</h2>
              <p className="text-[9px] tracking-[0.1em] text-gold-500/50 mt-4 font-mono">v{pkg.version}</p>
            </motion.div>
          </motion.div>
        )}

        {stage === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
            className="flex flex-col items-center justify-center z-10 w-full px-8 h-full pt-10"
          >
            {/* The Private Card */}
            <motion.div 
              className="w-full aspect-[1.586] rounded-2xl relative overflow-hidden bg-gradient-to-br from-obsidian-700 to-obsidian-900 border border-gold-500/30 shadow-2xl shadow-gold-500/10 mb-12"
              animate={{
                boxShadow: ["0px 0px 0px rgba(212,175,55,0)", "0px 10px 40px rgba(212,175,55,0.2)", "0px 0px 0px rgba(212,175,55,0)"]
              }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,transparent_40%,rgba(212,175,55,0.1)_50%,transparent_60%)] bg-[length:200%_200%] animate-shimmer" />
              <div className="p-6 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-8 bg-gold-500/20 rounded-md border border-gold-500/40 flex items-center justify-center">
                    <div className="w-8 h-5 border border-gold-500/40 rounded-sm grid grid-cols-3 grid-rows-2 gap-[1px] p-[1px]">
                      {[...Array(6)].map((_, i) => <div key={i} className="bg-gold-500/40" />)}
                    </div>
                  </div>
                  <span className="font-serif text-gold-500 tracking-widest text-sm">{t('vvip_member')}</span>
                </div>
                <div>
                  <div className="text-xl font-serif text-gray-100 tracking-wider mb-2">{t('awaiting')}</div>
                </div>
              </div>
            </motion.div>

            <motion.button
              onClick={handleBiometric}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="group flex flex-col items-center mb-10"
            >
              <div className="w-16 h-16 rounded-full bg-obsidian-800 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:border-gold-500/60 group-hover:bg-gold-500/10 transition-all duration-300">
                <ScanFace className="text-gold-500 w-8 h-8" />
              </div>
              <span className="text-sm tracking-widest text-gray-400 group-hover:text-gold-500 transition-colors uppercase">{t('authenticate')}</span>
            </motion.button>

            {/* Social Logins */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex items-center gap-4 w-full mb-6">
                <div className="flex-1 h-px bg-gold-500/10"></div>
                <span className="text-[10px] tracking-widest text-gray-500 uppercase">{t('social_login')}</span>
                <div className="flex-1 h-px bg-gold-500/10"></div>
              </div>
              <div className="flex gap-6">
                {/* Facebook Luxury Icon */}
                <button onClick={() => onLogin()} className="w-12 h-12 rounded-full border border-gold-500/20 bg-obsidian-800 flex items-center justify-center hover:border-gold-500/60 hover:bg-gold-500/10 transition-all">
                  <svg className="w-5 h-5 fill-gold-500" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                {/* Telegram Luxury Icon */}
                <button onClick={() => onLogin()} className="w-12 h-12 rounded-full border border-gold-500/20 bg-obsidian-800 flex items-center justify-center hover:border-gold-500/60 hover:bg-gold-500/10 transition-all">
                  <svg className="w-6 h-6 fill-gold-500" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {stage === 'authenticating' && (
          <motion.div
            key="authenticating"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center z-10"
          >
            <div className="w-20 h-20 relative">
              <motion.div
                className="absolute inset-0 rounded-full border-t-2 border-gold-500"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <ScanFace className="text-gold-500 w-8 h-8 opacity-50" />
              </div>
            </div>
            <p className="mt-6 tracking-widest text-gold-500 text-sm font-serif uppercase">{t('verifying')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
