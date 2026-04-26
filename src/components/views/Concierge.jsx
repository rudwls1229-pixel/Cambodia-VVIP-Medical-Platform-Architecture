import { useState } from 'react';
import { Plane, Calendar, CheckCircle2, Plus, X, Upload, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';

export default function Concierge() {
  const { t } = useLanguage();
  const { schedule } = useAppData();
  const [showUpload, setShowUpload] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  // Filter only confirmed or specific procedure-related items for this view
  const confirmedBookings = schedule.filter(item => 
    item.type === 'time_surgery' || item.type === 'time_consult'
  );

  return (
    <div className="pt-12 px-6 pb-24 min-h-screen bg-obsidian-900">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-serif text-gold-500 mb-2">{t('my_bookings_title')}</h1>
        <p className="text-sm text-gray-400 tracking-widest uppercase">{t('my_bookings_sub')}</p>
      </header>

      <div className="space-y-6">
        {confirmedBookings.length > 0 ? (
          confirmedBookings.map((booking, index) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-obsidian-800/60 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-gold-500/10 text-gold-500 text-[10px] px-2 py-1 rounded border border-gold-500/30 font-bold uppercase tracking-wider">
                  {t('verified')}
                </div>
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

              {/* Ticket Upload Section */}
              <div className="bg-obsidian-900/50 rounded-xl p-5 border border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-200">{t('upload_ticket')}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{t('upload_ticket_sub')}</p>
                  </div>
                  
                  {!isUploaded ? (
                    <button 
                      onClick={() => setShowUpload(true)}
                      className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-obsidian-900 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-110 transition-transform"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-gold-500">
                      <FileText className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Uploaded</span>
                    </div>
                  )}
                </div>

                {isUploaded && (
                  <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gold-500/10 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-gold-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Flight No.</p>
                      <p className="text-xs text-gray-100 font-mono">KE651 (ICN → PNH)</p>
                    </div>
                  </div>
                )}
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

      {/* Mock Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-obsidian-800 border border-gold-500/30 rounded-3xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20">
                <Upload className="w-10 h-10 text-gold-500" />
              </div>
              <h2 className="text-2xl font-serif text-gold-500 mb-2">{t('upload_ticket')}</h2>
              <p className="text-sm text-gray-400 mb-8">{t('upload_ticket_sub')}</p>
              
              <div 
                onClick={() => {
                  setIsUploaded(true);
                  setShowUpload(false);
                }}
                className="border-2 border-dashed border-white/10 rounded-2xl p-10 mb-8 cursor-pointer hover:border-gold-500/50 transition-colors group"
              >
                <Plus className="w-8 h-8 text-gray-600 mx-auto group-hover:text-gold-500 transition-colors" />
                <p className="text-xs text-gray-500 mt-2">Select Image or PDF</p>
              </div>

              <button 
                onClick={() => setShowUpload(false)}
                className="w-full py-4 text-gray-500 hover:text-white transition-colors uppercase text-xs tracking-widest"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
