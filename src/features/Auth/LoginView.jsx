import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import logoImg from '../../assets/logo.png';

/**
 * 로그인/회원가입 뷰 (v3.0.0 리팩토링)
 * ------------------------------------
 * 사용자 인증을 담당하며, 독립된 모듈로 관리됩니다.
 */
const InputField = React.forwardRef(({ icon: Icon, type, placeholder, label, defaultValue }, ref) => (
  <div className="w-full mb-5">
    <label className="block text-[9px] tracking-[0.2em] text-gold-500/60 uppercase mb-2 ml-1 font-bold">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-4 w-4 text-gold-500/40 group-focus-within:text-gold-500 transition-colors" />
      </div>
      <input
        ref={ref}
        required
        type={type}
        defaultValue={defaultValue}
        className="block w-full pl-11 pr-4 py-3.5 bg-obsidian-800/40 border border-gold-500/20 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/10 transition-all text-base"
        placeholder={placeholder}
      />
    </div>
  </div>
));

export default function LoginView() {
  const { t } = useLanguage();
  const { login, signup, socialLogin } = useAuth();
  
  const [stage, setStage] = useState('intro'); // intro, login, signup
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => setStage('login'), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await login(emailRef.current.value, passwordRef.current.value);
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
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setError("Passwords do not match.");
    }
    
    setIsLoading(true);
    setError("");
    
    const result = await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value);
    if (!result.success) {
      setError(result.error || "Account creation failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 w-full max-w-md mx-auto relative flex flex-col items-center justify-center overflow-hidden px-8">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            className="text-center z-10"
          >
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <img src={logoImg} alt="Logo" className="w-full h-full object-contain mix-blend-screen" />
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
            <div className="mb-8 text-center pt-10">
              <h2 className="text-xl font-serif text-gray-100 tracking-wide">
                {stage === 'login' ? t('login_title') : t('signup_title')}
              </h2>
              <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-2 font-medium">
                {stage === 'login' ? t('login_subtitle') : t('signup_subtitle')}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-200 leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={stage === 'login' ? handleLogin : handleSignup} className="w-full">
              {stage === 'signup' && (
                <InputField ref={nameRef} icon={User} type="text" placeholder={t('name_placeholder')} label={t('name_label')} />
              )}
              <InputField ref={emailRef} icon={Mail} type="email" placeholder="email@address.com" label={t('email_label')} />
              <InputField ref={passwordRef} icon={Lock} type="password" placeholder="••••••••" label={t('password_label')} />
              {stage === 'signup' && (
                <InputField ref={confirmPasswordRef} icon={Lock} type="password" placeholder="••••••••" label={t('confirm_password_label')} />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gold-500 rounded-xl text-obsidian-950 font-bold tracking-[0.2em] text-[11px] uppercase shadow-lg shadow-black/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-obsidian-950/20 border-t-obsidian-950 rounded-full animate-spin" /> : <>{stage === 'login' ? t('btn_authenticate') : t('btn_complete')}<ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>

            <button
              onClick={() => { setStage(stage === 'login' ? 'signup' : 'login'); setError(""); }}
              className="mt-10 text-[9px] tracking-[0.3em] text-gray-500 hover:text-gold-500 transition-colors uppercase font-medium text-center"
            >
              {stage === 'login' ? t('no_account') : t('already_member')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 한글 주석:
 * LoginView는 독립적인 인증 모듈입니다.
 * 애니메이션 효과(framer-motion)를 통해 세련된 전환을 제공하며, 
 * 비제어 컴포넌트(useRef)를 사용하여 입력 지연을 최소화했습니다.
 */
