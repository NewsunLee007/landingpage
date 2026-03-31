import TechShareCard from '../ui/TechShareCard';
import type { TechShareItem } from '../ui/TechShareCard';
import TechShareListItem from '../ui/TechShareListItem';

const techShares: TechShareItem[] = [
  {
    id: 'api-hub',
    title: '驱动 AI 的"钥匙"',
    summary: '主流大模型（DeepSeek、Kimi、OpenAI 等）API Key 免费申请与接入指南。',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    tags: ['指南', 'AI'],
    internalPath: '/api-hub'
  },
  {
    id: 'excel-split-merge',
    title: 'Excel 拆分与合并（浏览器版）',
    summary: '在线处理 .xlsx / .xlsm / .xls，支持按列拆分、多文件合并、去重与冲突报告导出。',
    imageUrl: 'https://p.ipic.vip/6f2zhk.jpg',
    tags: ['工具', 'Excel'],
    href: 'https://dealexcel.newsunenglish.com',
    fallbackImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'html-runner-pro',
    title: 'HTML 运行器 Pro',
    summary: '支持实时预览与导出，提供清晰度倍数与图片质量调节，便于快速生成高质量页面截图。',
    imageUrl: 'https://p.ipic.vip/gb1gln.jpg',
    tags: ['工具', 'HTML'],
    href: 'https://htmlrunner.newsunenglish.com/',
    fallbackImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop'
  }
];

interface TechShareSectionProps {
  globalView: 'card' | 'list';
}

export default function TechShareSection({ globalView }: TechShareSectionProps) {
  return (
    <section id="tech-share" className="py-24 px-6 lg:px-8 relative bg-stone-50/30 dark:bg-[#0F0F0F]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 font-serif dark:text-stone-100">技术分享</h2>
          <p className="text-stone-500 text-lg font-light dark:text-stone-400">关于前沿技术与教育结合的实践指南</p>
        </div>
        {globalView === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techShares.map((item, index) => (
              <TechShareCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {techShares.map((item, index) => (
              <TechShareListItem key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
