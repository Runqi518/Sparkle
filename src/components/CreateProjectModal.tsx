"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const INDUSTRIES = ["教育培训", "3c及电器", "美妆", "母婴", "宠物", "互联网"];

export function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("宠物");

  const handleCreate = () => {
    if (!name.trim()) return;
    const newId = `project_${Date.now()}`;
    router.push(`/project/${newId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="glass-black rounded-3xl w-[500px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500/10 to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="text-xl font-light tracking-widest text-white">创建新项目</h2>
            <p className="text-xs text-glass-muted mt-2 font-light">设置项目基本信息，创建后仍可在项目设置中修改。</p>
          </div>
          <button onClick={onClose} className="relative z-10 text-glass-muted hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 relative">
          <div>
            <label className="block text-xs tracking-wider text-white/80 mb-2">项目名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入项目名称"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-light text-sm placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="block text-xs tracking-wider text-white/80 mb-1">所属行业</label>
            <p className="text-[10px] text-glass-muted mb-3 font-light">用于为项目推荐更合适的模板和素材</p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                    industry === ind
                      ? "glass-silver shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                      : "bg-white/5 border border-transparent text-glass-muted hover:border-white/20 hover:text-white"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/20">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-xs tracking-widest font-light bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-6 py-2 rounded-full text-xs tracking-widest font-medium glass-pink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-500/30 transition-colors"
          >
            创建项目
          </button>
        </div>
      </div>
    </div>
  );
}
