import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, LayoutTemplate, BookOpen, PenTool, KeyRound } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { AppItem } from '../../store/useStore';
import PasswordModal from './PasswordModal';

const PRIVATE_PASSWORD = import.meta.env.VITE_PRIVATE_CONTENT_PASSWORD || '123456';

const IconMap: Record<string, React.ElementType> = {
  Code: LayoutTemplate,
  Layout: LayoutTemplate,
  GraduationCap: BookOpen,
  Globe: PenTool,
  Sparkles,
  KeyRound,
};

function getAppVisualIconName(app: AppItem): string {
  if (app.iconName && app.iconName !== 'Layout') {
    return app.iconName;
  }
  const iconPool = ['Layout', 'Sparkles', 'GraduationCap', 'Globe', 'KeyRound'];
  const hash = app.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return iconPool[hash % iconPool.length];
}

export { getAppVisualIconName, IconMap };

interface AppCardProps {
  app: AppItem;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
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
        transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -4 }}
        className="group flex flex-col bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden dark:bg-[#1A1A1A] dark:border-stone-800 dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)]"
      >
        {app.imageUrl && (
          <div className="h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
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
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop';
              }}
              className={`w-full h-full object-cover transform transition-transform duration-700 ease-out ${app.isPrivate ? 'blur-sm group-hover:blur-0 scale-110 group-hover:scale-105' : 'group-hover:scale-105'}`}
            />
          </div>
        )}

        <div className="p-8 flex-grow flex flex-col relative">
          <div className="flex items-start justify-between mb-6">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-700 group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors duration-500 shadow-sm dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-[#1a2e24] dark:group-hover:text-[#4A8069]">
              {app.isPrivate ? <Lock className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <div className="flex gap-2">
              {app.tags.slice(0, 2).map(tag => (
                <span key={tag} className={`text-[11px] tracking-wide font-medium px-3 py-1 rounded-full border ${tag === '私密' ? 'bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50' : 'bg-stone-50 text-stone-500 border-stone-100/50 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700/50'}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-[#2A6049] transition-colors duration-500 font-serif dark:text-stone-100 dark:group-hover:text-[#4A8069]">
            {app.title}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-grow font-light dark:text-stone-400">
            {app.description}
          </p>
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
