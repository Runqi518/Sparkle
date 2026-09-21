"use client";

import { useState } from "react";
import { Play, Image as ImageIcon, Video, Type, Sparkles, Loader2 } from "lucide-react";
import { NodeProps, Handle, Position } from "@xyflow/react";

export const CustomNode = ({ id, data }: NodeProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string>(String(data.resultUrl || ""));
  const [prompt, setPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          projectId: String(data.projectId || ""),
          nodeId: id,
          type: data.type || "image",
          prompt,
        }),
      });
      const { task } = await res.json();

      const pollTask = async (taskId: string) => {
        const statusRes = await fetch(`/api/tasks/${taskId}`);
        const statusData = await statusRes.json();
        
        if (statusData.task.status === "success") {
          setResultUrl(statusData.task.resultUrl);
          setIsGenerating(false);
          window.dispatchEvent(new Event("points-updated"));
        } else if (statusData.task.status === "failed") {
          setIsGenerating(false);
          alert("生成失败");
        } else {
          setTimeout(() => pollTask(taskId), 1000);
        }
      };
      pollTask(task.id);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-black rounded-2xl p-5 min-w-[240px] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 bg-white/50 border border-white/20 shadow-md" />
      
      <div className="font-light tracking-widest mb-4 flex items-center gap-2 text-white/90 text-sm relative z-10">
        {data.type === 'image' && <ImageIcon className="w-4 h-4 text-white/50" />}
        {data.type === 'video' && <Video className="w-4 h-4 text-white/50" />}
        {data.type === 'text' && <Type className="w-4 h-4 text-white/50" />}
        {data.type === 'ai' && <Sparkles className="w-4 h-4 text-pink-300" />}
        {String(data.label)}
      </div>
      
      {!resultUrl && !isGenerating && (
        <div className="space-y-3 relative z-10">
          <textarea 
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full text-xs p-3 glass-silver bg-black/20 rounded-xl focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 placeholder:text-white/20 font-light resize-none" 
            rows={2} 
            placeholder="输入 Prompt..."
          />
          <button 
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full glass-pink text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-500/30 font-medium tracking-wider"
          >
            <Play className="w-3.5 h-3.5" />
            开始生成
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="h-28 bg-black/20 rounded-xl border border-white/10 flex flex-col items-center justify-center text-white/60 gap-3 relative z-10 shadow-inner">
          <Loader2 className="w-5 h-5 animate-spin text-pink-300" />
          <span className="text-[10px] font-light tracking-widest">引擎处理中...</span>
        </div>
      )}

      {resultUrl && (
        <div className="mt-3 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 relative z-10 shadow-inner">
          {data.type === 'video' ? (
            <video src={resultUrl} controls autoPlay loop muted className="w-full h-auto object-cover max-h-[160px] mix-blend-screen opacity-90" />
          ) : (
            <img src={resultUrl} alt="Generated" className="w-full h-auto object-cover max-h-[160px] mix-blend-screen opacity-90" />
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 bg-white/50 border border-white/20 shadow-md" />
    </div>
  );
};
