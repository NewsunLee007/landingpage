import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F0F] flex items-center justify-center p-6 font-sans">
      <Helmet>
        <title>页面未找到 - Newsun</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold font-serif text-[#2A6049]/10 mb-4 dark:text-[#4A8069]/10">404</div>
        <h1 className="text-2xl font-bold text-stone-800 font-serif mb-3 dark:text-stone-100">页面未找到</h1>
        <p className="text-stone-500 font-light mb-8 leading-relaxed dark:text-stone-400">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2A6049] text-white rounded-2xl font-medium text-sm hover:bg-[#1f4736] transition-colors shadow-lg shadow-[#2A6049]/20 dark:bg-[#4A8069] dark:hover:bg-[#3d6d58] dark:shadow-[#4A8069]/20"
          >
            <Home className="w-4 h-4" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-stone-700 rounded-2xl font-medium text-sm border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 dark:hover:border-stone-600 dark:hover:bg-stone-700"
          >
            <ArrowLeft className="w-4 h-4" />
            返回上页
          </button>
        </div>
      </motion.div>
    </div>
  );
}
