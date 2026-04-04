import { LayoutGrid, List, Search, X } from 'lucide-react';
import { useState } from 'react';

interface ViewToggleProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ViewToggle({ view, onViewChange, searchQuery, onSearchChange }: ViewToggleProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="fixed right-4 bottom-5 md:right-6 md:bottom-8 z-[70]">
      <div className="bg-white/90 backdrop-blur-xl border border-stone-200/80 rounded-2xl p-1.5 shadow-[0_10px_24px_-12px_rgba(0,0,0,0.2)] flex items-center gap-1 dark:bg-stone-900/90 dark:border-stone-700/80">
        {isSearchOpen ? (
          <div className="flex items-center gap-2 px-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="全局搜索..."
              autoFocus
              className="w-48 md:w-64 px-3 py-2 rounded-xl border border-stone-200 bg-transparent text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049]/40 transition-all dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]/40"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                onSearchChange('');
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-stone-800"
            >
              <Search className="w-4 h-4" />
            </button>
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
          </>
        )}
      </div>
    </div>
  );
}
