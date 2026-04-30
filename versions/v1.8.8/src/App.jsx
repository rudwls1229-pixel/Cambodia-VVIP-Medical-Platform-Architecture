import React, { useState, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { useAuth } from './contexts/AuthContext';

// Lazy load views for better performance and mobile compatibility
const Auth = lazy(() => import('./components/views/Auth'));
const Home = lazy(() => import('./components/views/Home'));
const Insights = lazy(() => import('./components/views/Insights'));
const PrivateCircle = lazy(() => import('./components/views/PrivateCircle'));
const MedicalArtisans = lazy(() => import('./components/views/MedicalArtisans'));
const Concierge = lazy(() => import('./components/views/Concierge'));
const Diagnosis = lazy(() => import('./components/views/Diagnosis'));

// Loading fallback component
const ViewLoading = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
  </div>
);

function GlobalHeader() {
  const { lang, setLang } = useLanguage();
  const langs = ['EN', 'KO', 'KH'];

  return (
    <div className="absolute top-0 right-0 p-4 z-[100]">
      <div className="relative flex bg-obsidian-900 border border-gold-500/30 rounded-full p-1 shadow-lg shadow-gold-500/5">
        {langs.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`relative z-10 w-12 py-1 text-[10px] font-medium tracking-widest transition-colors duration-300 text-center ${
              lang === l ? 'text-obsidian-900' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {l}
          </button>
        ))}
        {/* Sliding Indicator */}
        <motion.div
          className="absolute top-1 bottom-1 w-12 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          initial={false}
          animate={{
            x: lang === 'EN' ? 0 : lang === 'KO' ? 48 : 96,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}

function MainLayout() {
  const { activeTab, setActiveTab } = useAppData();
  const { user } = useAuth();

  if (!user) {
    return (
      <Suspense fallback={<ViewLoading />}>
        <Auth />
      </Suspense>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'insights':
        return <Insights />;
      case 'circle':
        return <PrivateCircle />;
      case 'artisans':
        return <MedicalArtisans />;
      case 'concierge':
        return <Concierge />;
      case 'diagnosis':
        return <Diagnosis />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="bg-obsidian-900 min-h-screen text-gray-200 w-full flex justify-center">
      {/* Mobile Web View Constraint */}
      <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen shadow-2xl shadow-black overflow-hidden flex flex-col">
        
        <GlobalHeader />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Suspense fallback={<ViewLoading />}>
                {renderContent()}
              </Suspense>
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
    <AppDataProvider>
      <LanguageProvider>
        <MainLayout />
      </LanguageProvider>
    </AppDataProvider>
  );
}
