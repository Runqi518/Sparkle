"use client";

import { useState, useCallback } from "react";
import { Plus, Image as ImageIcon, Video, Type, Sparkles, Folder, Grid, PlaySquare, GraduationCap, LayoutTemplate, Box } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { CustomNode } from "@/components/canvas/CustomNode";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Edge, 
  Node,
  useReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

let id = 0;
const getId = () => `node_${id++}`;
const nodeTypes = { custom: CustomNode };

function Flow() {
  const [showStartMenu, setShowStartMenu] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (label: string, type: string, pos?: {x: number, y: number}) => {
    const position = pos || { x: Math.random() * 200 + 200, y: Math.random() * 200 + 150 };
    const newNode: Node = {
      id: getId(),
      type: "custom",
      position,
      data: { label, type },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onPaneClick = useCallback(
    (event: React.MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (showStartMenu) return; // Only allow when canvas is active
      
      const position = screenToFlowPosition({
        x: ('clientX' in event ? event.clientX : 0),
        y: ('clientY' in event ? event.clientY : 0),
      });
      // 默认生成一个图片节点
      addNode("自由节点", "image", position);
    },
    [screenToFlowPosition, showStartMenu]
  );

  const handleFreeCreate = () => setShowStartMenu(false);

  const handleTemplateCreate = () => {
    setShowStartMenu(false);
    const templateNodes: Node[] = [
      { id: 't1', type: "custom", position: { x: 100, y: 250 }, data: { label: '商品主图', type: 'image' } },
      { id: 't2', type: "custom", position: { x: 400, y: 250 }, data: { label: 'AI 种草视频', type: 'video' } },
    ];
    setNodes(templateNodes);
    setEdges([{ id: 'e1-2', source: 't1', target: 't2', animated: true, style: { stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2 } }]);
  };

  return (
    <>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="rgba(255,255,255,0.05)" gap={20} size={2} />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* 左侧工具栏 */}
      {!showStartMenu && (
        <div className="absolute left-6 top-6 glass-black p-1.5 rounded-2xl flex flex-col gap-1.5 z-10 w-16">
          <div className="flex flex-col gap-1.5 mb-2 pb-2 border-b border-white/10">
            <button onClick={() => addNode("生成图片", "image")} className="p-2 hover:bg-white/10 rounded-xl text-glass-muted hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <Plus className="w-5 h-5" />
              <span className="text-[9px] font-light tracking-wider">节点</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl text-glass-muted hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <Folder className="w-4 h-4" />
              <span className="text-[9px] font-light tracking-wider">素材</span>
            </button>
          </div>
          <div className="flex flex-col gap-1.5 pt-1 text-glass-muted">
            <button className="p-2 hover:bg-white/10 rounded-xl hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <PlaySquare className="w-4 h-4" />
              <span className="text-[9px] font-light tracking-wider">作品</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <Grid className="w-4 h-4" />
              <span className="text-[9px] font-light tracking-wider">模板</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <LayoutTemplate className="w-4 h-4" />
              <span className="text-[9px] font-light tracking-wider">项目</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-xl hover:text-white transition-colors flex flex-col items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[9px] font-light tracking-wider">教程</span>
            </button>
          </div>
        </div>
      )}
      
      {/* 居中弹窗 */}
      {showStartMenu && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="flex items-center gap-2 text-white/70 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs tracking-widest font-light">选择一种创作方式</span>
          </div>
          
          <div className="flex gap-5">
            <button onClick={handleTemplateCreate} className="w-[280px] h-[120px] glass-black glass-hover rounded-3xl flex items-center p-6 gap-6 group">
              <div className="w-12 h-12 glass-silver rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-light tracking-wider text-base text-white">模板创作</h3>
                <p className="text-[10px] text-glass-muted mt-1.5 tracking-wide">套用成熟工作流</p>
              </div>
            </button>

            <button className="w-[280px] h-[120px] glass-black glass-hover rounded-3xl flex items-center p-6 gap-6 group">
              <div className="w-12 h-12 glass-silver rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlaySquare className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-light tracking-wider text-base text-white">基础创作</h3>
                <p className="text-[10px] text-glass-muted mt-1.5 tracking-wide">从文字、图片或视频开始</p>
              </div>
            </button>

            <button onClick={handleFreeCreate} className="w-[280px] h-[120px] glass-pink rounded-3xl flex items-center p-6 gap-6 group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner border border-white/30">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium tracking-wider text-base text-white">自由创作</h3>
                <p className="text-[10px] text-pink-200 mt-1.5 tracking-wide">进入空白画布</p>
              </div>
            </button>
          </div>

          <div className="mt-14 flex items-center gap-3 text-glass-muted text-xs font-light">
            <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">+</div>
            点击画布，自由生成节点
          </div>
        </div>
      )}
    </>
  );
}

export default function ProjectCanvasPage() {
  return (
    <div className="flex flex-col h-screen w-screen absolute inset-0 z-50 bg-transparent">
      <TopNav 
        leftContent={
          <div className="flex items-center gap-3 text-xs border-l border-white/10 pl-4 font-light text-white/80">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              <Box className="w-3 h-3 text-glass-muted" />
              <span>宠物</span>
            </div>
            <span className="font-medium tracking-wide text-white">Sparkle Demo</span>
            <span className="text-glass-muted text-[10px] tracking-wider">· 0 个节点 / 0 条链路</span>
          </div>
        }
      />
      <main className="flex-1 relative">
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </main>
    </div>
  );
}
