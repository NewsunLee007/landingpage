import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error?: string;
  title?: string;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
  error,
  title = '此内容包含未公开的设计与创意，请输入访问密码',
}: PasswordModalProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onSubmit(password.trim());
      setPassword('');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setPassword('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md mx-4 relative dark:bg-[#1A1A1A] dark:border dark:border-stone-800"
          >
            <button
              onClick={() => {
                onClose();
                setPassword('');
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors dark:hover:text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E8F0EE] flex items-center justify-center text-[#2A6049] dark:bg-[#1a2e24] dark:text-[#4A8069]">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 font-serif dark:text-stone-100">访问验证</h3>
            </div>

            <p className="text-sm text-stone-500 font-light mb-6 leading-relaxed dark:text-stone-400">{title}</p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2A6049]/20 focus:border-[#2A6049]/40 transition-all dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-500 dark:focus:ring-[#4A8069]/20 dark:focus:border-[#4A8069]/40"
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setPassword('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#2A6049] text-white text-sm font-medium hover:bg-[#1f4736] transition-colors shadow-md shadow-[#2A6049]/20 dark:bg-[#4A8069] dark:hover:bg-[#3d6d58] dark:shadow-[#4A8069]/20"
                >
                  确认
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
