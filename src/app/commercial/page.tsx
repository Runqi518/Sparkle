"use client";

import { useState, useEffect } from "react";
import {
  Plus, Package, Megaphone, HandCoins, Gamepad2, Crown,
  Sparkles, Link2, LayoutTemplate, ArrowRight, X, ChevronRight
} from "lucide-react";
import { TopNav } from "@/components/TopNav";

// ---------- 类型定义 ----------
type Subject = {
  id: string;
  name: string;
  type: "product" | "campaign" | "service" | "ip" | "brand";
  brief: string;
  sellingPoints: string[];
  targetAudience: string;
  createdAt: string;
};

const TYPE_META: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  product:  { label: "实物商品", icon: Package,    color: "text-pink-300",   bg: "bg-pink-500/10 border-pink-500/20" },
  campaign: { label: "品牌活动", icon: Megaphone,  color: "text-purple-300", bg: "bg-purple-500/10 border-purple-500/20" },
  service:  { label: "服务",     icon: HandCoins,  color: "text-blue-300",   bg: "bg-blue-500/10 border-blue-500/20" },
  ip:       { label: "内容/IP",  icon: Gamepad2,   color: "text-green-300",  bg: "bg-green-500/10 border-green-500/20" },
  brand:    { label: "品牌",     icon: Crown,      color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

// ---------- Mock：链路二/三的示意数据 ----------
const MOCK_UNMATCHED_ASSETS = [
  { id: "a1", type: "video", name: "穿耐克鞋的狗.mp4", thumb: "https://picsum.photos/seed/dog1/400/225", match: { name: "Nike Air Max 春季上新", score: 92 } },
  { id: "a2", type: "image", name: "赛博朋克城市夜景.png", thumb: "https://picsum.photos/seed/cyber2/400/225", match: { name: "《幻塔》手游买量", score: 87 } },
];

const MOCK_TEMPLATES = [
  { id: "t1", name: "电商爆款带货三件套", desc: "脚本 → 主视觉 → 带货短视频", author: "Sparkle 官方", uses: 1286, price: 0, nodes: ["脚本", "图片", "视频"] },
  { id: "t2", name: "游戏买量裂变流", desc: "角色文案 → 场景图 × 4 → 15s 买量视频", author: "增长工作室", uses: 342, price: 19, nodes: ["脚本", "图片×4", "视频"] },
  { id: "t3", name: "品牌 Campaign 全套物料", desc: "KV → 倒计时海报 → 官宣视频", author: "4A 创意组", uses: 98, price: 49, nodes: ["KV", "海报", "视频"] },
];

export default function CommercialPage() {
  const [activeTab, setActiveTab] = useState<"subjects" | "match" | "market">("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      if (data.subjects) setSubjects(data.subjects);
    } catch (e) {}
  };

  useEffect(() => { fetchSubjects(); }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      <TopNav />

      <main className="flex-1 overflow-y-auto px-8 py-8">
        {/* 页面头 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2">商业化中心</h1>
          <p className="text-sm text-glass-muted font-light">
            让每一份创意都直接对接生意：生成素材 · 匹配标的 · 模板复用
          </p>
        </div>

        {/* 概览统计 */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "营销标的", value: subjects.length, icon: Package },
            { label: "挂接素材", value: 12, icon: Link2 },
            { label: "可复用模板", value: MOCK_TEMPLATES.length, icon: LayoutTemplate },
            { label: "累计回流数据", value: "—", icon: Sparkles },
          ].map((s) => (
            <div key={s.label} className="glass-black rounded-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl glass-silver flex items-center justify-center">
                <s.icon className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-[11px] text-glass-muted tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {[
            { key: "subjects", label: "营销标的", hint: "链路一 · 需求驱动" },
            { key: "match", label: "素材找货", hint: "链路二 · 内容先行" },
            { key: "market", label: "模板市场", hint: "链路三 · 模板流通" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-5 py-2.5 rounded-xl text-sm transition-all ${
                activeTab === t.key
                  ? "glass-silver text-white font-medium"
                  : "text-glass-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {t.label}
              <span className="ml-2 text-[10px] opacity-60">{t.hint}</span>
            </button>
          ))}
        </div>

        {/* ===== Tab 1: 营销标的 ===== */}
        {activeTab === "subjects" && (
          <div className="grid grid-cols-3 gap-5">
            {/* 新建卡片 */}
            <div
              onClick={() => setShowCreate(true)}
              className="min-h-[220px] rounded-2xl border-2 border-dashed border-white/15 hover:border-pink-500/50 flex flex-col items-center justify-center cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-pink-500/20 transition-colors">
                <Plus className="w-6 h-6 text-white/60 group-hover:text-pink-300" />
              </div>
              <span className="text-sm text-white/80">新建营销标的</span>
              <span className="text-[10px] text-glass-muted mt-1">商品 / Campaign / 服务 / IP / 品牌</span>
            </div>

            {subjects.map((s) => {
              const meta = TYPE_META[s.type] || TYPE_META.product;
              return (
                <div key={s.id} className="glass-black glass-hover rounded-2xl p-5 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium ${meta.bg} ${meta.color}`}>
                      <meta.icon className="w-3 h-3" />
                      {meta.label}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-white mb-1.5">{s.name}</h3>
                  <p className="text-xs text-glass-muted font-light line-clamp-2 mb-3 flex-1">{s.brief}</p>

                  {s.sellingPoints?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {s.sellingPoints.slice(0, 3).map((p) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">{p}</span>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-white/40 mb-4">目标人群：{s.targetAudience || "未设置"}</div>

                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-medium tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
                    <Sparkles className="w-3.5 h-3.5" />
                    一键生成素材画布
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== Tab 2: 素材找货（链路二） ===== */}
        {activeTab === "match" && (
          <div>
            <p className="text-xs text-glass-muted mb-5 font-light">
              你在画布里生成的好内容，系统会自动推荐契合的营销标的。一键挂接后，即可成为该标的的素材模板供二创复用。
            </p>
            <div className="grid grid-cols-2 gap-5">
              {MOCK_UNMATCHED_ASSETS.map((a) => (
                <div key={a.id} className="glass-black rounded-2xl overflow-hidden flex group hover:border-pink-500/30 border border-white/5 transition-all">
                  <div className="w-44 h-32 flex-shrink-0 relative overflow-hidden">
                    <img src={a.thumb} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] text-white/80 uppercase">
                      {a.type}
                    </span>
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-sm text-white/90 mb-2">{a.name}</div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-glass-muted">智能匹配：</span>
                        <span className="text-pink-300">{a.match.name}</span>
                        <span className="text-green-300 font-medium">{a.match.score}% 契合</span>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${a.match.score}%` }} />
                      </div>
                    </div>
                    <button className="mt-3 self-start px-4 py-1.5 rounded-lg glass-pink text-xs text-white flex items-center gap-1.5 hover:bg-pink-500/30 transition-colors">
                      <Link2 className="w-3.5 h-3.5" />
                      一键挂接为素材模板
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== Tab 3: 模板市场（链路三） ===== */}
        {activeTab === "market" && (
          <div>
            <p className="text-xs text-glass-muted mb-5 font-light">
              跑通的工作流就是资产。打包上架你的画布模板，其他用户填充自己的标的信息即可批量复用，作者获得分成。
            </p>
            <div className="grid grid-cols-3 gap-5">
              {MOCK_TEMPLATES.map((t) => (
                <div key={t.id} className="glass-black glass-hover rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center gap-1 mb-4 flex-wrap">
                    {t.nodes.map((n, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-[10px] text-white/80">{n}</span>
                        {i < t.nodes.length - 1 && <ChevronRight className="w-3 h-3 text-white/30" />}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">{t.name}</h3>
                  <p className="text-xs text-glass-muted font-light mb-4 flex-1">{t.desc}</p>
                  <div className="flex items-center justify-between text-[11px] text-white/40 mb-4">
                    <span>by {t.author}</span>
                    <span>{t.uses} 次使用</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl glass-silver text-white text-xs font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-1.5">
                    {t.price > 0 ? `¥${t.price} 解锁使用` : "免费使用"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 新建标的 Modal */}
      {showCreate && <CreateSubjectModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); fetchSubjects(); }} />}
    </div>
  );
}

// ---------- 新建营销标的弹窗 ----------
function CreateSubjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", type: "product", brief: "", sellingPoints: "", targetAudience: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("请填写标的名称");
    setSubmitting(true);
    try {
      await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sellingPoints: form.sellingPoints.split(/[,，]/).map(s => s.trim()).filter(Boolean),
        }),
      });
      onCreated();
    } catch (e) {
      alert("创建失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <div className="glass-black rounded-2xl w-[480px] p-6 border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-white">新建营销标的</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] text-glass-muted tracking-wider block mb-1.5">标的类型</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(TYPE_META).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, type: key })}
                  className={`py-2 rounded-xl border text-[10px] flex flex-col items-center gap-1 transition-all ${
                    form.type === key ? `${meta.bg} ${meta.color} border-current` : "border-white/10 text-white/40 hover:border-white/30"
                  }`}
                >
                  <meta.icon className="w-4 h-4" />
                  {meta.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-glass-muted tracking-wider block mb-1.5">标的名称</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="如：Nike Air Max 春季上新"
              className="w-full text-sm p-3 glass-silver bg-black/20 rounded-xl focus:outline-none focus:border-pink-500/50 placeholder:text-white/20 font-light"
            />
          </div>

          <div>
            <label className="text-[11px] text-glass-muted tracking-wider block mb-1.5">Brief / 标的描述</label>
            <textarea
              value={form.brief}
              onChange={e => setForm({ ...form, brief: e.target.value })}
              rows={3}
              placeholder="把甲方需求或推广目标贴进来，生成时会作为上下文"
              className="w-full text-sm p-3 glass-silver bg-black/20 rounded-xl focus:outline-none focus:border-pink-500/50 placeholder:text-white/20 font-light resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-glass-muted tracking-wider block mb-1.5">卖点（逗号分隔）</label>
              <input
                value={form.sellingPoints}
                onChange={e => setForm({ ...form, sellingPoints: e.target.value })}
                placeholder="气垫缓震, 轻量化"
                className="w-full text-sm p-3 glass-silver bg-black/20 rounded-xl focus:outline-none focus:border-pink-500/50 placeholder:text-white/20 font-light"
              />
            </div>
            <div>
              <label className="text-[11px] text-glass-muted tracking-wider block mb-1.5">目标人群</label>
              <input
                value={form.targetAudience}
                onChange={e => setForm({ ...form, targetAudience: e.target.value })}
                placeholder="18-30岁运动人群"
                className="w-full text-sm p-3 glass-silver bg-black/20 rounded-xl focus:outline-none focus:border-pink-500/50 placeholder:text-white/20 font-light"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-medium tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {submitting ? "创建中..." : "创建标的"}
          </button>
        </div>
      </div>
    </div>
  );
}
