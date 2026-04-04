import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import type { AppItem } from '../../store/useStore';
import { useStore } from '../../store/useStore';
import { getAppVisualIconName, IconMap } from './AppCard';
import PasswordModal from './PasswordModal';

const PRIVATE_PASSWORD = import.meta.env.VITE_PRIVATE_CONTENT_PASSWORD || '123456';

interface AppListItemProps {
  app: AppItem;
  index: number;
}

export default function AppListItem({ app, index }: AppListItemProps) {
  const iconName = getAppVisualIconName(app);
  const Icon = IconMap[iconName] || Sparkles;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const incrementAppClick = useStore((state) => state.incrementAppClick);

  const handleClick = (e: React.MouseEvent) => {
    if (app.isPrivate) {
      e.preventDefault();
      setModalError('');
      setModalOpen(true);
    } else {
      incrementAppClick(app.id);
    }
  };

  const handlePasswordSubmit = (password: string) => {
    if (password === PRIVATE_PASSWORD) {
      setModalOpen(false);
      incrementAppClick(app.id);
      window.open(app.url, '_blank', 'noopener,noreferrer');
    } else {
      setModalError('密码错误，暂无访问权限。');
    }
  };

  return (
    <>
      <motion.a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.04, duration: 0.45 }}
        className="group flex items-center gap-4 md:gap-6 bg-white rounded-2xl border border-stone-100 px-4 py-4 md:px-6 md:py-5 hover:border-[#DDEAE4] hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06)] transition-all duration-300 dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:border-[#1a2e24] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.3)]"
      >
        <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors flex-shrink-0 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
          {app.isPrivate ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
        </div>
        <div className="min-w-0 flex-grow">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-base md:text-lg font-bold text-stone-800 font-serif truncate dark:text-stone-100">{app.title}</h3>
            {app.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`text-[11px] px-2.5 py-0.5 rounded-full border ${tag === '私密' ? 'bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' : 'bg-stone-50 text-stone-500 border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50'}`}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-2 dark:text-stone-400">{app.description}</p>
        </div>
      </motion.a>

      <PasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        error={modalError}
      />
    </>
  );
}
