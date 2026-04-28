import { useState, useRef, useEffect } from 'react';
import { Headset, ArrowRight, MapPin, X, Send, Mic, Sparkles, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';
import MedicalPassport from './MedicalPassport';
import VirtualTryOn from './VirtualTryOn';

// Assets
import signatureLiftingHero from '../../assets/signature_lifting_hero.png';

export default function Home() {
  const { t } = useLanguage();
  const { schedule, setActiveTab, setActiveFilter, userProfile } = useAppData();
  
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const [showPassport, setShowPassport] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  
  const chatEndRef = useRef(null);

  const services = [
    { id: 'dental', name: t('cat_dental'), icon: '🦷' },
    { id: 'eye', name: t('cat_eye'), icon: '👁️' },
    { id: 'derma', name: t('cat_derma'), icon: '✨' },
    { id: 'plastic', name: t('cat_plastic'), icon: '🎭' },
    { id: 'other', name: t('cat_other'), icon: '➕' },
  ];

  // Initialize chatbot
  useEffect(() => {
    if (showChat && messages.length === 0) {
      setTimeout(() => {
        setMessages([{ sender: 'ai', text: t('ai_msg') }]);
      }, 500);
    }
  }, [showChat, messages.length, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text = inputText) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputText('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: t('chat_reply') }]);
    }, 1500);
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSendMessage("I need a Maybach pickup from Incheon tomorrow.");
    }, 3000);
  };

  return (
    <div className="pt-24 px-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-gray-400 text-sm tracking-widest mb-1">{t('welcome_back')}</h2>
          <h1 className="text-2xl font-serif text-gray-100">{userProfile.name}</h1>
        </div>
        <button 
          onClick={() => setActiveTab('concierge')}
          className="w-10 h-10 rounded-full bg-obsidian-700 border border-gold-500/30 overflow-hidden relative group"
        >
          <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gold-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors" />
        </button>
      </header>

      {/* AI Personal Concierge Banner */}
      <motion.div 
        onClick={() => setShowChat(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian-800 to-obsidian-900 border border-gold-500/20 p-6 mb-8 group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[40px]" />
        
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/30">
            <Headset className="text-gold-500 w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-gold-500 mb-1">{t('ai_concierge')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
              {t('ai_msg')}
            </p>
            <div className="flex items-center gap-2 text-xs tracking-widest text-gray-300 group-hover:text-gold-500 transition-colors uppercase border-b border-transparent group-hover:border-gold-500 pb-1 w-fit">
              {t('start_conv')} <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Luxury Category Grid */}
      <section className="mb-8">
        <h3 className="font-serif tracking-wide text-lg mb-4">{t('services')}</h3>
        <div className="grid grid-cols-5 gap-2">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => {
                setActiveFilter(service.id === 'other' ? 'cat_all' : service.id);
                setActiveTab('artisans');
              }}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-obsidian-800 border border-white/5 flex items-center justify-center text-xl group-hover:border-gold-500/50 group-hover:bg-gold-500/10 transition-all">
                {service.icon}
              </div>
              <span className="text-[9px] text-gray-400 text-center tracking-wider">{service.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vertical Journey Itinerary */}
      <section className="mb-8">
        <h3 className="font-serif tracking-wide text-lg mb-6">{t('schedule')}</h3>
        
        <div className="relative space-y-6">
          {/* The Vertical Connecting Line */}
          <div className="absolute top-2 bottom-0 left-[9px] w-0.5 bg-gradient-to-b from-gold-500 via-gold-500/30 to-transparent"></div>

          <AnimatePresence>
            {schedule.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start group pl-10"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-obsidian-900 z-10 ${
                  item.status === 'completed' ? 'bg-gold-500' : 
                  item.status === 'current' ? 'bg-obsidian-800 border-2 border-gold-500' : 
                  'bg-obsidian-800 border-2 border-white/20'
                }`}>
                  {item.status === 'current' && (
                    <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-full border border-gold-500/50" />
                  )}
                  {item.status === 'completed' && <div className="w-1.5 h-1.5 bg-obsidian-900 rounded-full" />}
                </div>
                
                  {/* Timeline Content */}
                  <div className={`flex-1 min-w-0 ${item.status === 'upcoming' ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium text-sm truncate pr-2 ${item.status === 'current' ? 'text-gold-500' : 'text-gray-200'}`}>
                          {t(item.type)}
                        </h4>
                        {item.isUploaded && (
                          <div className="flex items-center gap-1 bg-gold-500/10 text-gold-500 text-[8px] px-1.5 py-0.5 rounded border border-gold-500/20 font-bold uppercase tracking-tighter">
                            <Plane className="w-2 h-2" /> Verified
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono tracking-widest whitespace-nowrap shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 break-words line-clamp-2">{t(item.detail) !== item.detail ? t(item.detail) : item.detail}</p>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Curated Selections */}
      <section>
        <h3 className="font-serif tracking-wide text-lg mb-4">{t('curated')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => setShowTryOn(true)} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-gold-500/30 transition-colors">
            <img src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80" alt="Assessment" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent" />
            <div className="absolute top-4 right-4 w-6 h-6 bg-gold-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-gold-500" />
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="font-serif text-sm">{t('assessment')}</h4>
              <p className="text-[10px] text-gold-500 tracking-widest mt-1">{t('tryon_title')}</p>
            </div>
          </div>
          <div 
            onClick={() => {
              setActiveFilter('cat_plastic');
              setActiveTab('artisans');
            }} 
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-transparent hover:border-gold-500/30 transition-colors"
          >
            <img src={signatureLiftingHero} alt="Signature Lift" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h4 className="font-serif text-sm">{t('signature_lift')}</h4>
              <p className="text-[10px] text-gold-500 tracking-widest mt-1">{t('dr_choi_ex')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot Bottom Sheet */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-obsidian-900 flex flex-col max-w-md mx-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gold-500/20 bg-obsidian-800/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                  <Sparkles className="text-gold-500 w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-gold-500">{t('ai_concierge')}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 tracking-widest">{t('chat_online')}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-gold-500 text-obsidian-900 rounded-tr-sm' 
                      : 'bg-obsidian-800 border border-white/5 text-gray-200 rounded-tl-sm'
                  }`}>
                    <p className={`text-sm ${msg.sender === 'user' ? 'font-medium' : 'leading-relaxed'}`}>{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Voice AI Input Area */}
            <div className="p-6 border-t border-white/10 bg-obsidian-900 pb-safe">
              <div className="flex items-center gap-3 relative">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isListening ? t('voice_listening') : t('chat_type')}
                    disabled={isListening}
                    className="w-full bg-obsidian-800 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50"
                  />
                  {!isListening && (
                    <button 
                      onClick={() => handleSendMessage()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center hover:bg-gold-400 transition-colors"
                    >
                      <Send className="w-4 h-4 text-obsidian-900 ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Microphone Button */}
                <button 
                  onClick={handleMicClick}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isListening ? 'bg-gold-500 text-obsidian-900 shadow-[0_0_30px_rgba(212,175,55,0.6)]' : 'bg-obsidian-800 border border-white/10 text-gold-500 hover:border-gold-500/50'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                  
                  {isListening && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-gold-500"
                    />
                  )}
                </button>
              </div>
              <p className="text-[9px] text-gray-500 text-center mt-4 tracking-widest">{isListening ? t('voice_listening') : t('voice_tap')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPassport && <MedicalPassport onClose={() => setShowPassport(false)} />}
        {showTryOn && <VirtualTryOn onClose={() => setShowTryOn(false)} />}
      </AnimatePresence>
    </div>
  );
}
