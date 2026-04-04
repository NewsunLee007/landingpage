import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-6 lg:px-8 border-t border-stone-100 dark:bg-[#0F0F0F] dark:border-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="font-serif font-bold text-xl text-stone-800 dark:text-stone-200">Newsun.</span>
            <p className="mt-3 text-sm text-stone-400 font-light leading-relaxed">
              English Educator & Vibe Coder
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-3">快速导航</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: '关于我', id: 'about' },
                { label: 'AI工具', id: 'tools' },
                { label: '技术分享', id: 'tech-share' },
                { label: '随笔动态', id: 'writing' },
                { label: '管理员入口', url: '/admin' },
              ].map((item, index) => (
                item.url ? (
                  <Link
                    key={index}
                    to={item.url}
                    className="text-sm text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors text-left"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={() => item.id && document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 mb-3">联系方式</h4>
            <div className="flex items-center gap-3">
              <a
                href="mailto:317792050@qq.com"
                className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-100 dark:border-stone-800 text-center text-stone-400 text-sm font-light">
          <p>&copy; {new Date().getFullYear()} Newsun. Crafted with passion for teaching.</p>
        </div>
      </div>
    </footer>
  );
}
