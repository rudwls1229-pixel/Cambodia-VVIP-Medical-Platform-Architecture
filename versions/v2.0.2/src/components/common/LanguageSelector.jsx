import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSelector({ variant = 'default' }) {
  const { lang, setLang } = useLanguage();
  const langs = ['EN', 'KO', 'KH'];

  const isHome = variant === 'home';

  return (
    <div className={isHome ? "" : "absolute top-0 right-0 p-4 z-[100]"}>
      <div className={`relative flex border rounded-full p-1 shadow-inner ${
        isHome 
          ? 'bg-obsidian-800/80 border-white/10 scale-90 origin-right' 
          : 'bg-obsidian-900 border-gold-500/30 shadow-lg shadow-gold-500/5'
      }`}>
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative z-10 ${isHome ? 'w-10' : 'w-12'} py-1 text-[8px] font-bold tracking-widest transition-all duration-300 text-center ${
              lang === l ? (isHome ? 'text-obsidian-950' : 'text-obsidian-900') : 'text-gray-500'
            }`}
          >
            {l}
          </button>
        ))}
        <motion.div
          className={`absolute top-1 bottom-1 ${isHome ? 'w-10' : 'w-12'} bg-gold-500 rounded-full`}
          initial={false}
          animate={{
            x: lang === 'EN' ? 0 : lang === 'KO' ? (isHome ? 40 : 48) : (isHome ? 80 : 96),
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
