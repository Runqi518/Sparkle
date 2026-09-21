# ✨ Sparkle | AI 创意素材工坊

> **Boundless ideas. Tangible results.**

Sparkle 是一款面向未来的 AI 创意素材工作流引擎。它将极客美学与前沿 AI 生成能力完美融合，通过无限节点画布，帮助创作者和商业团队将一个灵感（Idea）迅速扩展、编排并转化为可变现的视觉与视频资产（Asset）。

<div align="center">
  <img src="./public/hero.png?v=2" alt="Sparkle Hero UI" width="100%" />
</div>

## 🌟 核心特性 (Key Features)

- **♾️ 无限节点画布 (Node-based Canvas)**
  基于 React Flow 打造的流畅画布。自由拖拽、连接、编排你的“灵感”、“素材”与“增长”节点，构建复杂的商业化工作流。
- **💎 极致暗黑玻璃美学 (Glassmorphism Dark UI)**
  深邃的黑银配色，搭配动态流体粒子特效 (Fluid Particles) 与故障艺术 (Glitch Art) 标题，提供沉浸式的创作体验。
- **🚀 生成 -> 编排 -> 变现**
  - **生成 (Generate)**: 接入大模型能力，一句话生成丰富的图文与视频素材。
  - **编排 (Compose)**: 在直观的画板中自由组合素材链路。
  - **变现 (Monetize)**: 极简的导出与商业化对接（规划中）。
- **🗄️ 真实持久化后台 (Real Backend)**
  摒弃假数据 mock，内置 SQLite + Sequelize ORM，提供完整、稳健的本地项目与画布数据持久化存储。

## 🛠️ 技术栈 (Tech Stack)

- **核心框架**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI & 样式**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **可视化画布**: [React Flow](https://reactflow.dev/)
- **数据库 & ORM**: SQLite3, [Sequelize](https://sequelize.org/)
- **语言**: TypeScript

## 🚀 快速开始 (Getting Started)

### 1. 安装依赖
```bash
npm install
```

### 2. 初始化/同步数据库
系统会在首次运行时自动根目录下创建 `database.sqlite` 并完成建表。

### 3. 启动开发服务器
```bash
npm run dev
```

启动后，在浏览器中访问 [http://localhost:3000](http://localhost:3000) 即可进入 Sparkle 工作坊。

## 📁 核心目录结构

```text
Sparkle/
├── src/
│   ├── app/                # Next.js App Router 页面与 API 路由
│   ├── components/         # 全局复用组件 (FluidParticleText, TopNav, Modal 等)
│   ├── lib/                # 核心逻辑 (数据库配置 db/index.ts, 辅助函数等)
│   └── schemas/            # TypeScript 类型定义与 Zod 校验
├── public/                 # 静态资源 (背景图、Logo 等)
├── database.sqlite         # 本地 SQLite 数据库文件 (运行时生成)
└── tailwind.config.ts      # Tailwind CSS 主题配置
```
