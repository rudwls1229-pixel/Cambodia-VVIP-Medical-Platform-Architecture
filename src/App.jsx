import React, { lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Common Components
import GlobalHeader from './components/common/GlobalHeader';
import ErrorOverlay from './components/common/ErrorOverlay';

// Refactored Feature Views (V3.0.0 Modular)
import LoginView from './features/Auth/LoginView';
import HomeView from './features/Home/HomeView';
import MedicalArtisans from './components/views/MedicalArtisans';
import Concierge from './components/views/Concierge';

// Non-core views (Lazy)
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
  const { user, loading, error } = useAuth();
  const { theme } = useTheme();

  // 1. 방어적 코딩: 시스템 에러나 데이터 로드 실패 시 비상 화면 노출
  if (error) {
    return <ErrorOverlay message={error} />;
  }

  // 2. 초기 세션 로딩 상태 처리
  if (loading) {
    return (
      <div className={`${theme === 'dark' ? 'bg-obsidian-900' : 'bg-white'} min-h-screen w-full flex items-center justify-center`}>
        <ViewLoading />
      </div>
    );
  }

  // 3. 인증 상태에 따른 뷰 분기
  if (!user) {
    return (
      <div className={`${theme === 'dark' ? 'bg-obsidian-900' : 'bg-white'} min-h-screen w-full flex justify-center transition-colors duration-500`}>
        <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-obsidian-900' : 'bg-white'} relative min-h-screen overflow-hidden`}>
          <GlobalHeader theme={theme} />
          <LoginView />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'artisans': return <MedicalArtisans />;
      case 'concierge': return <Concierge />;
      case 'insights': return <Suspense fallback={<ViewLoading />}><Insights /></Suspense>;
      case 'circle': return <Suspense fallback={<ViewLoading />}><PrivateCircle /></Suspense>;
      case 'diagnosis': return <Suspense fallback={<ViewLoading />}><Diagnosis /></Suspense>;
      default: return <HomeView />;
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-obsidian-900' : 'bg-white'} min-h-screen text-gray-200 w-full flex justify-center transition-colors duration-500`}>
      <div className={`w-full max-w-md ${theme === 'dark' ? 'bg-obsidian-900' : 'bg-white'} relative min-h-screen shadow-2xl overflow-hidden flex flex-col`}>
        {/* 모든 페이지에서 공유되는 글로벌 헤더 */}
        <GlobalHeader theme={theme} />
        
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
  return <MainLayout />;
}
