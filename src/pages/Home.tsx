import { useState } from 'react';
import { useStore } from '../store/useStore';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollToTop from '../components/layout/ScrollToTop';
import ViewToggle from '../components/layout/ViewToggle';
import HeroSection from '../components/home/HeroSection';
import ToolsSection from '../components/home/ToolsSection';
import TechShareSection from '../components/home/TechShareSection';
import ArticlesSection from '../components/home/ArticlesSection';
import AboutSection from '../components/home/AboutSection';
import Toast from '../components/ui/Toast';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const { apps, articles } = useStore();
  const [globalView, setGlobalView] = useState<'card' | 'list'>('card');

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049] dark:bg-[#0F0F0F] dark:text-stone-200 dark:selection:bg-[#1a2e24] dark:selection:text-[#4A8069]">
      <Helmet>
        <title>Newsun - 让英语教学更具启发性</title>
      </Helmet>

      {/* Organic Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F2ECE4]/60 rounded-full blur-[100px] mix-blend-multiply dark:bg-[#2A6049]/10 dark:mix-blend-normal"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E8F0EE]/60 rounded-full blur-[100px] mix-blend-multiply dark:bg-[#4A8069]/10 dark:mix-blend-normal"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <ToolsSection apps={apps} globalView={globalView} setGlobalView={setGlobalView} />
        <TechShareSection globalView={globalView} />
        <ArticlesSection articles={articles} globalView={globalView} />
        <AboutSection />
      </main>

      <Footer />
      <ScrollToTop />
      <ViewToggle view={globalView} onViewChange={setGlobalView} />
      <Toast />
    </div>
  );
}
