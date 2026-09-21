/**
 * 扎实的 ComfyUI 节点调度系统 (Node Dispatcher)
 * 用于连接 Next.js 后端与 GPU 服务器上的 ComfyUI Headless 引擎
 */

const COMFYUI_SERVER = process.env.COMFYUI_SERVER_URL || "http://127.0.0.1:8188"; // 默认本地，实际线上填真实的 GPU 服务器 IP

export class ComfyUIDispatcher {
  /**
   * 提交生成任务到 ComfyUI
   * @param workflow JSON 格式的 ComfyUI 节点连线图
   * @returns prompt_id 任务ID
   */
  static async submitTask(workflow: any): Promise<string> {
    try {
      const response = await fetch(`${COMFYUI_SERVER}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow }),
      });
      
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`ComfyUI 提交失败: ${err}`);
      }

      const data = await response.json();
      return data.prompt_id;
    } catch (error) {
      console.error("[ComfyUI] 提交任务异常:", error);
      throw error;
    }
  }

  /**
   * 轮询获取任务结果 (History)
   * 生产环境中更推荐使用 WebSocket 监听，但 HTTP 轮询在 Serverless 环境下更稳健
   */
  static async getTaskResult(promptId: string): Promise<{ status: 'pending' | 'success' | 'failed', imageUrl?: string }> {
    try {
      const response = await fetch(`${COMFYUI_SERVER}/history/${promptId}`);
      if (!response.ok) throw new Error("获取历史记录失败");
      
      const history = await response.json();
      
      // 如果 history 中存在该 promptId，说明任务已经执行完毕
      if (history[promptId]) {
        const outputs = history[promptId].outputs;
        // 遍历所有输出节点，寻找 SaveImage (通常是节点 9) 输出的图片
        for (const nodeId in outputs) {
          if (outputs[nodeId].images && outputs[nodeId].images.length > 0) {
            const imageInfo = outputs[nodeId].images[0];
            // 组装真实的图片访问地址
            const imageUrl = `${COMFYUI_SERVER}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder}&type=${imageInfo.type}`;
            return { status: 'success', imageUrl };
          }
        }
        return { status: 'failed' }; // 有结果但没图片
      }
      
      // 如果在 history 里没找到，去检查 queue 里是否还在排队
      const queueResponse = await fetch(`${COMFYUI_SERVER}/queue`);
      const queue = await queueResponse.json();
      const inQueue = [...queue.queue_running, ...queue.queue_pending].some((q: any) => q[1] === promptId);
      
      if (inQueue) {
        return { status: 'pending' };
      }

      return { status: 'failed' }; // 既不在历史也不在队列，任务丢失或报错
    } catch (error) {
      console.error("[ComfyUI] 查询结果异常:", error);
      return { status: 'pending' }; // 网络波动暂视为 pending
    }
  }
}
