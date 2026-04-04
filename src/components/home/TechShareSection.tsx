import { useState, useMemo } from 'react';
import TechShareCard from '../ui/TechShareCard';
import type { TechShareItem } from '../ui/TechShareCard';
import TechShareListItem from '../ui/TechShareListItem';

const TECH_SHARE_CATEGORIES = ['全部', '指南', '工具', 'Web开发'];

const techShares: TechShareItem[] = [
  {
    id: 'api-hub',
    title: '驱动 AI 的"钥匙"',
    summary: '主流大模型（DeepSeek、Kimi、OpenAI 等）API Key 免费申请与接入指南。',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    tags: ['指南', 'AI'],
    internalPath: '/api-hub',
    category: '指南'
  },
  {
    id: 'excel-split-merge',
    title: 'Excel 拆分与合并（浏览器版）',
    summary: '在线处理 .xlsx / .xlsm / .xls，支持按列拆分、多文件合并、去重与冲突报告导出。',
    imageUrl: 'https://p.ipic.vip/6f2zhk.jpg',
    tags: ['工具', 'Excel'],
    href: 'https://dealexcel.newsunenglish.com',
    fallbackImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop',
    category: '工具'
  },
  {
    id: 'html-runner-pro',
    title: 'HTML 运行器 Pro',
    summary: '支持实时预览与导出，提供清晰度倍数与图片质量调节，便于快速生成高质量页面截图。',
    imageUrl: 'https://p.ipic.vip/gb1gln.jpg',
    tags: ['工具', 'HTML'],
    href: 'https://htmlrunner.newsunenglish.com/',
    fallbackImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
    category: '工具'
  }
];

interface TechShareSectionProps {
  globalView: 'card' | 'list';
  searchQuery?: string;
}

export default function TechShareSection({ globalView, searchQuery = '' }: TechShareSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('全部');

  const categoryCounts = useMemo(() => {
    const counts = TECH_SHARE_CATEGORIES.reduce<Record<string, number>>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    techShares.forEach((item) => {
      const category = item.category || '其他';
      if (counts[category] !== undefined) counts[category] += 1;
      counts['全部'] += 1;
    });
    return counts;
  }, []);

  const filteredTechShares = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return techShares.filter((item) => {
      const category = item.category || '其他';
      const categoryMatched = activeCategory === '全部' || category === activeCategory;
      if (!categoryMatched) return false;
      if (!keyword) return true;
      return `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase().includes(keyword);
    });
  }, [searchQuery, activeCategory]);

  return (
    <section id="tech-share" className="py-24 px-6 lg:px-8 relative bg-stone-50/30 dark:bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif dark:text-stone-100">技术分享</h2>
          <p className="text-stone-500 text-lg font-light dark:text-stone-400">关于前沿技术与教育结合的实践指南</p>
        </div>
        <div className="bg-white/70 border border-stone-200/60 rounded-2xl p-4 md:p-5 mb-8 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.1)] dark:bg-stone-900/70 dark:border-stone-800/60 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2 overflow-x-auto">
            {TECH_SHARE_CATEGORIES.map(category => (
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
        {filteredTechShares.length > 0 ? (
          globalView === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTechShares.map((item, index) => (
                <TechShareCard key={item.id} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTechShares.map((item, index) => (
                <TechShareListItem key={item.id} item={item} index={index} />
              ))}
            </div>
          )
        ) : (
          <div className="col-span-full py-16 text-center text-stone-400 font-light border border-dashed border-stone-200 rounded-3xl dark:border-stone-700 dark:text-stone-500">
            未找到匹配的技术分享，试试更换关键词或分类。
          </div>
        )}
      </div>
    </section>
  );
}
