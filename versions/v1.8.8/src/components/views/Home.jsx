import { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, MessageCircle, Heart, Sparkles, 
  ArrowRight, ChevronRight, Mic, Send, X, 
  Headset, Plane, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import { useAuth } from '../../contexts/AuthContext';

// Assets
import signatureLiftingHero from '../../assets/signature_lifting_hero.png';
import defaultAvatar from '../../assets/default_profile.png';

export default function Home() {
  const { t } = useLanguage();
  const { setActiveTab, setActiveFilter } = useAppData();
  const { userProfile } = useAuth();
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
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
    { id: 'dental', name: t('cat_dental'), icon: '🦷' },
    { id: 'eye', name: t('cat_eye'), icon: '👁️' },
    { id: 'derma', name: t('cat_derma'), icon: '🧴' },
    { id: 'plastic', name: t('cat_plastic'), icon: '✂️' },
    { id: 'other', name: t('cat_other'), icon: '➕' },
  ];

  const tips = [
    {
      id: 1,
      title: t('unni_tip_1'),
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80",
      tag: "Trending"
    },
    {
      id: 2,
      title: t('unni_tip_2'),
      image: signatureLiftingHero,
      tag: "Expert"
    }
  ];

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: t('chat_reply') }]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-obsidian-900 pb-32">
      {/* Search Header (Gangnam Unni style) */}
      <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 px-6 pt-16 pb-4 transition-all duration-300 ${scrolled ? 'bg-obsidian-900/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder={t('search_placeholder')}
              className="w-full bg-obsidian-800/80 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-gold-500/50 transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setActiveTab('concierge')}
            className="w-9 h-9 rounded-full border border-gold-500/30 overflow-hidden shrink-0"
          >
            <img src={userProfile?.avatar || defaultAvatar} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </header>

      <div className="pt-36 px-6">
        {/* Main Banner Slider (Simulation) */}
        <div className="relative h-48 rounded-3xl overflow-hidden mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 to-transparent z-10" />
          <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Banner" />
          <div className="absolute inset-0 z-20 p-8 flex flex-col justify-center">
            <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest mb-2">Member Special</span>
            <h2 className="text-2xl font-serif text-white mb-4 leading-tight">Premium Medical<br/>Curation for VVIP</h2>
            <button className="bg-gold-500 text-obsidian-900 px-4 py-2 rounded-lg text-[10px] font-bold w-fit uppercase tracking-wider shadow-lg">Explore Now</button>
          </div>
        </div>

        {/* Category Grid (Gangnam Unni style) */}
        <section className="mb-10">
          <div className="grid grid-cols-5 gap-y-6">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => {
                  setActiveFilter(cat.id === 'other' ? 'cat_all' : cat.id);
                  setActiveTab('artisans');
                }}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-obsidian-800/50 border border-white/5 flex items-center justify-center text-2xl group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition-all shadow-lg">
                  {cat.icon}
                </div>
                <span className="text-[10px] text-gray-400 font-medium tracking-tighter group-hover:text-gold-500 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Artisan Insights (Gangnam Unni style "Tips") */}
        <section className="mb-8">
          <div className="flex justify-between items-baseline mb-6">
            <h3 className="text-lg font-serif text-white">{t('unni_tips_title')}</h3>
            <button className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1 hover:text-gold-500 transition-colors">
              {t('view_all')} <ChevronRight size={12} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {tips.map((tip) => (
              <motion.div 
                key={tip.id}
                whileHover={{ y: -5 }}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5">
                  <img src={tip.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" alt={tip.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gold-500/20 backdrop-blur-md rounded border border-gold-500/30 text-gold-500 text-[8px] font-bold uppercase">
                    {tip.tag}
                  </div>
                </div>
                <h4 className="text-sm text-gray-200 font-medium leading-snug group-hover:text-gold-500 transition-colors line-clamp-2">
                  {tip.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <div className="w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center text-[8px] text-obsidian-900">S</div>
                  The Seoul Artisans
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Brand Story Banner */}
        <section className="mt-12 bg-obsidian-800/30 rounded-[2rem] p-8 border border-white/5 text-center">
          <h3 className="font-serif text-gold-500 text-lg mb-2">{t('philosophy_title')}</h3>
          <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs mx-auto mb-6">
            {t('philosophy_text')}
          </p>
        </section>
      </div>

      {/* Floating AI Genie (Trip.com Style) */}
      <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence>
          {!showChat && (
            <motion.button 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              onClick={() => setShowChat(true)}
              className="pointer-events-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center border-4 border-obsidian-900 ring-2 ring-gold-500 group"
            >
              <div className="relative">
                <Headset className="w-7 h-7 text-obsidian-950 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-obsidian-900 animate-pulse" />
              </div>
              <span className="text-[8px] font-black text-obsidian-950 mt-0.5 tracking-tighter uppercase">AI GENIE</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chatbot Bottom Sheet (Integrated) */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900 flex flex-col max-w-md mx-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gold-500/20 bg-obsidian-800/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center overflow-hidden">
                  <div className="text-xl">🧞‍♂️</div>
                </div>
                <div>
                  <h2 className="font-serif text-gold-500 text-lg uppercase tracking-widest">AI GENIE</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 tracking-widest">{t('chat_online')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-8 h-8 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {messages.length === 0 && (
                <div className="text-center py-12 px-8">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-gold-500 font-serif text-lg mb-2">How can I assist your journey?</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Ask about medical procedures, luxury logistics, or artisan recommendations.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-3xl ${
                    msg.sender === 'user' 
                      ? 'bg-gold-500 text-obsidian-900 rounded-tr-sm shadow-xl' 
                      : 'bg-obsidian-800 border border-white/5 text-gray-200 rounded-tl-sm shadow-2xl'
                  }`}>
                    <p className={`text-sm ${msg.sender === 'user' ? 'font-bold' : 'leading-relaxed'}`}>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 bg-obsidian-950 pb-safe">
              <div className="flex items-center gap-3 relative">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isListening ? t('voice_listening') : t('chat_type')}
                    disabled={isListening}
                    className="w-full bg-obsidian-800/50 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 shadow-inner"
                  />
                  <button 
                    onClick={() => handleSendMessage()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                  >
                    <Send className="w-4 h-4 text-obsidian-900" />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setIsListening(true);
                    setTimeout(() => {
                      setIsListening(false);
                      handleSendMessage("I'd like to book a private jet from Singapore.");
                    }, 2500);
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isListening ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-obsidian-800 border border-white/10 text-gold-500'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
