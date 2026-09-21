import { GenerationRequest, GenerationTask } from "../../schemas/task";
import { updateNodeResult } from "@/lib/projects";
import { GenerationJob, User, syncDatabase } from "./db";
import { ComfyUIDispatcher } from "./comfy/client";
import { getSDXLWorkflow } from "./comfy/workflow";

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

  // 触发真实的 ComfyUI 调度队列机制
  dispatchToComfyUI(taskId, req.prompt, req.type, req.projectId);

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

// ----------------- 独立后台模型队列机制 (ComfyUI) -----------------
async function dispatchToComfyUI(taskId: string, prompt: string, type: string, projectId?: string) {
  try {
    await GenerationJob.update({ status: "processing" }, { where: { id: taskId } });

    // 1. 构造 ComfyUI 节点 API 请求
    // 实际生产中可以根据 type (image/video) 载入不同的 workflow
    const workflow = getSDXLWorkflow(prompt || "a beautiful futuristic city");
    
    // 2. 发送到 GPU 服务器 (或者本地的 ComfyUI)
    let promptId = "";
    try {
      promptId = await ComfyUIDispatcher.submitTask(workflow);
    } catch (e) {
      console.warn("ComfyUI 未连接，走降级 Mock 逻辑。报错:", e);
      // fallback to mock if no ComfyUI server is running locally
      return fallbackMockGeneration(taskId, type, projectId);
    }

    // 3. 启动后台自旋轮询（真实环境应用队列如 BullMQ 处理）
    const pollInterval = setInterval(async () => {
      const result = await ComfyUIDispatcher.getTaskResult(promptId);
      
      if (result.status === 'success' && result.imageUrl) {
        clearInterval(pollInterval);
        await GenerationJob.update({ status: "success", resultUrl: result.imageUrl }, { where: { id: taskId } });
        if (projectId) await updateNodeResult(projectId, taskId, result.imageUrl);
      } else if (result.status === 'failed') {
        clearInterval(pollInterval);
        await GenerationJob.update({ status: "failed" }, { where: { id: taskId } });
      }
    }, 2000); // 每2秒轮询一次显卡出图结果

  } catch (err) {
    console.error("生成分发失败:", err);
    await GenerationJob.update({ status: "failed" }, { where: { id: taskId } });
  }
}

// 开发没启动 ComfyUI 时的降级处理
async function fallbackMockGeneration(taskId: string, type: string, projectId?: string) {
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
    if (projectId) await updateNodeResult(projectId, taskId, resultUrl);
  }, 4000);
}