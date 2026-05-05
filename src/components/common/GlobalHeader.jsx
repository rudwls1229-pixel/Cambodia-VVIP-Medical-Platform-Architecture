import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/logo.png';

/**
 * 글로벌 헤더 컴포넌트 (v3.0.0)
 * ----------------------------
 * 로고와 언어 선택기를 통합하여 모든 페이지 상단에 배치합니다.
 * 테마(Dark/Light)에 따라 로고 배경이 유동적으로 변합니다.
 */
export default function GlobalHeader({ theme = 'dark' }) {
  const { lang, setLang } = useLanguage();
  const langs = ['EN', 'KO', 'KH'];

  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-[2000] flex justify-between items-start pointer-events-none">
      {/* Dynamic Logo Wrapper */}
      <div className={`p-2 rounded-xl transition-all duration-500 pointer-events-auto ${
        theme === 'light' ? 'bg-obsidian-900 shadow-xl' : 'bg-transparent'
      }`}>
        <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain mix-blend-screen" />
      </div>

      {/* Global Language Selector */}
      <div className="relative flex bg-obsidian-900/80 backdrop-blur-md border border-gold-500/30 rounded-full p-1 shadow-lg shadow-black/50 scale-90 origin-right pointer-events-auto">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative z-10 w-10 py-1 text-[8px] font-black tracking-widest transition-all duration-300 text-center ${
              lang === l ? 'text-obsidian-950' : 'text-gray-500'
            }`}
          >
            {l}
          </button>
        ))}
        <motion.div
          className="absolute top-1 bottom-1 w-10 bg-gold-500 rounded-full"
          initial={false}
          animate={{
            x: lang === 'EN' ? 0 : lang === 'KO' ? 40 : 80,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}

/**
 * 한글 주석:
 * GlobalHeader는 앱의 최상단 요소를 관리합니다.
 * 테마가 'light'일 경우 로고 뒤에 블랙 배경을 깔아 로고가 묻히지 않게 처리했습니다.
 * 언어 선택기 역시 모든 페이지에서 동일한 위치와 디자인으로 제공됩니다.
 */
