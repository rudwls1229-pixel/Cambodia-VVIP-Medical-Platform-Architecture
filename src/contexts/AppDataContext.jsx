import { createContext, useContext, useState } from 'react';
import defaultAvatar from '../assets/default_profile.png';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  // Global Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [activeFilter, setActiveFilter] = useState('cat_all');

  // Global User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Madame Kim',
    avatar: defaultAvatar,
    level: 'Lv.1'
  });

  // Global Itinerary State
  const [schedule, setSchedule] = useState([
    { id: 't1', type: 'time_arrive', status: 'completed', time: '10:00 AM', detail: 'ICN Terminal 2' },
    { id: 't2', type: 'time_consult', status: 'current', time: '2:30 PM', detail: 'dr_lee_clinic' },
    { id: 't3', type: 'time_surgery', status: 'upcoming', time: '4:00 PM', detail: 'signature_lift' },
    { id: 't4', type: 'time_recover', status: 'upcoming', time: 'Tomorrow', detail: 'VIP Suite A' }
  ]);

  // Global Posts State for Endorsements
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "VVIP.883",
      tier: "BLACK",
      verified: true,
      time: 'post_time_1',
      content: 'post_content_1',
      tags: ["#SignatureContour", "#DrChoi"],
      endorsements: 12,
      isEndorsed: false
    },
    {
      id: 2,
      author: "VVIP.102",
      tier: "DIAMOND",
      verified: true,
      time: 'post_time_2',
      content: 'post_content_2',
      tags: ["#Exosome", "#ArtisanClinic"],
      endorsements: 4,
      isEndorsed: false
    }
  ]);

  // Actions
  const addScheduleItem = (artisanNameKey) => {
    // For MVP timeline demo, we just add an extra step
    setSchedule(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'time_consult', 
        status: 'upcoming',
        time: 'TBD',
        detail: artisanNameKey
      }
    ]);
  };

  const toggleEndorsement = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          endorsements: post.isEndorsed ? post.endorsements - 1 : post.endorsements + 1,
          isEndorsed: !post.isEndorsed
        };
      }
      return post;
    }));
  };

  return (
    <AppDataContext.Provider value={{ 
      activeTab, setActiveTab,
      activeFilter, setActiveFilter,
      userProfile, setUserProfile,
      schedule, addScheduleItem, 
      posts, toggleEndorsement 
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
