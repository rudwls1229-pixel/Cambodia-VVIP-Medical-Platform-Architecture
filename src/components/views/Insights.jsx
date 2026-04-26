import { useRef, useState, useEffect } from 'react';
import { BookMarked, ChevronRight, GripVertical, ArrowLeft, Share2, Heart, Clock, User } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

// Import premium generated assets
import harmonyHero from '../../assets/harmony_hero.png';
import exosomesHero from '../../assets/exosomes_hero.png';
import recoveryHero from '../../assets/recovery_hero.png';

function ParallaxArticle({ article, isFeatured, onClick }) {
  if (isFeatured) {
    return (
      <article 
        onClick={() => onClick(article)}
        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer border border-white/5"
      >
        <img 
          src={article.image} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent" />
        
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-obsidian-900/80 backdrop-blur-md flex items-center justify-center border border-gold-500/30">
          <BookMarked className="w-4 h-4 text-gold-500" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="text-xs text-gold-500 tracking-widest font-semibold mb-3 block uppercase">{article.category}</span>
          <h2 className="text-2xl font-serif leading-tight mb-4">{article.title}</h2>
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span className="font-medium">{article.author}</span>
            <span className="text-xs text-gray-500">{article.readTime}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      onClick={() => onClick(article)}
      className="flex gap-4 group cursor-pointer items-center border-b border-white/5 pb-6 overflow-hidden"
    >
      <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden relative">
        <img 
          src={article.image} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
        />
      </div>
      <div className="flex-1">
        <span className="text-[10px] text-gold-500 tracking-widest uppercase block mb-1">{article.category}</span>
        <h3 className="font-serif text-lg leading-tight mb-2 group-hover:text-gold-500 transition-colors">{article.title}</h3>
        <span className="text-xs text-gray-400 block">{article.author}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gold-500 transition-colors shrink-0" />
    </article>
  );
}

function BeforeAfterSlider() {
  const { t } = useLanguage();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleDrag = (e, info) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  return (
    <section className="mt-12 pt-10 border-t border-white/10">
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-serif text-gold-500 mb-2">{t('ba_title')}</h2>
        <p className="text-xs text-gray-400 tracking-widest uppercase">{t('ba_sub')}</p>
      </header>

      <div 
        ref={containerRef}
        className="relative w-full aspect-square rounded-2xl overflow-hidden touch-none select-none border border-gold-500/20"
      >
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
            alt="Before" 
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 contrast-125"
          />
        </div>

        <motion.div 
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-gold-500 cursor-ew-resize z-10 flex items-center justify-center -translate-x-1/2"
        >
          <div className="w-8 h-8 rounded-full bg-obsidian-900 border-2 border-gold-500 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <GripVertical className="w-4 h-4 text-gold-500" />
          </div>
        </motion.div>
        
        <div className="absolute bottom-4 left-4 text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm tracking-widest uppercase pointer-events-none">Before</div>
        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm tracking-widest uppercase pointer-events-none">After</div>
      </div>
    </section>
  );
}

export default function Insights() {
  const { t, lang } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 1,
      category: t('insight_cat_1'),
      title: t('insight_title_1'),
      author: t('insight_author_1'),
      image: harmonyHero,
      readTime: t('read_time_5'),
      content: lang === 'KO' 
        ? "진정한 아름다움은 완벽한 대칭이 아닌, 각 부위의 조화로운 비율에서 탄생합니다. 얼굴의 황금비를 이해하는 것은 현대 메디컬 아티스트리의 핵심입니다..."
        : "True beauty is not born from perfect symmetry, but from the harmonious proportions of each part. Understanding the golden ratio of the face is the core of modern medical artistry..."
    },
    {
      id: 2,
      category: t('insight_cat_2'),
      title: t('insight_title_2'),
      author: t('insight_author_2'),
      image: exosomesHero,
      readTime: t('read_time_8'),
      content: lang === 'KO'
        ? "엑소좀 테라피는 세포 간 신호 전달 물질을 통해 노화된 세포를 깨우는 차세대 재생 의학입니다. 피부 본연의 힘을 되찾아주는 혁신적인 기술을 소개합니다..."
        : "Exosome therapy is next-generation regenerative medicine that awakens aged cells through intercellular signaling substances. Introducing the innovative technology that restores the skin's natural strength..."
    },
    {
      id: 3,
      category: t('insight_cat_3'),
      title: t('insight_title_3'),
      author: t('insight_author_3'),
      image: recoveryHero,
      readTime: t('read_time_4'),
      content: lang === 'KO'
        ? "시술만큼 중요한 것이 바로 회복입니다. 서울 프라이빗이 제공하는 프레지덴셜 스위트에서의 완벽한 휴식과 전문 의료진의 집중 케어 시스템을 경험해 보세요..."
        : "Recovery is just as important as the procedure itself. Experience perfect relaxation in the Presidential Suite provided by The Seoul Private and the intensive care system of professional medical staff..."
    }
  ];

  useEffect(() => {
    if (selectedArticle) window.scrollTo(0, 0);
  }, [selectedArticle]);

  return (
    <div className="pt-24 px-6 pb-24 min-h-screen bg-obsidian-900 relative">
      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="mb-10 text-center">
              <h1 className="text-3xl font-serif text-gold-500 mb-2">{t('med_art')}</h1>
              <p className="text-sm text-gray-400 tracking-widest uppercase">{t('curated_col')}</p>
            </header>

            <div className="space-y-8">
              <ParallaxArticle article={articles[0]} isFeatured={true} onClick={setSelectedArticle} />
              <div className="space-y-6">
                {articles.slice(1).map((article) => (
                  <ParallaxArticle key={article.id} article={article} isFeatured={false} onClick={setSelectedArticle} />
                ))}
              </div>
              <BeforeAfterSlider />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[60] bg-obsidian-900 overflow-y-auto scrollbar-hide"
          >
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
              <button onClick={() => setSelectedArticle(null)} className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <button className="w-10 h-10 rounded-full bg-obsidian-900/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Hero */}
            <div className="relative w-full aspect-[4/5]">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/20 to-transparent" />
            </div>

            {/* Content Body */}
            <div className="px-6 -mt-32 relative z-10 pb-20">
              <div className="bg-obsidian-800/80 border border-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl">
                <span className="text-xs text-gold-500 tracking-[0.3em] font-bold uppercase mb-4 block">{selectedArticle.category}</span>
                <h1 className="text-3xl font-serif text-white leading-tight mb-8">{selectedArticle.title}</h1>
                
                <div className="flex items-center gap-6 border-y border-white/5 py-6 mb-8">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-500" />
                    <span className="text-xs text-gray-300 font-medium">{selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-[10px] text-gray-500 tracking-wider uppercase">{selectedArticle.readTime}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed font-serif text-lg italic">
                    "{selectedArticle.content}"
                  </p>
                  <div className="h-px w-20 bg-gold-500/30 my-8" />
                  <p className="text-gray-400 leading-relaxed text-sm">
                    In the realm of high-end aesthetics, the convergence of medical science and artistic vision is where true transformation occurs. This column explores the intricate balance between technological innovation and the human touch, providing our VVIP members with insights into the world's most exclusive rejuvenation protocols.
                  </p>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    As we continue to push the boundaries of regenerative medicine, the focus shifts from mere correction to holistic enhancement, ensuring that every procedure not only refines the exterior but also respects the underlying biological integrity.
                  </p>
                </div>
              </div>

              {/* Related Section Preview */}
              <div className="bg-gold-500/10 border border-gold-500/20 rounded-2xl p-6 flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-[10px] text-gold-500 font-bold tracking-widest uppercase mb-1">Next Article</p>
                  <h4 className="text-sm font-serif text-white group-hover:text-gold-500 transition-colors">Cellular Time-Reversal: The Future of Exosomes</h4>
                </div>
                <ChevronRight className="w-5 h-5 text-gold-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
