import { Home, BookOpen, Users, Stethoscope, CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAppData } from '../contexts/AppDataContext';

export default function Navigation() {
  const { t } = useLanguage();
  const { activeTab, setActiveTab } = useAppData();
  
  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'insights', icon: BookOpen, label: t('insights') },
    { id: 'circle', icon: Users, label: t('circle') },
    { id: 'artisans', icon: Stethoscope, label: t('artisans') },
    { id: 'concierge', icon: CalendarCheck, label: t('my_bookings') },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto bg-obsidian-800/90 backdrop-blur-lg border-t border-gold-500/20 px-4 py-3 pb-safe z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-14 h-12"
            >
              <Icon 
                size={22} 
                className={`transition-colors duration-300 ${isActive ? 'text-gold-500' : 'text-gray-500 hover:text-gray-400'}`} 
              />
              <span className={`text-[10px] mt-1 font-medium transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-gold-500' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-3 w-10 h-[2px] bg-gold-500 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
