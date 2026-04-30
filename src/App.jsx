import React, { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Core views
import Auth from './components/views/Auth';
import Home from './components/views/Home';
import MedicalArtisans from './components/views/MedicalArtisans';
import Concierge from './components/views/Concierge';

// Non-core views
const Insights = lazy(() => import('./components/views/Insights'));
const PrivateCircle = lazy(() => import('./components/views/PrivateCircle'));
const Diagnosis = lazy(() => import('./components/views/Diagnosis'));

const ViewLoading = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
  </div>
);

function LanguageSelector({ variant = 'default' }) {
  const { lang, setLang } = useLanguage();
  const langs = ['EN', 'KO', 'KH'];
  const isHome = variant === 'home';

  return (
    <div className={isHome ? "" : "absolute top-0 right-0 p-4 z-[100]"}>
      <div className={`relative flex border rounded-full p-1 shadow-inner ${
        isHome ? 'bg-obsidian-800/80 border-white/10 scale-90 origin-right' : 'bg-obsidian-900 border-gold-500/30'
      }`}>
        {langs.map((l) => (
          <button key={l} onClick={() => setLang(l)} className={`relative z-10 ${isHome ? 'w-10' : 'w-12'} py-1 text-[8px] font-bold tracking-widest transition-all duration-300 text-center ${lang === l ? 'text-obsidian-950' : 'text-gray-500'}`}>
            {l}
          </button>
        ))}
        <motion.div className={`absolute top-1 bottom-1 ${isHome ? 'w-10' : 'w-12'} bg-gold-500 rounded-full`} initial={false} animate={{ x: lang === 'EN' ? 0 : lang === 'KO' ? (isHome ? 40 : 48) : (isHome ? 80 : 96) }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
      </div>
    </div>
  );
}

// Internal export for Home to use
export { LanguageSelector };

function MainLayout() {
  const { activeTab, setActiveTab } = useAppData();
  const auth = useAuth();
  const user = auth?.user;

  if (!user) {
    return (
      <div className="bg-obsidian-900 min-h-screen w-full flex justify-center">
        <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen overflow-hidden">
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[8px] px-2 py-0.5 z-[1000] font-black tracking-widest uppercase">
            System v2.0.2 (RECOVERY MODE)
          </div>
          <LanguageSelector />
          <Auth />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'artisans': return <MedicalArtisans />;
      case 'concierge': return <Concierge />;
      case 'insights': return <Suspense fallback={<ViewLoading />}><Insights /></Suspense>;
      case 'circle': return <Suspense fallback={<ViewLoading />}><PrivateCircle /></Suspense>;
      case 'diagnosis': return <Suspense fallback={<ViewLoading />}><Diagnosis /></Suspense>;
      default: return <Home />;
    }
  };

  return (
    <div className="bg-obsidian-900 min-h-screen text-gray-200 w-full flex justify-center">
      <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen shadow-2xl shadow-black overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 bg-gold-600 text-obsidian-950 text-[8px] px-2 py-0.5 z-[1000] font-black tracking-widest uppercase">
          VVIP PLATFORM v2.0.2 (VERIFIED)
        </div>
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="h-full">
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <LanguageProvider>
          <MainLayout />
        </LanguageProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
