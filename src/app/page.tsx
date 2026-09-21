"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, LayoutGrid, Type, Video, TrendingUp, Trash2 } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { FluidParticleText } from "@/components/FluidParticleText";
import Link from "next/link";
import { ProjectResponse } from "../../schemas/project";

const FILTERS = ["全部", "全行业", "教育培训", "3c及电器", "互联网", "美妆", "母婴", "宠物"];

const CAROUSEL_ITEMS = [
  { id: 'idea', label: 'Idea', icon: Type, color: 'text-white/80', gradient: 'from-white/10' },
  { id: 'asset', label: 'Asset', icon: Video, color: 'text-white/90', gradient: 'from-pink-500/10' },
  { id: 'growth', label: 'Growth', icon: TrendingUp, color: 'text-pink-300/90', gradient: 'from-pink-400/10' }
];

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("全部");
  const [centerIndex, setCenterIndex] = useState(1);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);

  // 轮播自动播放，悬停时暂停
  useEffect(() => {
    if (isCarouselPaused) return;
    const timer = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isCarouselPaused]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (e) {}
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("确定要删除这个项目吗？")) {
      try {
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        fetchProjects();
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <TopNav />
      
      <main className="flex-1 overflow-y-auto px-8 py-8 relative">
        
        {/* Hero Poster Area */}
        <section className="relative w-full h-[480px] mb-14 rounded-3xl border border-white/5 overflow-hidden flex flex-col glass-black shadow-2xl group">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105 opacity-50"
            style={{ backgroundImage: "url('/p2.jpg')" }}
          />
          
          {/* Dark Overlays for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,black,transparent)] pointer-events-none" />

          {/* Top: Tiny header */}
          <div className="pt-8 px-10 relative z-10 flex-shrink-0">
            <div className="text-[9px] text-white/40 tracking-[0.4em] uppercase font-light">
              Generate. Compose. Monetize.
            </div>
          </div>

          {/* Middle: Main Visual Flow (Shrunk) */}
          <div className="flex-1 flex items-center justify-center relative z-10 w-full px-10 mt-4">
            <div
              className="w-full max-w-2xl h-40 relative flex justify-center items-center perspective-1000"
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => setIsCarouselPaused(false)}
            >
               
               {/* Connecting track background */}
               <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 border-t border-dashed border-white/10 z-0" />

               {CAROUSEL_ITEMS.map((item, index) => {
                 const offset = (index - centerIndex + 3) % 3;
                 
                 // Determine positioning based on offset (0: center, 1: right, 2: left)
                 let transformClass = "";
                 let glassClass = "";
                 let zIndex = "z-10";

                 if (offset === 0) {
                   // Center
                   transformClass = "translate-x-0 scale-110 opacity-100";
                   glassClass = "glass-silver border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.1)]";
                   zIndex = "z-30";
                 } else if (offset === 1) {
                   // Right
                   transformClass = "translate-x-44 scale-[0.85] opacity-50 hover:opacity-80 hover:scale-[0.9]";
                   glassClass = "glass-black border-white/10 hover:border-white/20 hover:shadow-2xl";
                   zIndex = "z-10 cursor-pointer";
                 } else if (offset === 2) {
                   // Left
                   transformClass = "-translate-x-44 scale-[0.85] opacity-50 hover:opacity-80 hover:scale-[0.9]";
                   glassClass = "glass-black border-white/10 hover:border-white/20 hover:shadow-2xl";
                   zIndex = "z-10 cursor-pointer";
                 }

                 return (
                   <div 
                     key={item.id}
                     onClick={() => setCenterIndex(index)}
                     className={`absolute w-36 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all duration-700 ease-out overflow-hidden ${transformClass} ${glassClass} ${zIndex}`}
                   >
                     {/* Background Glow (only visible when centered) */}
                     <div className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} to-transparent transition-opacity duration-700 ${offset === 0 ? 'opacity-60' : 'opacity-0'}`} />
                     
                     <item.icon className={`w-6 h-6 mb-2 relative z-10 transition-colors duration-700 ${offset === 0 ? item.color : 'text-white/40'}`} />
                     <span className={`text-[12px] font-medium tracking-wider uppercase relative z-10 transition-colors duration-700 ${offset === 0 ? 'text-white' : 'text-white/40'}`}>
                       {item.label}
                     </span>
                   </div>
                 );
               })}

            </div>
          </div>

          {/* Bottom: Titles and Steps (Enlarged Title) */}
          <div className="pb-12 px-12 relative z-10 flex-shrink-0 flex justify-between items-end">
            <div className="flex flex-col items-start">
              <h1 
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-pink-100 tracking-widest mb-4 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] glitch-wrapper"
                data-text="AI 创意素材工坊"
              >
                AI 创意素材工坊
              </h1>
              <FluidParticleText />
              
              <div className="space-y-2 text-[11px] text-white/40 font-light tracking-widest">
                <p>一句话，生成图文与视频素材</p>
                <p>一张画布，编排千种创意组合</p>
                <p>一键触达，让素材直接商业化</p>
              </div>
            </div>
            
            {/* 3 steps bar (Gradient Text) */}
            <div className="flex items-center gap-4 text-[11px] font-light tracking-[0.25em] bg-black/40 backdrop-blur-xl pl-6 pr-8 py-3 rounded-full border border-white/10 shadow-lg relative overflow-hidden group whitespace-nowrap">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <span className="text-white/80 relative z-10 pl-1">生成</span>
              <span className="text-white/30 relative z-10 font-mono tracking-normal opacity-80">{"->"}</span>
              <span className="text-pink-100/90 relative z-10">编排</span>
              <span className="text-pink-300/40 relative z-10 font-mono tracking-normal opacity-80">{"->"}</span>
              <span className="bg-gradient-to-r from-pink-50 to-pink-200 bg-clip-text text-transparent font-medium pr-1 relative z-10">变现</span>
            </div>
          </div>
        </section>

        {/* 我的项目 */}
        <section className="mb-12">
          <h2 className="text-lg font-light tracking-widest text-white mb-5">我的项目</h2>
          <div className="flex gap-5">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="w-56 h-36 glass-black glass-hover rounded-2xl flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                <Plus className="w-5 h-5 text-white/80" />
              </div>
              <span className="font-light text-sm text-white/90 tracking-wide">开始创作</span>
              <div className="mt-2 text-[10px] text-pink-300 flex items-center gap-1 font-medium bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                <Plus className="w-3 h-3" /> 新建项目
              </div>
            </div>

            {projects.map(p => (
              <Link key={p.id} href={`/project/${p.id}`} className="w-56 h-36 glass-black glass-hover rounded-2xl flex flex-col p-4 relative group overflow-hidden">
                <button 
                  onClick={(e) => handleDelete(e, p.id)}
                  className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/50 text-white/50 opacity-0 group-hover:opacity-100 hover:text-pink-400 hover:bg-pink-500/20 transition-all flex items-center justify-center border border-white/10"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex-1 flex justify-center items-center z-10 pointer-events-none">
                  <LayoutGrid className="w-7 h-7 text-white/40 group-hover:text-white/80 transition-colors" />
                </div>
                <div className="flex justify-between items-center text-[10px] mt-3 z-10 pointer-events-none">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium tracking-wide text-white/90">{p.name}</span>
                    <span className="text-glass-muted">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2 py-1 glass-silver rounded font-medium tracking-wider">{p.industry}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 作品集 */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-light tracking-widest text-white flex-shrink-0">作品集</h2>
            <div className="flex-1 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {FILTERS.map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                    activeFilter === f 
                      ? 'glass-silver' 
                      : 'bg-white/5 border border-transparent text-glass-muted hover:border-white/20 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 glass-black glass-hover rounded-lg text-xs text-glass-muted hover:text-white">
              排序: 按热度 <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/3] rounded-2xl glass-black overflow-hidden relative group cursor-pointer border border-white/5 hover:border-white/20 transition-colors">
                  <img src={`https://picsum.photos/seed/${i+20}/400/300`} className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="text-[9px] text-pink-300 font-medium tracking-widest mb-1 uppercase">置顶</div>
                    <h3 className="text-sm font-light text-white truncate tracking-wide">示例大作 {i}</h3>
                    <p className="text-[10px] text-glass-muted mt-1 font-light">官方作品</p>
                  </div>
                </div>
             ))}
          </div>
        </section>

      </main>

      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
