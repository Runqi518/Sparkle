"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { Box, FileText, Image as ImageIcon, Plus, Save, Sparkles, Video, ChevronLeft } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { TopNav } from "@/components/TopNav";
import { CustomNode } from "@/components/canvas/CustomNode";
import Link from "next/link";

const nodeTypes = { custom: CustomNode };

type Project = {
  id: string;
  name: string;
  industry: string;
  nodesCount: number;
  canvas: { nodes: Node[]; edges: Edge[] };
};

function Canvas() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "无法加载项目");
        return;
      }
      const canvasNodes = (data.project?.canvas?.nodes || []).map((node: Node) => ({
        ...node,
        data: { ...node.data, projectId: data.project.id },
      }));
      setProject(data.project);
      setNodes(canvasNodes);
      setEdges(data.project?.canvas?.edges || []);
    })();
  }, [id, setEdges, setNodes]);

  const save = useCallback(async (nextNodes = nodes, nextEdges = edges) => {
    setIsSaving(true);
    const response = await fetch(`/api/projects/${id}/canvas`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodes: nextNodes, edges: nextEdges }),
    });
    setIsSaving(false);
    if (!response.ok) setError("保存画布失败");
  }, [edges, id, nodes]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((currentEdges) => {
      const nextEdges = addEdge({ ...connection, animated: true }, currentEdges);
      void save(nodes, nextEdges);
      return nextEdges;
    });
  }, [nodes, save, setEdges]);

  const addNode = (nodeKind: "text" | "image" | "video") => {
    const node: Node = {
      id: `node_${Date.now()}`,
      type: "custom",
      position: { x: 250 + nodes.length * 40, y: 150 + nodes.length * 35 },
      data: {
        label: nodeKind === "text" ? "编写脚本" : nodeKind === "image" ? "生成图片" : "生成视频",
        type: nodeKind,
        nodeKind,
        projectId: id,
      },
    };
    const nextNodes = [...nodes, node];
    setNodes(nextNodes);
    void save(nextNodes, edges);
  };

  if (error) return <div className="h-full grid place-items-center text-sm text-pink-200">{error}</div>;
  if (!project) return <div className="h-full grid place-items-center text-sm text-glass-muted">正在加载项目画布…</div>;

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={() => void save()}
        fitView
      >
        <Background color="rgba(255,255,255,0.06)" gap={20} size={2} />
        <Controls showInteractive={false} />
      </ReactFlow>

      <div className="absolute left-6 top-6 z-10 glass-black p-2 rounded-2xl flex flex-col gap-1 border border-white/10">
        <button onClick={() => addNode("text")} className="p-2 rounded-xl hover:bg-white/10 text-glass-muted hover:text-white flex flex-col items-center gap-1 text-[9px]"><FileText className="w-4 h-4" /><span>脚本</span></button>
        <button onClick={() => addNode("image")} className="p-2 rounded-xl hover:bg-white/10 text-glass-muted hover:text-white flex flex-col items-center gap-1 text-[9px]"><ImageIcon className="w-4 h-4" /><span>图片</span></button>
        <button onClick={() => addNode("video")} className="p-2 rounded-xl hover:bg-white/10 text-glass-muted hover:text-white flex flex-col items-center gap-1 text-[9px]"><Video className="w-4 h-4" /><span>视频</span></button>
        <button onClick={() => void save()} className="p-2 rounded-xl hover:bg-white/10 text-glass-muted hover:text-white flex flex-col items-center gap-1 text-[9px] border-t border-white/10 mt-1 pt-2"><Save className="w-4 h-4" /><span>{isSaving ? "保存中" : "保存"}</span></button>
      </div>
    </>
  );
}

export default function ProjectCanvasPage() {
  return (
    <div className="flex flex-col h-screen w-screen absolute inset-0 z-50 bg-transparent">
      <TopNav leftContent={<ProjectTitle />} />
      <main className="flex-1 relative">
        <ReactFlowProvider><Canvas /></ReactFlowProvider>
      </main>
    </div>
  );
}

function ProjectTitle() {
  return (
    <div className="flex items-center gap-3 text-xs border-l border-white/10 pl-4 font-light text-white/80">
      <Link href="/" className="flex items-center gap-1 hover:text-white text-glass-muted transition-colors group">
        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        返回工坊
      </Link>
      <div className="w-px h-3 bg-white/10"></div>
      <div className="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
        <Box className="w-3 h-3 text-glass-muted" /><span>项目画布</span>
      </div>
      <span className="text-glass-muted text-[10px] tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-pink-500/50" /> 自动保存
      </span>
    </div>
  );
}
