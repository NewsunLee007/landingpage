import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, LayoutTemplate } from 'lucide-react';

export interface TechShareItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  tags: string[];
  internalPath?: string;
  href?: string;
  fallbackImage?: string;
  category?: string;
}

interface TechShareCardProps {
  item: TechShareItem;
  index: number;
}

export default function TechShareCard({ item, index }: TechShareCardProps) {
  const isInternal = !!item.internalPath;
  const Icon = isInternal ? KeyRound : LayoutTemplate;
  const linkText = isInternal ? '查看完整指南' : '打开工具页面';

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ delay: index * 0.03 }}
      className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden h-full dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)]"
    >
      <div className="h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = item.fallbackImage || '';
          }}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors duration-500 shadow-sm dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="text-[11px] tracking-wide font-medium px-3 py-1 bg-stone-50 text-stone-500 rounded-full border border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors duration-500 font-serif dark:text-stone-100 dark:group-hover:text-[#4A8069]">{item.title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-grow font-light dark:text-stone-400">{item.summary}</p>
        <div className="flex items-center text-sm font-medium text-stone-400 group-hover:text-[#2A6049] transition-colors duration-500 mt-auto dark:text-stone-500 dark:group-hover:text-[#4A8069]">
          {linkText}
          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-500" />
        </div>
      </div>
    </motion.div>
  );

  if (isInternal) {
    return <Link to={item.internalPath!}>{cardContent}</Link>;
  }

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {cardContent}
    </motion.a>
  );
}
