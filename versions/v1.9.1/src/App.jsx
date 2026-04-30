import React, { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LanguageSelector from './components/common/LanguageSelector';

// Static imports for CORE views to prevent navigation white-screen issues
import Auth from './components/views/Auth';
import Home from './components/views/Home';
import MedicalArtisans from './components/views/MedicalArtisans';
import Concierge from './components/views/Concierge';

// Lazy load non-critical views
const Insights = lazy(() => import('./components/views/Insights'));
const PrivateCircle = lazy(() => import('./components/views/PrivateCircle'));
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
      // Lazy views wrapped in Suspense individually or collectively
      case 'insights': 
        return <Suspense fallback={<ViewLoading />}><Insights /></Suspense>;
      case 'circle': 
        return <Suspense fallback={<ViewLoading />}><PrivateCircle /></Suspense>;
      case 'diagnosis': 
        return <Suspense fallback={<ViewLoading />}><Diagnosis /></Suspense>;
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
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
