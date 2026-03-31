import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import type { Article } from '../../store/useStore';

interface ArticlesSectionProps {
  articles: Article[];
  globalView: 'card' | 'list';
}

export default function ArticlesSection({ articles, globalView }: ArticlesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      if (article.tags) {
        article.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [articles]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredArticles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return articles.filter((article) => {
      // Tag filter (OR logic)
      if (selectedTags.length > 0) {
        const articleTags = article.tags || [];
        if (!selectedTags.some((tag) => articleTags.includes(tag))) return false;
      }
      // Search filter
      if (!keyword) return true;
      return `${article.title} ${article.summary} ${article.content}`.toLowerCase().includes(keyword);
    });
  }, [articles, searchQuery, selectedTags]);

  return (
    <section id="writing" className="py-24 px-6 lg:px-8 bg-stone-50/50 dark:bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif dark:text-stone-100">随笔与动态</h2>
          <p className="text-stone-500 text-lg font-light dark:text-stone-400">关于语言教学的思考，以及产品更新日志</p>
        </div>

        {/* Search & Tags */}
        <div className="bg-white/70 border border-stone-200/60 rounded-2xl p-4 md:p-5 mb-8 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.1)] dark:bg-stone-900/70 dark:border-stone-800/60 dark:shadow-[0_8px_24px_-14px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col gap-4">
            {/* Search input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章标题、摘要、内容..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049]/40 transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]/40"
              />
            </div>
            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    清除
                  </button>
                )}
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? 'bg-[#2A6049] text-white dark:bg-[#4A8069]'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          globalView === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((article, index) => (
                <Link to={`/article/${article.id}`} key={article.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group h-full rounded-[2rem] bg-white border border-stone-100 hover:border-[#E8F0EE] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer overflow-hidden flex flex-col dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:border-[#1a2e24] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)]"
                  >
                    {article.imageUrl && (
                      <div className="h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-stone-400 text-sm font-mono dark:text-stone-500">{article.date}</span>
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap">
                            {article.tags.map((tag) => (
                              <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors font-serif dark:text-stone-100 dark:group-hover:text-[#4A8069]">{article.title}</h3>
                      <p className="text-stone-500 leading-relaxed mb-6 font-light flex-grow dark:text-stone-400">{article.summary}</p>
                      <div className="text-[#2A6049] font-medium text-sm flex items-center mt-auto dark:text-[#4A8069]">
                        阅读全文 <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredArticles.map((article, index) => (
                <Link to={`/article/${article.id}`} key={article.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.45 }}
                    className="group flex items-center gap-4 md:gap-6 bg-white rounded-2xl border border-stone-100 px-4 py-4 md:px-6 md:py-5 hover:border-[#DDEAE4] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:border-[#1a2e24] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors flex-shrink-0 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold text-stone-800 font-serif truncate dark:text-stone-100">{article.title}</h3>
                        <span className="text-xs text-stone-400 font-mono dark:text-stone-500">{article.date}</span>
                        {article.tags && article.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-2 dark:text-stone-400">{article.summary}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )
        ) : (
          <div className="col-span-full py-16 text-center text-stone-400 font-light border border-dashed border-stone-200 rounded-3xl dark:border-stone-700 dark:text-stone-500">
            {searchQuery || selectedTags.length > 0 ? '未找到匹配的文章，试试更换关键词或标签。' : '近期暂无更新。'}
          </div>
        )}
      </div>
    </section>
  );
}
