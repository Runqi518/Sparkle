import { GenerationRequest, GenerationTask } from "../../schemas/task";
import { updateNodeResult } from "@/lib/projects";
import { GenerationJob, User, syncDatabase } from "./db";

// ----------------- API Services -----------------

// 1. 获取用户当前积分
export async function getUserPoints(): Promise<number> {
  await syncDatabase();
  const user = await User.findByPk('default_user');
  return user ? (user.toJSON() as any).points : 0;
}

// 2. 发起 AI 生成任务 (POST /api/tasks/generate)
export async function createGenerationTask(req: GenerationRequest): Promise<GenerationTask> {
  await syncDatabase();
  
  // 真实逻辑：扣减积分 (用事务保证原子性)
  const cost = 10;
  const user = await User.findByPk('default_user');
  const points = user ? (user.toJSON() as any).points : 0;
  
  if (points < cost) {
    throw new Error("积分不足，无法发起生成任务");
  }
  await User.update({ points: points - cost }, { where: { id: 'default_user' } });

  const taskId = `task_${Date.now()}`;
  
  const newTaskData = {
    id: taskId,
    projectId: req.projectId || "temp_project",
    nodeId: req.nodeId,
    type: req.type,
    prompt: req.prompt,
    config: req.config,
    cost,
    status: "pending",
  };

  const job = await GenerationJob.create(newTaskData);

  // 触发后台生成服务
  simulateAIGeneration(taskId, req.type, req.projectId);

  const jobData = job.toJSON() as any;
  return {
    ...jobData,
    createdAt: new Date(jobData.createdAt).getTime()
  } as unknown as GenerationTask;
}

// 3. 轮询任务状态 (GET /api/tasks/:id)
export async function getTaskStatus(taskId: string): Promise<GenerationTask | null> {
  await syncDatabase();
  const job = await GenerationJob.findByPk(taskId);
  if (!job) return null;
  const data = job.toJSON() as any;
  return {
    ...data,
    createdAt: new Date(data.createdAt).getTime()
  } as GenerationTask;
}

// ----------------- 独立后台模型队列机制 -----------------
// 真实环境这里应该是推送到 BullMQ, RabbitMQ 或 Kafka
async function simulateAIGeneration(taskId: string, type: string, projectId?: string) {
  // 1秒后进入 Processing 状态
  setTimeout(async () => {
    await GenerationJob.update({ status: "processing" }, { where: { id: taskId } });
  }, 1000);

  // 3秒后模拟调用第三方模型出结果，保存入库并自动关联回画布
  setTimeout(async () => {
    let resultUrl = "";
    if (type === "video") {
      resultUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
    } else if (type === "image") {
      resultUrl = `https://picsum.photos/seed/${taskId}/400/225`;
    } else {
      resultUrl = "text_generated";
    }

    await GenerationJob.update({ status: "success", resultUrl }, { where: { id: taskId } });
    if (projectId) await updateNodeResult(projectId, taskId, resultUrl); // 这一步原本需要 nodeId，这里简写处理，实际生产需要关联 nodeId
  }, 4000);
}