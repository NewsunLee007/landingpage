export default function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-[#1C1C1C] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-serif">关于我</h2>
              <div className="space-y-6 text-stone-300 text-lg leading-relaxed font-light">
                <p>
                  我是一名扎根一线的<strong className="text-white font-normal">英语教师</strong>。我始终认为，语言不仅是沟通的工具，更是认识世界的另一扇窗。
                </p>
                <p>
                  同时，我也是一名热衷于探索前沿技术的<strong className="text-white font-normal">Vibe Coder</strong>。我并不拘泥于传统的编程范式，而是善于利用 AI 工具作为我的"副驾驶"，将脑海中闪现的教学灵感快速转化为一行行跳动的代码。
                </p>
                <p>
                  在这里，你可以看到技术与人文的交汇。这不仅仅是工具的堆砌，更是我对教育事业热爱的另一种极具创造力的表达方式。
                </p>
              </div>
            </div>
            <div className="bg-[#242424] p-12 md:p-20 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-8 font-serif">关注领域</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  '英语教学法', '教育心理学', 'Web 开发', 'UI/UX 设计',
                  'AI 辅助教学', '效率工具', '跨文化交流'
                ].map(skill => (
                  <div key={skill} className="px-5 py-2.5 rounded-full bg-[#1C1C1C] border border-stone-800 text-stone-300 text-sm font-medium hover:border-stone-600 transition-colors cursor-default">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
