import { motion } from 'framer-motion';
import { X, ShieldCheck, FileText, ScanFace } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MedicalPassport({ onClose }) {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
    >
      <div className="absolute top-6 right-6">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <motion.div 
        initial={{ y: 50, rotateX: 20 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="w-full max-w-sm"
      >
        <h2 className="text-center font-serif text-2xl text-gold-500 mb-6">{t('passport_title')}</h2>
        
        {/* Apple Wallet Style Digital Card */}
        <div className="w-full aspect-[1.586] rounded-2xl relative overflow-hidden bg-gradient-to-br from-obsidian-800 to-obsidian-900 border border-gold-500/30 shadow-[0_20px_50px_rgba(212,175,55,0.15)] mb-8">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[30px]" />
          
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-12 h-8 bg-gold-500/20 rounded-md border border-gold-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-gold-500" />
              </div>
              <span className="text-[10px] text-gray-400 tracking-widest">{t('passport_id')}</span>
            </div>
            
            <div>
              <p className="text-xs text-gold-500 tracking-widest uppercase mb-1">THE SEOUL PRIVATE</p>
              <h3 className="font-serif text-2xl text-gray-100">{t('madame_kim')}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-2">VVIP • 8839 2049 1102</p>
            </div>
          </div>
        </div>

        {/* Secure Records List */}
        <div>
          <h4 className="text-xs text-gray-400 tracking-widest uppercase mb-4 pl-2">{t('passport_records')}</h4>
          <div className="space-y-3">
            <div className="bg-obsidian-800 border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-gold-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <ScanFace className="w-5 h-5 text-gold-500" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-200">{t('scan_3d')}</h5>
                <p className="text-[10px] text-gray-500 mt-1">Verified via Artisan Clinic</p>
              </div>
            </div>
            
            <div className="bg-obsidian-800 border border-white/5 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:border-gold-500/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-gold-500" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-gray-200">{t('xray_pano')}</h5>
                <p className="text-[10px] text-gray-500 mt-1">Grand Plastic Surgery</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
