import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Send, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import logoImg from '../../assets/logo.png';
import pkg from '../../../package.json';

// Moved outside to prevent re-creation on every keystroke
const InputField = ({ icon: Icon, type, placeholder, label, value, onChange }) => (
  <div className="w-full mb-5">
    <label className="block text-[9px] tracking-[0.2em] text-gold-500/60 uppercase mb-2 ml-1 font-bold">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gold-500/40 group-focus-within:text-gold-500 transition-colors" />
      </div>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-4 py-3.5 bg-obsidian-800/40 border border-gold-500/20 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 transition-all text-base"
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default function Auth() {
  const { t, setLang, lang } = useLanguage();
  const { login, signup, socialLogin } = useAuth();
  
  const [stage, setStage] = useState('intro'); // intro, login, signup
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setStage('login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(`Access Denied: ${result.error}`);
        setIsLoading(false);
      }
    } catch (e) {
      setError(`Connection Error: ${e.message}`);
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return setError("Please fill in all fields.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    
    setIsLoading(true);
    setError("");
    
    const result = await signup(email, password, name);
    if (!result.success) {
      setError(result.error || "Account creation failed.");
      setIsLoading(false);
    }
  };

  const handleSocialAction = async (platform) => {
    setIsLoading(true);
    setError("");
    const result = await socialLogin(platform);
    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 w-full max-w-md mx-auto relative flex flex-col items-center justify-center overflow-hidden px-8">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex bg-obsidian-950/80 backdrop-blur-xl border border-gold-500/10 rounded-full p-1 shadow-2xl">
          {['EN', 'KO', 'KM'].map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setError(""); }}
              className={`w-9 py-1 text-[8px] font-bold tracking-widest transition-all rounded-full ${
                lang === l ? 'bg-gold-500 text-obsidian-950' : 'text-gray-500 hover:text-gray-300'
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="text-center z-10"
          >
            <div className="w-20 h-20 mx-auto mb-6">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
            </div>
            <h1 className="text-lg tracking-[0.4em] font-light text-gray-400 mb-1">THE SEOUL</h1>
            <h1 className="text-xl tracking-[0.4em] font-bold text-gold-500">PRIVATE</h1>
          </motion.div>
        )}

        {(stage === 'login' || stage === 'signup') && (
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full z-10 flex flex-col"
          >
            <div className="mb-8 text-center">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                src={logoImg} alt="Logo" className="w-10 h-10 mx-auto mb-4" 
              />
              <h2 className="text-xl font-serif text-gray-100 tracking-wide">
                {stage === 'login' ? 'Awaiting Access' : 'Create VVIP Account'}
              </h2>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-2 font-medium">
                {stage === 'login' ? 'Secure Medical Portal' : 'Exclusive Membership'}
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-red-200 leading-relaxed font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={stage === 'login' ? handleLogin : handleSignup} className="w-full">
              {stage === 'signup' && (
                <InputField 
                  icon={User} type="text" placeholder="Your Name" label="Full Name" 
                  value={name} onChange={setName}
                />
              )}
              
              <InputField 
                icon={Mail} type="email" placeholder="email@address.com" label="Identification" 
                value={email} onChange={setEmail}
              />
              
              <InputField 
                icon={Lock} type="password" placeholder="••••••••" label="Secure Password" 
                value={password} onChange={setPassword}
              />
              
              {stage === 'signup' && (
                <InputField 
                  icon={Lock} type="password" placeholder="••••••••" label="Confirm Password" 
                  value={confirmPassword} onChange={setConfirmPassword}
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 rounded-xl text-obsidian-950 font-bold tracking-[0.2em] text-[11px] uppercase shadow-2xl shadow-gold-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-obsidian-950/20 border-t-obsidian-950 rounded-full animate-spin" />
                ) : (
                  <>
                    {stage === 'login' ? 'Authenticate' : 'Complete Registration'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center gap-3 w-full mb-6">
                <div className="flex-1 h-px bg-gold-500/10"></div>
                <span className="text-[9px] tracking-widest text-gray-600 uppercase font-bold">VVIP SNS ACCESS</span>
                <div className="flex-1 h-px bg-gold-500/10"></div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={() => handleSocialAction('Google')}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <div className="w-14 h-14 rounded-full border border-gold-500/10 bg-white/5 flex items-center justify-center group-hover:border-gold-500/40 transition-all shadow-xl">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="text-[8px] tracking-[0.2em] text-gray-500 uppercase font-bold">Google</span>
                </button>

                <button 
                  onClick={() => handleSocialAction('Facebook')}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <div className="w-14 h-14 rounded-full border border-gold-500/10 bg-obsidian-800/30 flex items-center justify-center group-hover:border-gold-500/40 transition-all shadow-xl">
                    <svg className="w-6 h-6 fill-gold-500" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-[8px] tracking-[0.2em] text-gray-500 uppercase font-bold">Facebook</span>
                </button>

                <button 
                  onClick={() => handleSocialAction('Telegram')}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <div className="w-14 h-14 rounded-full border border-gold-500/10 bg-obsidian-800/30 flex items-center justify-center group-hover:border-gold-500/40 transition-all shadow-xl">
                    <svg className="w-7 h-7 fill-gold-500 ml-0.5" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <span className="text-[8px] tracking-[0.2em] text-gray-500 uppercase font-bold">Telegram</span>
                </button>
              </div>

              <button
                onClick={() => { setStage(stage === 'login' ? 'signup' : 'login'); setError(""); }}
                className="mt-10 text-[9px] tracking-[0.3em] text-gray-500 hover:text-gold-500 transition-colors uppercase font-medium"
              >
                {stage === 'login' ? (
                  <>Don't have an account? <span className="text-gold-500 font-bold ml-1 border-b border-gold-500/30 pb-0.5">Apply Membership</span></>
                ) : (
                  <>Already a member? <span className="text-gold-500 font-bold ml-1 border-b border-gold-500/30 pb-0.5">Secure Log In</span></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 text-[8px] tracking-[0.4em] text-gray-800 pointer-events-none uppercase font-bold">
        The Seoul Private Protocol v{pkg.version}
      </div>
    </div>
  );
}
