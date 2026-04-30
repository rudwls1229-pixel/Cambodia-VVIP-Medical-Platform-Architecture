import { useState, useRef, useEffect } from 'react';
import { Plane, Calendar, CheckCircle2, Plus, X, Upload, FileText, Settings, ChevronRight, Wallet, Ticket, MessageCircle, Heart, Gift, Bell, Mail, HelpCircle, Info, Search, ArrowLeft, LogOut, UserMinus, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';

// Default avatar
import defaultAvatar from '../../assets/default_profile.png';

export default function Concierge() {
  const { t } = useLanguage();
  const { 
    schedule, userProfile, setUserProfile, toggleFlightTicket, 
    activeMyPageView, setActiveMyPageView, 
    flightNoticeTrigger, setFlightNoticeTrigger,
    updateBookingStatus
  } = useAppData();
  
  const [showUpload, setShowUpload] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  const fileInputRef = useRef(null);

  const confirmedBookings = schedule.filter(item => 
    item.type === 'time_surgery' || item.type === 'time_consult'
  );

  useEffect(() => {
    if (flightNoticeTrigger) {
      // Find the latest booking that needs flight ticket
      const latest = confirmedBookings.find(b => !b.isUploaded);
      if (latest) {
        setSelectedBookingId(latest.id);
        setShowUpload(true);
      }
      setFlightNoticeTrigger(false);
    }
  }, [flightNoticeTrigger]);

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const cycleStatus = (id, currentStatus) => {
    const states = ['st_pending', 'st_reviewing', 'st_approved'];
    const nextIdx = (states.indexOf(currentStatus) + 1) % states.length;
    updateBookingStatus(id, states[nextIdx]);
  };

  const StatusBadge = ({ statusKey, onClick }) => {
    const config = {
      st_pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
      st_reviewing: { icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
      st_approved: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
    };
    const cfg = config[statusKey] || config.st_pending;
    const Icon = cfg.icon;

    return (
      <button 
        onClick={onClick}
        className={`flex items-center gap-1.5 px-2 py-1 rounded border ${cfg.bg} ${cfg.color} ${cfg.border} transition-all active:scale-95`}
      >
        <Icon size={10} />
        <span className="text-[9px] font-bold uppercase tracking-wider">{t(statusKey)}</span>
      </button>
    );
  };

  const MenuButton = ({ icon: Icon, label, badge, onClick }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 group"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-obsidian-800 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-gold-500 group-hover:border-gold-500/30 transition-all">
          <Icon size={20} />
        </div>
        <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-1.5 py-0.5 rounded bg-gold-500 text-obsidian-900 text-[10px] font-bold">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="text-gray-600 group-hover:text-gold-500 transition-colors" />
      </div>
    </button>
  );

  const SettingsRow = ({ label, value, hasArrow = true, isSwitch = false }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 cursor-pointer group">
      <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{label}</span>
      <div className="flex items-center gap-3">
        {value && <span className="text-xs text-gray-500 font-mono">{value}</span>}
        {isSwitch ? (
          <div className="w-10 h-5 bg-gold-500 rounded-full relative">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        ) : hasArrow && (
          <ChevronRight size={16} className="text-gray-600 group-hover:text-gold-500 transition-colors" />
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-24 min-h-screen bg-obsidian-900 pb-24 relative overflow-x-hidden">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <AnimatePresence mode="wait">
        {activeMyPageView === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-serif text-white">{t('my_page_title')}</h1>
              <button onClick={() => setActiveMyPageView('settings')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <Settings className="w-6 h-6 text-gray-400" />
              </button>
            </header>

            <div className="bg-obsidian-800/50 border border-white/5 rounded-3xl p-6 mb-8">
              <div className="flex items-center gap-5 mb-8">
                <div 
                  onClick={handleProfileClick}
                  className="w-20 h-20 rounded-full border-2 border-gold-500/30 p-1 cursor-pointer relative group"
                >
                  <img 
                    src={userProfile.avatar} 
                    className="w-full h-full rounded-full object-cover transition-opacity group-hover:opacity-60" 
                    alt="Avatar" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-6 h-6 text-gold-500" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">{userProfile.name}</h2>
                  <span className="text-[10px] font-bold bg-gold-500 text-obsidian-900 px-2 py-0.5 rounded tracking-widest uppercase">{userProfile.level}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-6 border-t border-white/5">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">{t('my_points')}</p>
                  <p className="text-lg font-serif text-gold-500">25,000 P</p>
                </div>
                <div className="text-center border-x border-white/5">
                  <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">{t('my_coupons')}</p>
                  <p className="text-lg font-serif text-gold-500">3</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest">{t('my_inquiries')}</p>
                  <p className="text-lg font-serif text-gold-500">1</p>
                </div>
              </div>
            </div>

            <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-2 mb-8">
              <MenuButton icon={Calendar} label={t('my_bookings_pay')} onClick={() => setActiveMyPageView('bookings')} />
              <MenuButton icon={Heart} label={t('my_liked')} />
              <MenuButton icon={Gift} label={t('my_benefits')} />
              <MenuButton icon={Bell} label={t('my_notif')} badge="1" />
              <MenuButton icon={Mail} label={t('my_msgs')} />
            </div>

            <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-4">
              <button className="w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors">{t('cust_center')}</button>
              <button className="w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors">{t('notice')}</button>
            </div>
          </motion.div>
        )}

        {activeMyPageView === 'bookings' && (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <header className="flex items-center gap-4 mb-10">
              <button onClick={() => setActiveMyPageView('profile')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <h1 className="text-2xl font-serif text-white">{t('my_bookings_pay')}</h1>
            </header>

            <div className="space-y-6">
              {confirmedBookings.length > 0 ? (
                confirmedBookings.map((booking, index) => (
                  <motion.div 
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-obsidian-800/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3">
                      <StatusBadge 
                        statusKey={booking.statusLabel || 'st_pending'} 
                        onClick={() => cycleStatus(booking.id, booking.statusLabel || 'st_pending')}
                      />
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                        <Calendar className="w-6 h-6 text-gold-500" />
                      </div>
                      <div className="pr-12">
                        <h3 className="font-serif text-lg text-gray-100">{t(booking.detail) || booking.detail}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                          <span className="text-xs text-gold-500/80">{t('confirmed_res')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-obsidian-900/50 rounded-xl p-5 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">{t('flight_upload_title')}</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">{t('flight_upload_sub')}</p>
                        </div>
                        {!booking.isUploaded ? (
                          <button 
                            onClick={() => {
                              setSelectedBookingId(booking.id);
                              setShowUpload(true);
                            }} 
                            className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-110 transition-transform"
                          >
                            <Plus size={20} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-gold-500">
                            <FileText size={20} />
                            <span className="text-xs font-bold uppercase tracking-tighter">Uploaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 opacity-40">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">{t('no_bookings')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeMyPageView === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6"
          >
            <header className="flex items-center gap-4 mb-10">
              <button onClick={() => setActiveMyPageView('profile')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <h1 className="text-2xl font-serif text-white">{t('settings_title')}</h1>
            </header>

            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-gray-100 mb-4 px-2">{t('service_info')}</h3>
                <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6">
                  <SettingsRow label={t('version_info')} value="v 1.8.3 Optimized" hasArrow={false} />
                  <SettingsRow label={t('partnership')} />
                  <SettingsRow label={t('terms')} />
                  <SettingsRow label={t('privacy')} />
                  <SettingsRow label={t('location_terms')} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-100 mb-4 px-2">{t('notif_settings')}</h3>
                <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6">
                  <SettingsRow label={t('gen_notif')} isSwitch={true} />
                  <SettingsRow label={t('notes_notif')} isSwitch={true} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-100 mb-4 px-2">{t('marketing_info')}</h3>
                <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6">
                  <SettingsRow label={t('push')} isSwitch={true} />
                  <SettingsRow label="SMS" isSwitch={true} />
                  <SettingsRow label="Email" isSwitch={true} />
                  <SettingsRow label={t('night_push')} isSwitch={true} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-gray-100 mb-4 px-2">{t('acc_mgmt')}</h3>
                <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6">
                  <button className="w-full flex items-center justify-between py-4 text-sm text-gray-200 hover:text-white group">
                    <span>{t('logout')}</span>
                    <LogOut size={16} className="text-gray-600 group-hover:text-gold-500" />
                  </button>
                  <button className="w-full flex items-center justify-between py-4 text-sm text-gray-200 hover:text-white group border-t border-white/5">
                    <span>{t('delete_acc')}</span>
                    <UserMinus size={16} className="text-gray-600 group-hover:text-red-500" />
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal / Flight Ticket Notice */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm bg-obsidian-800 border border-gold-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20 shadow-inner">
                <Plane size={40} className="text-gold-500" />
              </div>
              <h2 className="text-2xl font-serif text-gold-500 mb-2">{t('flight_upload_title')}</h2>
              <p className="text-xs text-gray-400 mb-8 italic">{t('msg_upload_flight')}</p>
              
              <div 
                onClick={() => {
                  if (selectedBookingId) {
                    toggleFlightTicket(selectedBookingId);
                  }
                  setShowUpload(false);
                }} 
                className="border-2 border-dashed border-gold-500/10 rounded-2xl p-10 mb-8 cursor-pointer hover:border-gold-500/50 transition-all group bg-gold-500/5"
              >
                <Upload className="w-8 h-8 text-gold-500/40 mx-auto group-hover:text-gold-500 transition-colors" />
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Tap to Upload</p>
              </div>
              
              <button onClick={() => setShowUpload(false)} className="w-full py-4 text-gray-500 hover:text-white transition-colors uppercase text-[10px] tracking-[0.3em] font-bold">
                {t('pol_edit')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
