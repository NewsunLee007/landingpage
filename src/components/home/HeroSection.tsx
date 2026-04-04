import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';

const heroImages = [
  'https://p.ipic.vip/ppvs3g.jpg',
  'https://p.ipic.vip/gwurf7.jpg',
  'https://p.ipic.vip/js32gc.jpg',
  'https://p.ipic.vip/ls9q8u.jpg',
  'https://p.ipic.vip/t6g69n.jpg',
  'https://p.ipic.vip/u7kolm.jpg',
  'https://p.ipic.vip/zaas43.jpg',
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));

  // Preload next image before switching
  const preloadImage = useCallback((index: number) => {
    if (preloadedImages.has(index)) return;
    const img = new Image();
    img.src = heroImages[index];
    img.onload = () => {
      setPreloadedImages((prev) => new Set([...prev, index]));
    };
  }, [preloadedImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % heroImages.length;
        // Preload the image after next
        const preloadTarget = (nextIndex + 1) % heroImages.length;
        preloadImage(preloadTarget);
        return nextIndex;
      });
    }, 5000);

    // Preload the second image on mount
    preloadImage(1);

    return () => clearInterval(timer);
  }, [preloadImage]);

  return (
    <section className="relative py-32 flex flex-col justify-center min-h-[80vh] overflow-hidden">
      {/* Dynamic Background Carousel */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={heroImages[currentImageIndex]}
            alt="Hero Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ minWidth: '100%', minHeight: '100%' }}
          />
        </AnimatePresence>
        {/* Elegant Overlay: gradient + blur */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/90 via-[#FAFAFA]/70 to-[#FAFAFA] backdrop-blur-[2px] dark:from-[#0F0F0F]/90 dark:via-[#0F0F0F]/70 dark:to-[#0F0F0F]"></div>
      </div>

      <div className="relative z-10 px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-stone-200/50 text-stone-700 text-xs font-medium tracking-wide shadow-sm dark:bg-white/5 dark:border-stone-700/50 dark:text-stone-300">
            <Coffee className="w-3.5 h-3.5" />
            <span>English Educator & Vibe Coder</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-stone-800 tracking-tight mb-8 leading-[1.1] font-serif drop-shadow-sm dark:text-stone-100">
            让英语教学 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A6049] to-[#4A8069] dark:from-[#4A8069] dark:to-[#6BA38A]">更具启发性</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-12 max-w-2xl font-light drop-shadow-sm dark:text-stone-300">
            Hello, 我是 Newsun。我深爱着英语这门语言的魅力，也着迷于编程带来的无限可能。在这里，我将教学一线的经验转化为数字工具，希望用技术打破传统的边界，让学习变得更加生动、纯粹。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button
              onClick={() => scrollToSection('tools')}
              className="px-8 py-4 bg-[#2A6049] text-white rounded-2xl font-medium text-sm hover:bg-[#1f4736] dark:bg-[#4A8069] dark:hover:bg-[#3d6d58] transition-colors flex items-center justify-center shadow-lg shadow-[#2A6049]/20 dark:shadow-[#4A8069]/20"
            >
              浏览我的创作
            </button>
            <a
              href="#about"
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-800 rounded-2xl font-medium text-sm border border-stone-200/80 hover:border-stone-300 hover:bg-white transition-colors flex items-center justify-center shadow-sm dark:bg-stone-900/80 dark:text-stone-200 dark:border-stone-700/80 dark:hover:border-stone-600 dark:hover:bg-stone-800"
            >
              了解更多
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
