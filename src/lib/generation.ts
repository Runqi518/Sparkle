import { GenerationRequest, GenerationTask } from "../../schemas/task";

// ----------------- Mock DB / In-Memory Store -----------------
// 在真实的生产环境中，这些数据应该存储在 Postgres/MySQL/Redis 中
const tasksDB: Map<string, GenerationTask> = new Map();
let currentPoints = 100; // 初始积分

// ----------------- API Services -----------------

// 1. 获取用户当前积分
export async function getUserPoints(): Promise<number> {
  await new Promise(r => setTimeout(r, 200));
  return currentPoints;
}

// 2. 发起 AI 生成任务 (POST /api/tasks/generate)
export async function createGenerationTask(req: GenerationRequest): Promise<GenerationTask> {
  await new Promise(r => setTimeout(r, 500)); // 模拟网络延迟
  
  // 真实逻辑：扣减积分
  const cost = 10;
  if (currentPoints < cost) {
    throw new Error("积分不足，无法发起生成任务");
  }
  currentPoints -= cost;

  const taskId = `task_${Date.now()}`;
  
  const newTask: GenerationTask = {
    id: taskId,
    nodeId: req.nodeId,
    status: "pending",
    prompt: req.prompt,
    cost,
    createdAt: Date.now(),
  };

  tasksDB.set(taskId, newTask);

  // 异步执行生成过程 (模拟 AI 引擎工作流)
  simulateAIGeneration(taskId, req.type);

  return newTask;
}

// 3. 轮询任务状态 (GET /api/tasks/:id)
export async function getTaskStatus(taskId: string): Promise<GenerationTask | null> {
  await new Promise(r => setTimeout(r, 200));
  return tasksDB.get(taskId) || null;
}

// ----------------- 内部 Mock 引擎 -----------------
function simulateAIGeneration(taskId: string, type: string) {
  const task = tasksDB.get(taskId);
  if (!task) return;

  // 1秒后进入 Processing 状态
  setTimeout(() => {
    task.status = "processing";
    tasksDB.set(taskId, { ...task });
  }, 1000);

  // 3秒后生成完成，返回 Mock 资源 URL
  setTimeout(() => {
    task.status = "success";
    
    // 根据不同的类型返回不同的 Mock 媒体
    if (type === "video") {
      // 使用 W3C 提供的公共测试视频
      task.resultUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    } else if (type === "image") {
      // 使用 Placehold 随机图片
      task.resultUrl = `https://picsum.photos/seed/${taskId}/400/225`;
    } else {
      // 文本结果，不需要 URL，直接写进 prompt 或者别的字段，这里简单模拟
      task.resultUrl = "text_generated";
    }

    tasksDB.set(taskId, { ...task });
  }, 4000); // 4秒完成，类似真实模型等待时间
}
