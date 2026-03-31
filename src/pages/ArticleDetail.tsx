import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../store/useStore';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles } = useStore();
  
  const article = articles.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex flex-col items-center justify-center">
        <Helmet>
          <title>文章未找到 - Newsun</title>
        </Helmet>
        <h1 className="text-2xl font-serif text-stone-800 mb-4 dark:text-stone-100">未找到该文章</h1>
        <button onClick={() => navigate('/')} className="text-[#2A6049] hover:underline flex items-center dark:text-[#4A8069]">
          <ArrowLeft className="w-4 h-4 mr-2" /> 返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049] dark:bg-[#0F0F0F] dark:text-stone-200 dark:selection:bg-[#1a2e24] dark:selection:text-[#4A8069]">
      <Helmet>
        <title>{article.title} - Newsun</title>
      </Helmet>

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 dark:bg-[#0F0F0F]/60 dark:border-stone-800/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link to="/" className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors dark:text-stone-400 dark:hover:text-stone-100">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors dark:bg-stone-800 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">返回首页</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-stone-100 relative overflow-hidden dark:bg-[#1A1A1A] dark:border-stone-800 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]"
        >
          {/* Decorative Background inside article */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E8F0EE]/40 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3 dark:bg-[#1a2e24]/30"></div>

          <header className="mb-12 relative z-10 text-center">
            <div className="flex items-center justify-center gap-4 text-stone-400 text-sm font-mono mb-8 dark:text-stone-500">
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 dark:bg-stone-800 dark:border-stone-700">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 dark:bg-stone-800 dark:border-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-[#2A6049] dark:text-[#4A8069]" />
                Newsun 随笔
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-8 font-serif leading-tight dark:text-stone-100">
              {article.title}
            </h1>
            
            <p className="text-xl text-stone-500 font-light leading-relaxed max-w-2xl mx-auto dark:text-stone-400">
              {article.summary}
            </p>
          </header>

          {article.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-16 relative z-10 shadow-lg"
            >
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <div className="prose prose-stone prose-lg md:prose-xl max-w-none relative z-10 
            prose-headings:font-serif prose-headings:text-stone-800 dark:prose-headings:text-stone-100
            prose-p:text-stone-600 prose-p:font-light prose-p:leading-loose dark:prose-p:text-stone-300
            prose-a:text-[#2A6049] prose-a:no-underline hover:prose-a:underline dark:prose-a:text-[#4A8069]
            prose-blockquote:border-l-[#2A6049] prose-blockquote:bg-stone-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:text-stone-500 dark:prose-blockquote:bg-stone-800 dark:prose-blockquote:text-stone-400
            prose-img:rounded-[2rem] prose-img:shadow-md
            prose-li:text-stone-600 dark:prose-li:text-stone-300
            prose-strong:text-stone-800 dark:prose-strong:text-stone-100"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          <footer className="mt-20 pt-10 border-t border-stone-100 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 dark:border-stone-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2A6049] to-[#4A8069] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                N
              </div>
              <div>
                <div className="font-bold text-stone-800 font-serif dark:text-stone-100">Newsun Lee</div>
                <div className="text-sm text-stone-500 font-light dark:text-stone-400">English Educator & Vibe Coder</div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('链接已复制到剪贴板！');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-600 font-medium text-sm transition-colors border border-stone-200/50 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 dark:border-stone-700/50"
            >
              <Share2 className="w-4 h-4" /> 分享文章
            </button>
          </footer>
        </motion.article>
      </main>
    </div>
  );
}
