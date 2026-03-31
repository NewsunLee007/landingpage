import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="fixed right-4 bottom-5 md:right-6 md:bottom-8 z-[70]">
      <div className="bg-white/90 backdrop-blur-xl border border-stone-200/80 rounded-2xl p-1.5 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.2)] flex items-center gap-1 dark:bg-stone-900/90 dark:border-stone-700/80">
        <button
          onClick={() => onViewChange('card')}
          className={`px-3 py-2 rounded-xl text-xs md:text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${view === 'card' ? 'bg-[#2A6049] text-white dark:bg-[#4A8069]' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'}`}
        >
          <LayoutGrid className="w-4 h-4" />
          卡片
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`px-3 py-2 rounded-xl text-xs md:text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${view === 'list' ? 'bg-[#2A6049] text-white dark:bg-[#4A8069]' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'}`}
        >
          <List className="w-4 h-4" />
          列表
        </button>
      </div>
    </div>
  );
}
