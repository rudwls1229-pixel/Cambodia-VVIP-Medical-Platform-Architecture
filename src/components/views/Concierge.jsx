import { useState } from 'react';
import { Plane, Calendar, CheckCircle2, Plus, X, Upload, FileText, Settings, ChevronRight, Wallet, Ticket, MessageCircle, Heart, Gift, Bell, Mail, HelpCircle, Info, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';

export default function Concierge() {
  const { t } = useLanguage();
  const { schedule } = useAppData();
  const [view, setView] = useState('profile'); // profile, bookings, settings
  const [showUpload, setShowUpload] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const confirmedBookings = schedule.filter(item => 
    item.type === 'time_surgery' || item.type === 'time_consult'
  );

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

  return (
    <div className="pt-12 min-h-screen bg-obsidian-900 pb-24">
      <AnimatePresence mode="wait">
        {view === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-6"
          >
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-serif text-white">{t('my_page_title')}</h1>
              <button onClick={() => setView('settings')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <Settings className="w-6 h-6 text-gray-400" />
              </button>
            </header>

            {/* Profile Section */}
            <div className="bg-obsidian-800/50 border border-white/5 rounded-3xl p-6 mb-6">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-full border-2 border-gold-500/30 p-1">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" 
                    className="w-full h-full rounded-full object-cover" 
                    alt="Avatar" 
                  />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white mb-1">{t('madame_kim')}</h2>
                  <span className="text-[10px] font-bold bg-gold-500 text-obsidian-900 px-2 py-0.5 rounded tracking-widest uppercase">{t('my_level')}</span>
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

            {/* Beta Banner */}
            <div className="bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/20 rounded-2xl p-5 mb-8 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-500">
                  <Search size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-300 font-medium">나와 비슷한 사람은 어떻게 변했을까?</p>
                  <p className="text-sm text-gold-500 font-bold">내 사진으로 찾아보기 <span className="ml-2 text-[10px] bg-gold-500/20 px-1.5 py-0.5 rounded uppercase font-mono">BETA</span></p>
                </div>
              </div>
            </div>

            {/* Main Menu List */}
            <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-2 mb-8">
              <MenuButton icon={Calendar} label={t('my_bookings_pay')} onClick={() => setView('bookings')} />
              <MenuButton icon={Heart} label={t('my_liked')} />
              <MenuButton icon={Gift} label={t('my_benefits')} />
              <MenuButton icon={Bell} label={t('my_notif')} badge="1" />
              <MenuButton icon={Mail} label={t('my_msgs')} />
            </div>

            {/* Sub Menu List */}
            <div className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-4">
              <button className="w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors">{t('cust_center')}</button>
              <button className="w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors">{t('notice')}</button>
              <button className="w-full text-left py-2 text-sm text-gray-400 hover:text-white transition-colors">시술 전후 사진</button>
            </div>
          </motion.div>
        )}

        {view === 'bookings' && (
          <motion.div 
            key="bookings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <header className="flex items-center gap-4 mb-10">
              <button onClick={() => setView('profile')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
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
                      <div className="bg-gold-500/10 text-gold-500 text-[10px] px-2 py-1 rounded border border-gold-500/30 font-bold uppercase tracking-wider">VERIFIED</div>
                    </div>

                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                        <Calendar className="w-6 h-6 text-gold-500" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-gray-100">{booking.detail}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                          <span className="text-xs text-gold-500/80">{t('confirmed_res')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-obsidian-900/50 rounded-xl p-5 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">항공권 업로드</h4>
                          <p className="text-[10px] text-gray-500 mt-0.5">공항 픽업 및 예약을 위해 필요합니다</p>
                        </div>
                        {!isUploaded ? (
                          <button onClick={() => setShowUpload(true)} className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900"><Plus size={20} /></button>
                        ) : (
                          <div className="flex items-center gap-2 text-gold-500"><FileText size={20} /><span className="text-xs font-bold uppercase tracking-tighter">Uploaded</span></div>
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

        {view === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-6"
          >
            <header className="flex items-center gap-4 mb-10">
              <button onClick={() => setView('profile')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <h1 className="text-2xl font-serif text-white">{t('settings_title')}</h1>
            </header>

            <div className="space-y-6">
              <section className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest">Account</h3>
                <button className="w-full text-left text-sm text-gray-200 flex justify-between items-center">개인정보 보호 <ChevronRight size={14} /></button>
                <button className="w-full text-left text-sm text-gray-200 flex justify-between items-center">로그인 보안 <ChevronRight size={14} /></button>
              </section>

              <section className="bg-obsidian-800/30 border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="text-xs text-gray-500 uppercase tracking-widest">App Settings</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-200">푸시 알림</span>
                  <div className="w-10 h-5 bg-gold-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-200">다크 모드</span>
                  <div className="w-10 h-5 bg-gold-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal (Existing) */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-sm bg-obsidian-800 border border-gold-500/30 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20"><Upload size={40} className="text-gold-500" /></div>
              <h2 className="text-2xl font-serif text-gold-500 mb-2">항공권 업로드</h2>
              <div onClick={() => { setIsUploaded(true); setShowUpload(false); }} className="border-2 border-dashed border-white/10 rounded-2xl p-10 mb-8 cursor-pointer hover:border-gold-500/50 transition-colors group"><Plus className="w-8 h-8 text-gray-600 mx-auto group-hover:text-gold-500 transition-colors" /><p className="text-xs text-gray-500 mt-2">Select Image or PDF</p></div>
              <button onClick={() => setShowUpload(false)} className="w-full py-4 text-gray-500 hover:text-white transition-colors uppercase text-xs tracking-widest">Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
