# 技术拆解和实施计划 (Plan)

## 阶段一：项目初始化与基础设施铺设 (当前阶段)
- [x] 初始化 Next.js 全栈项目（App Router, TypeScript, TailwindCSS）。
- [x] 建立指定的目录与文档规范。
- [ ] 确定并配置项目的 UI 主题色板（根据目标截图）。

## 阶段二：需求分析与原型推演
- [ ] 借助 Seal Browser 登录 cowork.xiaohongshu.com。
- [ ] 走通一遍“创建作品”的工作流（不发布），记录所有输入项、状态和后端交互接口。
- [ ] 完善 `spec.md`。

## 阶段三：前端静态还原与 UI 改造
- [ ] 提取 "Sparkle" 的米白/浅色调，修改 Tailwind 配置。
- [ ] 编写公共组件（按钮、表单、侧边栏、卡片等）。
- [ ] 组装各个页面视图。

## 阶段四：后端 API 与逻辑联调
- [ ] 根据记录的业务流，设计 `schemas/`（Zod 等数据结构）。
- [ ] 编写 `src/api/` 的 Next.js API Routes (或 Server Actions)。
- [ ] 实现对应的数据库或 Mock DB 层交互 (`migrations/` 等)。

## 阶段五：测试与验收
- [ ] 走查各项功能是否对齐。
- [ ] 提交桌面版的代码交付物。
