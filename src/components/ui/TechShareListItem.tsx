import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { KeyRound, LayoutTemplate } from 'lucide-react';
import type { TechShareItem } from './TechShareCard';

interface TechShareListItemProps {
  item: TechShareItem;
  index: number;
}

export default function TechShareListItem({ item, index }: TechShareListItemProps) {
  const isInternal = !!item.internalPath;
  const Icon = isInternal ? KeyRound : LayoutTemplate;

  const listContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.45 }}
      className="group flex items-center gap-4 md:gap-6 bg-white rounded-2xl border border-stone-100 px-4 py-4 md:px-6 md:py-5 hover:border-[#DDEAE4] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:border-[#1a2e24] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]"
    >
      <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors flex-shrink-0 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-grow">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <h3 className="text-base md:text-lg font-bold text-stone-800 font-serif truncate dark:text-stone-100">{item.title}</h3>
          {item.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full border bg-stone-50 text-stone-500 border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50">{tag}</span>
          ))}
        </div>
        <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-2 dark:text-stone-400">{item.summary}</p>
      </div>
    </motion.div>
  );

  if (isInternal) {
    return <Link to={item.internalPath!}>{listContent}</Link>;
  }

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {listContent}
    </motion.a>
  );
}
