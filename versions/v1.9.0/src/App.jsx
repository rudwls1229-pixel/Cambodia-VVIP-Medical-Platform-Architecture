import React, { useState, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LanguageSelector from './components/common/LanguageSelector';

// Lazy load views for high performance
const Auth = lazy(() => import('./components/views/Auth'));
const Home = lazy(() => import('./components/views/Home'));
const Insights = lazy(() => import('./components/views/Insights'));
const PrivateCircle = lazy(() => import('./components/views/PrivateCircle'));
const MedicalArtisans = lazy(() => import('./components/views/MedicalArtisans'));
const Concierge = lazy(() => import('./components/views/Concierge'));
const Diagnosis = lazy(() => import('./components/views/Diagnosis'));

const ViewLoading = () => (
  <div className="flex items-center justify-center h-full min-h-[60vh]">
    <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
  </div>
);

function MainLayout() {
  const { activeTab, setActiveTab } = useAppData();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-obsidian-900 min-h-screen w-full flex justify-center">
        <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen overflow-hidden">
          <LanguageSelector />
          <Suspense fallback={<ViewLoading />}>
            <Auth />
          </Suspense>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'insights': return <Insights />;
      case 'circle': return <PrivateCircle />;
      case 'artisans': return <MedicalArtisans />;
      case 'concierge': return <Concierge />;
      case 'diagnosis': return <Diagnosis />;
      default: return <Home />;
    }
  };

  return (
    <div className="bg-obsidian-900 min-h-screen text-gray-200 w-full flex justify-center">
      <div className="w-full max-w-md bg-obsidian-900 relative min-h-screen shadow-2xl shadow-black overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
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
    <AuthProvider>
      <AppDataProvider>
        <LanguageProvider>
          <MainLayout />
        </LanguageProvider>
      </AppDataProvider>
    </AuthProvider>
  );
}
