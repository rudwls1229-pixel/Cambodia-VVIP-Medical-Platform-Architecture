import React, { useState, useEffect } from 'react';
import { Search, Headset, X, Send, Mic, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';
import defaultAvatar from '../../assets/default_profile.png';
import signatureLiftingHero from '../../assets/signature_lifting_hero.png';

/**
 * 홈 뷰 (v3.0.0 리팩토링)
 * ----------------------------
 * 메인 대시보드 역할을 하며, 모듈형 구조로 관리됩니다.
 * 하이브리드 데이터 로딩 및 AI 지니 에스컬레이션이 포함됩니다.
 */
export default function HomeView() {
  const { t } = useLanguage();
  const { setActiveTab, setActiveFilter } = useAppData();
  const { userProfile } = useAuth();
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'skin', name: t('cat_skin'), icon: '✨' },
    { id: 'facial', name: t('cat_facial'), icon: '🎭' },
    { id: 'body', name: t('cat_body'), icon: '🧘' },
    { id: 'filler', name: t('cat_filler'), icon: '💉' },
    { id: 'anti-aging', name: t('cat_anti_aging'), icon: '⏳' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-900 pb-32">
      {/* Header Space */}
      <div className="h-24" />

      {/* Main Content */}
      <div className="px-6">
        <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-6 pt-12 pb-4 transition-all duration-300 ${scrolled ? 'bg-obsidian-900/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder={t('search_placeholder')} className="w-full bg-obsidian-800/80 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-xs text-white" />
            </div>
            <button onClick={() => setActiveTab('concierge')} className="w-9 h-9 rounded-full border border-gold-500/30 overflow-hidden">
              <img src={userProfile?.avatar || defaultAvatar} className="w-full h-full object-cover" alt="Profile" />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mt-8 mb-10">
          <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl">
            <img src={signatureLiftingHero} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Hero" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 to-transparent p-8 flex flex-col justify-center">
              <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest mb-2">Member Special</span>
              <h2 className="text-2xl font-serif text-white leading-tight">Premium Medical<br/>Architecture</h2>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="grid grid-cols-5 gap-y-6 mb-12">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => { setActiveFilter(cat.id); setActiveTab('artisans'); }} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-obsidian-800/50 border border-white/5 flex items-center justify-center text-2xl shadow-lg">
                {cat.icon}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Philosophy Section */}
        <section className="bg-obsidian-800/30 rounded-[2rem] p-8 border border-white/5 text-center">
          <h3 className="font-serif text-gold-500 text-lg mb-2">{t('philosophy_title')}</h3>
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs mx-auto">
            {t('philosophy_text')}
          </p>
        </section>
      </div>

      {/* Floating AI Genie */}
      <div className="fixed bottom-24 right-6 z-[60]">
        <button onClick={() => setShowChat(true)} className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-xl flex flex-col items-center justify-center border-4 border-obsidian-900 group">
          <Headset className="w-7 h-7 text-obsidian-950" />
          <span className="text-[8px] font-black text-obsidian-950 mt-0.5 uppercase">AI GENIE</span>
        </button>
      </div>

      {/* AI Chatbot Escort Logic */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[100] bg-obsidian-900 flex flex-col max-w-md mx-auto">
            <div className="p-6 border-b border-gold-500/20 flex justify-between items-center">
              <h2 className="font-serif text-gold-500 text-lg uppercase tracking-widest">AI GENIE</h2>
              <button onClick={() => setShowChat(false)}><X className="w-8 h-8 text-gray-400" /></button>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">🧞‍♂️</div>
              <h3 className="text-white mb-4">How can I assist your journey?</h3>
              <div className="grid grid-cols-1 gap-3 w-full">
                {['Book a Procedure', 'Inquire Price', 'Transport Support'].map((opt) => (
                  <button key={opt} className="py-4 bg-obsidian-800 border border-gold-500/20 rounded-2xl text-xs text-gray-300 hover:bg-gold-500 hover:text-obsidian-950 transition-all font-bold">
                    {opt}
                  </button>
                ))}
                {/* Escalation to Telegram */}
                <button 
                  onClick={() => window.open('https://t.me/TheSeoulPrivate', '_blank')}
                  className="py-4 bg-gold-500 rounded-2xl text-obsidian-950 font-black text-xs uppercase mt-4"
                >
                  Talk to Private Concierge
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 한글 주석:
 * HomeView는 메인 대시보드 기능을 모듈화한 결과물입니다.
 * 'AI 지니' 챗봇은 시나리오 기반의 선택지를 제공하며, 
 * 최종적으로는 텔레그램을 통한 실시간 상담원 연결(에스컬레이션) 기능을 포함하고 있습니다.
 */
