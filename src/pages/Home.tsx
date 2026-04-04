import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [globalView, setGlobalView] = useState<'card' | 'list'>('list');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // 按日期排序获取最新文章
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049] dark:bg-[#0F0F0F] dark:text-stone-200 dark:selection:bg-[#1a2e24] dark:selection:text-[#4A8069]">
      <Helmet>
        <title>Newsun - 让英语教学更具启发性</title>
      </Helmet>

      <Navbar />

      {/* 顶部区域 */}
      <HeroSection />

      {/* 内容区域 */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 侧边栏：最新文章列表 */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-28 bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-stone-100/60 p-6 dark:bg-[#1A1A1A]/80 dark:border-stone-800/60">
              <h3 className="text-lg font-bold font-serif mb-4 text-stone-800 dark:text-stone-100">最新更新</h3>
              <div className="space-y-4">
                {latestArticles.map((article) => (
                  <Link key={article.id} to={`/article/${article.id}`} className="block border-b border-stone-100 pb-4 last:border-0 last:pb-0 dark:border-stone-800 hover:bg-stone-50/50 -mx-2 px-2 rounded-xl transition-colors dark:hover:bg-stone-800/30">
                    <div className="text-sm text-stone-400 font-mono mb-2 dark:text-stone-500">{article.date}</div>
                    <h4 className="text-sm font-medium text-stone-800 hover:text-[#2A6049] transition-colors dark:text-stone-200 dark:hover:text-[#4A8069]">
                      {article.title}
                    </h4>
                    {article.summary && (
                      <p className="text-xs text-stone-500 mt-1 dark:text-stone-400 line-clamp-2">
                        {article.summary}
                      </p>
                    )}
                  </Link>
                ))}
                {latestArticles.length === 0 && (
                  <p className="text-sm text-stone-400 dark:text-stone-500">暂无文章</p>
                )}
              </div>
            </div>
          </div>

          {/* 主内容 */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <ToolsSection apps={apps} globalView={globalView} setGlobalView={setGlobalView} searchQuery={globalSearchQuery} />
            <TechShareSection globalView={globalView} searchQuery={globalSearchQuery} />
            <ArticlesSection articles={articles} globalView={globalView} searchQuery={globalSearchQuery} />
            <AboutSection />
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
      <ViewToggle view={globalView} onViewChange={setGlobalView} searchQuery={globalSearchQuery} onSearchChange={setGlobalSearchQuery} />
      <Toast />
    </div>
  );
}
