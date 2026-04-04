import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppItem } from '../../store/useStore';
import AppCard from '../ui/AppCard';
import AppListItem from '../ui/AppListItem';

const CATEGORY_LABEL_MAP: Record<string, string> = {
  智能教学辅助: '教学AI工具',
  教务与管理: '教务管理',
  综合展示: '创意实验',
};

const TOOL_CATEGORIES = ['全部工具', '教学AI工具', '教务管理', '创意实验'];

interface ToolsSectionProps {
  apps: AppItem[];
  globalView: 'card' | 'list';
  setGlobalView?: (view: 'card' | 'list') => void;
  searchQuery?: string;
}

export default function ToolsSection({ apps, globalView, searchQuery = '' }: ToolsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('全部工具');

  const categoryCounts = useMemo(() => {
    const counts = TOOL_CATEGORIES.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    apps.forEach((app) => {
      const mapped = CATEGORY_LABEL_MAP[app.category] || app.category;
      if (counts[mapped] !== undefined) counts[mapped] += 1;
      counts['全部工具'] += 1;
    });
    return counts;
  }, [apps]);

  const filteredApps = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return apps.filter((app) => {
      const mappedCategory = CATEGORY_LABEL_MAP[app.category] || app.category;
      const categoryMatched = activeCategory === '全部工具' || mappedCategory === activeCategory;
      if (!categoryMatched) return false;
      if (!keyword) return true;
      return `${app.title} ${app.description} ${mappedCategory} ${app.tags.join(' ')}`.toLowerCase().includes(keyword);
    });
  }, [apps, activeCategory, searchQuery]);

  return (
    <section id="tools" className="py-24 px-6 lg:px-8 relative bg-stone-50/30 dark:bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif dark:text-stone-100">AI工具</h2>
            <p className="text-stone-500 text-lg font-light dark:text-stone-400">为英语学习和日常教学打造的数字脚手架</p>
          </div>
        </div>
        <div className="bg-white/70 border border-stone-200/60 rounded-2xl p-4 md:p-5 mb-8 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.1)] dark:bg-stone-900/70 dark:border-stone-800/60 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 overflow-x-auto">
            {TOOL_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#2A6049] text-white shadow-md shadow-[#2A6049]/20 dark:bg-[#4A8069] dark:shadow-[#4A8069]/20'
                    : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200/50 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 dark:border-stone-700/50'
                }`}
              >
                {category} ({categoryCounts[category] || 0})
              </button>
            ))}
          </div>
        </div>
        {globalView === 'card' ? (
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
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app, index) => (
              <AppListItem key={app.id} app={app} index={index} />
            ))}
          </div>
        )}
        {filteredApps.length === 0 && (
          <div className="mt-10 text-center py-12 border border-dashed border-stone-200 rounded-3xl bg-white/40 text-stone-400 font-light dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-500">
            未找到匹配结果，试试更换分类或关键词。
          </div>
        )}
      </div>
    </section>
  );
}
