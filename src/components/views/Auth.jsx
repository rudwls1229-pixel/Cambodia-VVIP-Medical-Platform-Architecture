import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import logoImg from '../../assets/logo.png';
import pkg from '../../../package.json';

export default function Auth({ onLogin }) {
  const { t, setLang, lang } = useLanguage();
  const [stage, setStage] = useState('intro'); // intro, login, signup
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStage('login'), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate Passkey/Biometric popup interaction as requested
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleSocialLogin = (platform) => {
    setIsLoading(true);
    // As per request: clicking social login triggers the biometric/passkey popup interaction
    console.log(`Starting social login via ${platform} with Passkey authentication...`);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  const InputField = ({ icon: Icon, type, placeholder, label }) => (
    <div className="w-full mb-6">
      <label className="block text-[10px] tracking-[0.2em] text-gold-500/60 uppercase mb-2 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gold-500/40 group-focus-within:text-gold-500 transition-colors" />
        </div>
        <input
          type={type}
          className="block w-full pl-12 pr-4 py-4 bg-obsidian-800/50 border border-gold-500/20 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all text-lg"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian-900 w-full max-w-md mx-auto relative flex flex-col items-center justify-center overflow-hidden px-8">
      
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex bg-obsidian-900/80 backdrop-blur-md border border-gold-500/20 rounded-full p-1">
          {['EN', 'KO', 'KM'].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`w-10 py-1 text-[9px] font-medium tracking-widest transition-all rounded-full ${
                lang === l ? 'bg-gold-500 text-obsidian-900' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="text-center z-10"
          >
            <div className="w-24 h-24 mx-auto mb-6">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl tracking-[0.3em] font-light text-gray-400">THE SEOUL</h1>
            <h1 className="text-2xl tracking-[0.3em] font-bold text-gold-500">PRIVATE</h1>
          </motion.div>
        )}

        {(stage === 'login' || stage === 'signup') && (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full z-10 flex flex-col"
          >
            <div className="mb-10 text-center">
              <img src={logoImg} alt="Logo" className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-serif text-gray-100 tracking-wide">
                {stage === 'login' ? 'Welcome Back' : 'Join the Circle'}
              </h2>
              <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">
                {stage === 'login' ? 'VVIP Medical Platform' : 'Start your luxury journey'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full">
              {stage === 'signup' && (
                <InputField icon={User} type="text" placeholder="Full Name" label="Full Name" />
              )}
              
              <InputField 
                icon={Mail} 
                type="text" 
                placeholder={stage === 'login' ? "Email or Phone" : "Email or Telegram ID"} 
                label={stage === 'login' ? "Identification" : "Contact Info"} 
              />
              
              <InputField icon={Lock} type="password" placeholder="••••••••" label="Password" />
              
              {stage === 'signup' && (
                <InputField icon={Lock} type="password" placeholder="••••••••" label="Confirm Password" />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-gold-600 to-gold-400 rounded-xl text-obsidian-900 font-bold tracking-[0.2em] text-sm uppercase shadow-xl shadow-gold-500/10 hover:shadow-gold-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-obsidian-900/30 border-t-obsidian-900 rounded-full animate-spin" />
                ) : (
                  <>
                    {stage === 'login' ? 'Access Portal' : 'Register Now'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center">
              <div className="flex items-center gap-4 w-full mb-8">
                <div className="flex-1 h-px bg-gold-500/10"></div>
                <span className="text-[10px] tracking-widest text-gray-500 uppercase font-medium">Instant Access</span>
                <div className="flex-1 h-px bg-gold-500/10"></div>
              </div>

              <div className="flex gap-8">
                <button 
                  onClick={() => handleSocialLogin('Facebook')}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full border border-gold-500/20 bg-obsidian-800/50 flex items-center justify-center group-hover:border-gold-500/50 transition-all shadow-lg">
                    <svg className="w-7 h-7 fill-gold-500" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[9px] tracking-widest text-gray-500 uppercase">Facebook</span>
                </button>

                <button 
                  onClick={() => handleSocialLogin('Telegram')}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full border border-gold-500/20 bg-obsidian-800/50 flex items-center justify-center group-hover:border-gold-500/50 transition-all shadow-lg">
                    <svg className="w-8 h-8 fill-gold-500 ml-1" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <span className="text-[9px] tracking-widest text-gray-500 uppercase">Telegram</span>
                </button>
              </div>

              <button
                onClick={() => setStage(stage === 'login' ? 'signup' : 'login')}
                className="mt-12 text-[10px] tracking-[0.2em] text-gray-400 hover:text-gold-500 transition-colors uppercase"
              >
                {stage === 'login' ? (
                  <>Don't have an account? <span className="text-gold-500 font-bold ml-1">Sign Up</span></>
                ) : (
                  <>Already a member? <span className="text-gold-500 font-bold ml-1">Log In</span></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 text-[9px] tracking-[0.3em] text-gray-700 pointer-events-none uppercase">
        The Seoul Private v{pkg.version}
      </div>
    </div>
  );
}
