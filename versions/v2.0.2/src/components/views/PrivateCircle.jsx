import { ShieldCheck, MessageSquare, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppData } from '../../contexts/AppDataContext';

export default function PrivateCircle() {
  const { t } = useLanguage();
  const { posts, toggleEndorsement } = useAppData();

  return (
    <div className="pt-12 px-6 pb-20">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-gold-500 mb-1">{t('inner_circle')}</h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase">{t('invite_forum')}</p>
        </div>
        <div className="flex items-center gap-2 bg-obsidian-800 px-3 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span className="text-[10px] tracking-wider text-gray-300 uppercase">{t('verified')}</span>
        </div>
      </header>

      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              layout
              key={post.id} 
              className="bg-obsidian-800/40 border border-white/5 rounded-2xl p-5 backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-obsidian-700 to-obsidian-900 border border-gold-500/30 flex items-center justify-center relative">
                    <span className="font-serif text-xs text-gold-500">{post.author.split('.')[1]}</span>
                    {post.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-obsidian-900 rounded-full p-[2px]">
                        <ShieldCheck className="w-3 h-3 text-gold-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-gray-200">{post.author}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 tracking-widest">{post.tier}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t(post.time)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {t(post.content)}
              </p>

              <div className="flex gap-2 mb-5">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-gold-500/80 bg-gold-500/10 px-2 py-1 rounded-md">{tag}</span>
                ))}
              </div>

              <div className="flex gap-4 border-t border-white/5 pt-4">
                <button 
                  onClick={() => toggleEndorsement(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors relative ${post.isEndorsed ? 'text-gold-500' : 'text-gray-400 hover:text-gold-500'}`}
                >
                  <motion.div
                    animate={post.isEndorsed ? { scale: [1, 1.5, 1], rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <HeartHandshake className={`w-4 h-4 ${post.isEndorsed ? 'fill-gold-500/20' : ''}`} />
                  </motion.div>
                  <span className="relative">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={post.endorsements}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0"
                      >
                        {post.endorsements}
                      </motion.span>
                    </AnimatePresence>
                    <span className="invisible">{post.endorsements}</span> {/* Placeholder for width */}
                  </span>
                  <span className="ml-1">{t('endorsements')}</span>
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('reply')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
