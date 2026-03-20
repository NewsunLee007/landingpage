import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, PenTool, LayoutTemplate, Coffee, Sparkles, Mail, KeyRound, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { AppItem } from '../store/useStore';

const heroImages = [
  'https://p.ipic.vip/ppvs3g.jpg',
  'https://p.ipic.vip/gwurf7.jpg',
  'https://p.ipic.vip/js32gc.jpg',
  'https://p.ipic.vip/ls9q8u.jpg',
  'https://p.ipic.vip/t6g69n.jpg',
  'https://p.ipic.vip/u7kolm.jpg',
  'https://p.ipic.vip/zaas43.jpg'
];

const IconMap: Record<string, React.ElementType> = {
  Code: LayoutTemplate, 
  Layout: LayoutTemplate, 
  GraduationCap: BookOpen, 
  Globe: PenTool
};

function AppCard({ app, index }: { app: AppItem, index: number }) {
  const Icon = IconMap[app.iconName] || Sparkles;

  const handleClick = (e: React.MouseEvent) => {
    if (app.isPrivate) {
      e.preventDefault();
      const pwd = window.prompt('此内容包含未公开的设计与创意，请输入访问密码 (提示：102030)：');
      if (pwd === '102030') {
        window.open(app.url, '_blank', 'noopener,noreferrer');
      } else if (pwd !== null) {
        alert('密码错误，暂无访问权限。');
      }
    }
  };

  return (
    <motion.a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
    >
      {app.imageUrl && (
        <div className="h-48 w-full overflow-hidden bg-stone-100 relative">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
          {app.isPrivate && (
            <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium border border-white/10">
              <Lock className="w-3 h-3" />
              <span>私密</span>
            </div>
          )}
          <img 
            src={app.imageUrl} 
            alt={app.title} 
            className={`w-full h-full object-cover transform transition-transform duration-700 ease-out ${app.isPrivate ? 'blur-sm group-hover:blur-0 scale-110 group-hover:scale-105' : 'group-hover:scale-105'}`}
          />
        </div>
      )}
      
      <div className="p-8 flex-grow flex flex-col relative">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors duration-500 shadow-sm">
            {app.isPrivate ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
          </div>
          <div className="flex gap-2">
            {app.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`text-[11px] tracking-wide font-medium px-3 py-1 rounded-full border ${tag === '私密' ? 'bg-amber-50 text-amber-600 border-amber-200/50' : 'bg-stone-50 text-stone-500 border-stone-100/50'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors duration-500 font-serif">
          {app.title}
        </h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-grow font-light">
          {app.description}
        </p>
        <div className="flex items-center text-sm font-medium text-stone-400 group-hover:text-[#2A6049] transition-colors duration-500 mt-auto">
          {app.isPrivate ? '输入密码访问' : '探索工具'} 
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" />
        </div>
      </div>
    </motion.a>
  );
}

export default function Home() {
  const { apps, articles } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categories = ['全部', ...Array.from(new Set(apps.map(app => app.category)))];

  const filteredApps = activeCategory === '全部' 
    ? apps 
    : apps.filter(app => app.category === activeCategory);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // 切换时间设置为 5 秒
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049]">
      
      {/* Organic Background Shapes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#F2ECE4]/60 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E8F0EE]/60 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-xl tracking-tight text-stone-800 drop-shadow-sm">Newsun.</span>
            </div>
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors drop-shadow-sm">关于我</button>
                <button onClick={() => scrollToSection('tools')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors drop-shadow-sm">工具与创作</button>
              <button onClick={() => scrollToSection('tech-share')} className="text-sm font-medium text-stone-600 hover:text-[#2A6049] transition-colors drop-shadow-sm flex items-center gap-1.5">
                技术分享
              </button>
              <button onClick={() => scrollToSection('writing')} className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors drop-shadow-sm">随笔动态</button>
              </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 flex flex-col justify-center min-h-[90vh] overflow-hidden">
          {/* Dynamic Background Carousel */}
          <div className="absolute inset-0 z-0">
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
              />
            </AnimatePresence>
            {/* Elegant Overlay: gradient + blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA]/90 via-[#FAFAFA]/70 to-[#FAFAFA] backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 px-6 lg:px-8 max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-stone-200/50 text-stone-700 text-xs font-medium tracking-wide shadow-sm">
                <Coffee className="w-3.5 h-3.5" />
                <span>English Educator & Vibe Coder</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-stone-800 tracking-tight mb-8 leading-[1.1] font-serif drop-shadow-sm">
                让英语教学 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A6049] to-[#4A8069]">更具启发性</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-700 leading-relaxed mb-12 max-w-2xl font-light drop-shadow-sm">
                Hello, 我是 Newsun。我深爱着英语这门语言的魅力，也着迷于编程带来的无限可能。在这里，我将教学一线的经验转化为数字工具，希望用技术打破传统的边界，让学习变得更加生动、纯粹。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button 
                  onClick={() => scrollToSection('tools')}
                  className="px-8 py-4 bg-[#2A6049] text-white rounded-2xl font-medium text-sm hover:bg-[#1f4736] transition-colors flex items-center justify-center shadow-lg shadow-[#2A6049]/20"
                >
                  浏览我的创作
                </button>
                <a 
                  href="#about"
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-stone-800 rounded-2xl font-medium text-sm border border-stone-200/80 hover:border-stone-300 hover:bg-white transition-colors flex items-center justify-center shadow-sm"
                >
                  了解更多
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tools Section */}
        <section id="tools" className="py-24 px-6 lg:px-8 relative bg-stone-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif">工具与创作</h2>
                <p className="text-stone-500 text-lg font-light">为英语学习和日常教学打造的数字脚手架</p>
              </div>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === category 
                        ? 'bg-[#2A6049] text-white shadow-md shadow-[#2A6049]/20' 
                        : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AppCard app={app} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* This section has been moved to a separate page (/api-hub), removing from Home */}
        
        {/* Features Preview / Technical Sharing Preview */}
        <section id="tech-share" className="py-24 px-6 lg:px-8 relative bg-stone-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif">技术分享</h2>
              <p className="text-stone-500 text-lg font-light">关于前沿技术与教育结合的实践指南</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/api-hub">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden h-full"
                >
                  <div className="h-48 w-full overflow-hidden bg-stone-100 relative">
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" 
                      alt="AI Key Guide" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors duration-500 shadow-sm">
                        <KeyRound className="w-5 h-5" />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[11px] tracking-wide font-medium px-3 py-1 bg-stone-50 text-stone-500 rounded-full border border-stone-100/50">
                          指南
                        </span>
                        <span className="text-[11px] tracking-wide font-medium px-3 py-1 bg-stone-50 text-stone-500 rounded-full border border-stone-100/50">
                          AI
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors duration-500 font-serif">
                      驱动 AI 的“钥匙”
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-grow font-light">
                      主流大模型（DeepSeek、Kimi、OpenAI 等）API Key 免费申请与接入指南。
                    </p>
                    <div className="flex items-center text-sm font-medium text-stone-400 group-hover:text-[#2A6049] transition-colors duration-500 mt-auto">
                      查看完整指南 
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section id="writing" className="py-24 px-6 lg:px-8 bg-stone-50/50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif">随笔与动态</h2>
              <p className="text-stone-500 text-lg font-light">关于语言教学的思考，以及产品更新日志</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {articles.length > 0 ? articles.map((article, index) => (
                <Link 
                  to={`/article/${article.id}`}
                  key={article.id}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group h-full rounded-[2rem] bg-white border border-stone-100 hover:border-[#E8F0EE] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                  >
                    {article.imageUrl && (
                      <div className="h-48 w-full overflow-hidden bg-stone-100 relative">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                        <img 
                          src={article.imageUrl} 
                          alt={article.title} 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="text-stone-400 text-sm font-mono mb-4">{article.date}</div>
                      <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors font-serif">{article.title}</h3>
                      <p className="text-stone-500 leading-relaxed mb-6 font-light flex-grow">{article.summary}</p>
                      <div className="text-[#2A6049] font-medium text-sm flex items-center mt-auto">
                        阅读全文 <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div className="col-span-full py-16 text-center text-stone-400 font-light border border-dashed border-stone-200 rounded-3xl">
                  近期暂无更新。
                </div>
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="bg-[#1C1C1C] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-serif">关于我</h2>
                  <div className="space-y-6 text-stone-300 text-lg leading-relaxed font-light">
                    <p>
                      我是一名扎根一线的<strong className="text-white font-normal">英语教师</strong>。我始终认为，语言不仅是沟通的工具，更是认识世界的另一扇窗。
                    </p>
                    <p>
                      同时，我也是一名热衷于探索前沿技术的<strong className="text-white font-normal">Vibe Coder</strong>。我并不拘泥于传统的编程范式，而是善于利用 AI 工具作为我的“副驾驶”，将脑海中闪现的教学灵感快速转化为一行行跳动的代码。
                    </p>
                    <p>
                      在这里，你可以看到技术与人文的交汇。这不仅仅是工具的堆砌，更是我对教育事业热爱的另一种极具创造力的表达方式。
                    </p>
                  </div>
                </div>
                <div className="bg-[#242424] p-12 md:p-20 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-8 font-serif">关注领域</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      '英语教学法', '教育心理学', 'Web 开发', 'UI/UX 设计', 
                      'AI 辅助教学', '效率工具', '跨文化交流'
                    ].map(skill => (
                      <div key={skill} className="px-5 py-2.5 rounded-full bg-[#1C1C1C] border border-stone-800 text-stone-300 text-sm font-medium hover:border-stone-600 transition-colors cursor-default">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 px-6 lg:px-8 border-t border-stone-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl text-stone-800">Newsun.</span>
          </div>
          
          <div className="flex gap-6">
            <a href="mailto:317792050@qq.com" className="text-stone-400 hover:text-stone-800 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-stone-100 text-center text-stone-400 text-sm font-light">
          <p>© {new Date().getFullYear()} Newsun. Crafted with passion for teaching.</p>
        </div>
      </footer>
    </div>
  );
}
