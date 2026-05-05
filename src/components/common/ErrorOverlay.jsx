import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Send, QrCode } from 'lucide-react';

/**
 * 비상 안내 오버레이 (v3.0.0)
 * ----------------------------
 * 시스템 장애나 오프라인 상태에서 VVIP 고객을 컨시어지로 유도합니다.
 * 다국어 지원 및 QR코드/텔레그램 링크를 제공합니다.
 */
export default function ErrorOverlay({ message }) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[9999] bg-obsidian-950 flex flex-col items-center justify-center p-8 text-center">
      {/* Gold animated aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-[100px] animate-pulse" />
      
      <div className="relative z-10 w-full max-w-xs">
        <div className="w-20 h-20 bg-gold-500/10 border border-gold-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <Send className="w-10 h-10 text-gold-500" />
        </div>

        <h2 className="text-xl font-serif text-white mb-4 leading-tight">
          {message || t('error_maintenance_title')}
        </h2>
        
        <p className="text-[11px] text-gray-500 mb-10 leading-relaxed font-medium tracking-wide">
          {t('error_maintenance_desc')}
        </p>

        {/* Telegram Direct Link */}
        <button 
          onClick={() => window.open('https://t.me/TheSeoulPrivate', '_blank')}
          className="w-full py-4 bg-gold-500 rounded-2xl text-obsidian-950 font-black tracking-widest text-[10px] uppercase shadow-lg shadow-gold-500/10 active:scale-95 transition-all mb-6"
        >
          {t('btn_telegram_concierge')}
        </button>

        {/* QR Code Section */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-white p-2 rounded-xl shadow-inner">
            {/* Simulation of a real QR */}
            <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://t.me/TheSeoulPrivate')] bg-cover" />
          </div>
          <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <QrCode size={12} className="text-gold-500" />
            Scan for Emergency
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 한글 주석:
 * ErrorOverlay는 앱의 최후 보루입니다.
 * 에러 발생 시 고객이 당황하지 않도록 텔레그램 상담원에게 즉시 연결할 수 있는 수단(버튼, QR)을 제공합니다.
 * 모든 문구는 사용자가 선택한 언어에 맞춰 번역되어 노출됩니다.
 */
