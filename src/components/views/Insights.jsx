import { useRef, useState } from 'react';
import { BookMarked, ChevronRight, GripVertical } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

function ParallaxArticle({ article, isFeatured }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Slower movement for the background image to create depth
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  if (isFeatured) {
    return (
      <article ref={ref} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group cursor-pointer border border-white/5">
        <motion.img 
          style={{ y }}
          src={article.image} 
          alt={article.title} 
          className="absolute inset-0 w-full h-[130%] object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/60 to-transparent" />
        
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-obsidian-900/80 backdrop-blur-md flex items-center justify-center border border-gold-500/30">
          <BookMarked className="w-4 h-4 text-gold-500" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="text-xs text-gold-500 tracking-widest font-semibold mb-3 block">{article.category}</span>
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
    <article ref={ref} className="flex gap-4 group cursor-pointer items-center border-b border-white/5 pb-6 overflow-hidden">
      <div className="w-24 h-32 shrink-0 rounded-lg overflow-hidden relative">
        <motion.img 
          style={{ y }}
          src={article.image} 
          alt={article.title} 
          className="absolute inset-0 w-full h-[130%] object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" 
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
        {/* After Image (Background) */}
        <img 
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Before Image (Foreground, Clipped) */}
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

        {/* Slider Handle */}
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
  const { t } = useLanguage();

  const articles = [
    {
      id: 1,
      category: t('insight_cat_1'),
      title: t('insight_title_1'),
      author: t('insight_author_1'),
      image: "https://images.unsplash.com/photo-1614030613206-4443ee9e2ebf?auto=format&fit=crop&q=80",
      readTime: t('read_time_5')
    },
    {
      id: 2,
      category: t('insight_cat_2'),
      title: t('insight_title_2'),
      author: t('insight_author_2'),
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80",
      readTime: t('read_time_8')
    },
    {
      id: 3,
      category: t('insight_cat_3'),
      title: t('insight_title_3'),
      author: t('insight_author_3'),
      image: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?auto=format&fit=crop&q=80",
      readTime: t('read_time_4')
    }
  ];

  return (
    <div className="pt-12 px-6 pb-20">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-serif text-gold-500 mb-2">{t('med_art')}</h1>
        <p className="text-sm text-gray-400 tracking-widest uppercase">{t('curated_col')}</p>
      </header>

      <div className="space-y-8">
        <ParallaxArticle article={articles[0]} isFeatured={true} />

        <div className="space-y-6">
          {articles.slice(1).map((article) => (
            <ParallaxArticle key={article.id} article={article} isFeatured={false} />
          ))}
        </div>

        <BeforeAfterSlider />
      </div>
    </div>
  );
}
