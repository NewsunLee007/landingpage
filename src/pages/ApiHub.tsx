import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const apiProviders = [
  {
    name: 'DeepSeek (深度求索)',
    description: '当前极具性价比的国产开源之光，推理能力强，适合日常教学文本处理。',
    url: 'https://platform.deepseek.com/api_keys',
    tags: ['国产推荐', '性价比'],
    steps: ['注册/登录 DeepSeek 开放平台', '左侧菜单进入 "API Keys"', '点击 "创建 API Key" 并妥善保存']
  },
  {
    name: 'Zhipu GLM (智谱清言)',
    description: '国内老牌大模型，逻辑推理与长文本能力优秀，接口稳定。',
    url: 'https://open.bigmodel.cn/login?redirect=%2Fusercenter%2Fproj-mgmt%2Fapikeys',
    tags: ['国产推荐', '稳定可靠'],
    steps: ['登录智谱 AI 开放平台', '进入 "API Keys" 管理页面', '点击 "添加新的 API Key"']
  },
  {
    name: 'Moonshot AI (Kimi)',
    description: '以超长上下文窗口著称，非常适合处理长篇英文阅读理解或整本书籍。',
    url: 'https://platform.moonshot.cn/console/api-keys',
    tags: ['国产推荐', '超长文本'],
    steps: ['登录 Moonshot 开发者平台', '点击侧边栏 "API Key 管理"', '新建并复制你的密钥']
  },
  {
    name: 'Alibaba Qwen (通义千问)',
    description: '阿里云出品的强大开源模型系列，功能全面。',
    url: 'https://dashscope.console.aliyun.com/apiKey',
    tags: ['国产推荐', '全能型'],
    steps: ['登录阿里云百炼控制台', '进入 "API-KEY 管理"', '创建或查看已有的 API-KEY']
  },
  {
    name: 'Google Gemini',
    description: '谷歌官方大模型，免费额度对开发者非常友好。',
    url: 'https://aistudio.google.com/app/apikey',
    tags: ['国际模型', '需特殊网络'],
    steps: ['登录 Google AI Studio', '点击 "Get API key"', '创建并复制密钥']
  },
  {
    name: 'OpenAI (国际版)',
    description: '行业标杆 ChatGPT 的底层 API，功能最强大，但注册门槛较高。',
    url: 'https://platform.openai.com/api-keys',
    tags: ['国际模型', '需特殊网络'],
    steps: ['登录 OpenAI Platform', '导航至 "API keys" 页面', '点击 "Create new secret key"']
  }
];

export default function ApiHub() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans selection:bg-[#E8F0EE] selection:text-[#2A6049]">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-stone-200/50 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Link to="/" className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#E8F0EE] group-hover:text-[#2A6049] transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">返回首页</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white border border-stone-200/80 text-[#2A6049] text-sm font-medium tracking-wide shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>技术分享：API Key 申请指南</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-8 font-serif leading-tight"
          >
            驱动 AI 的“钥匙”
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-500 font-light leading-relaxed mb-12"
          >
            许多前沿的教育辅助工具（如 Write Ascend 等）需要您提供自己的大模型 API Key 才能运行。不用担心，获取它们非常简单。请选择下方任意一个您喜欢的模型，点击前往官方后台免费申请。
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-stone-600 font-medium"
          >
            <span className="flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 安全可靠
            </span>
            <span className="flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl">
              <Zap className="w-4 h-4 text-amber-500" /> 快速接入
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apiProviders.map((provider, index) => (
            <motion.div
              key={provider.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              className="bg-white rounded-[2rem] p-8 border border-stone-100 hover:border-[#E8F0EE] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col h-full group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8F0EE]/30 rounded-bl-full -z-10 group-hover:bg-[#E8F0EE]/60 transition-colors duration-500"></div>
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-stone-800 font-serif group-hover:text-[#2A6049] transition-colors">{provider.name}</h3>
              </div>
              
              <div className="flex gap-2 mb-6">
                {provider.tags.map(tag => (
                  <span key={tag} className={`text-xs px-3 py-1.5 rounded-full border font-medium ${tag === '国产推荐' ? 'bg-[#E8F0EE] text-[#2A6049] border-[#2A6049]/10' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-stone-500 text-base mb-8 font-light leading-relaxed flex-grow">
                {provider.description}
              </p>
              
              <div className="bg-stone-50/80 rounded-2xl p-6 border border-stone-100 mb-8">
                <h4 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A6049]"></span>
                  简易申请步骤
                </h4>
                <ul className="space-y-4">
                  {provider.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-stone-600 font-light items-start">
                      <span className="w-5 h-5 rounded-full bg-white text-stone-400 flex items-center justify-center flex-shrink-0 text-xs font-bold border border-stone-200 shadow-sm mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a 
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#2A6049] text-white rounded-xl font-medium text-sm hover:bg-[#1f4736] transition-all flex items-center justify-center gap-2 group/btn shadow-md shadow-[#2A6049]/20 hover:shadow-lg hover:shadow-[#2A6049]/30 hover:-translate-y-0.5"
              >
                前往获取 API Key
                <ExternalLink className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </a>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}