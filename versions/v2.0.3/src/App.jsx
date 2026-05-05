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

// Global Language Selector for all pages
function GlobalLanguageSelector() {
  const { lang, setLang } = useLanguage();
  const langs = ['EN', 'KO', 'KH'];

  return (
    <div className="absolute top-0 right-0 p-4 z-[2000]">
      <div className="relative flex bg-obsidian-900/80 backdrop-blur-md border border-gold-500/30 rounded-full p-1 shadow-lg shadow-black/50 scale-90 origin-right">
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

function MainLayout() {
  const { activeTab, setActiveTab } = useAppData();
  const { user, loading } = useAuth();

  // 1. Loading state to prevent flickering or skipping Auth
  if (loading) {
    return (
      <div className="bg-obsidian-900 min-h-screen w-full flex items-center justify-center">
        <ViewLoading />
      </div>
    );
  }

  // 2. Strict Auth Check
  if (!user) {
    return (
      <div className="bg-obsidian-900 min-h-screen w-full flex justify-center">
        <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen overflow-hidden">
          <GlobalLanguageSelector />
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
        {/* Global Language Selector shared across all logged-in views */}
        <GlobalLanguageSelector />
        
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="h-full"
            >
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
