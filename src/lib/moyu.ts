export class MoyuClient {
  static get apiKey() {
    return process.env.MOYU_API_KEY || "";
  }

  static get baseUrl() {
    return "https://www.moyu.info/v1";
  }

  // 1. 文本生成 (默认走低成本大模型，如 gpt-3.5-turbo 兼容接口)
  static async generateText(prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // 或者你平台上的超低成本模型 ID
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices[0].message.content;
  }

  // 2. 图像生成 (gemini-3-pro-image-preview)
  static async generateImage(prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gemini-3-pro-image-preview",
        prompt: prompt
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.data[0].url;
  }

  // 3. 视频任务提交
  static async submitVideoTask(prompt: string, imageUrl?: string): Promise<string> {
    const payload: any = {
      model: "doubao-seedance-2-0-260128", // 根据网关实际可用的真实模型 ID 替换
      prompt: prompt,
      duration: 5,
      generate_audio: false
    };

    if (imageUrl && imageUrl.startsWith('http')) {
      payload.images = [imageUrl];
    }

    const res = await fetch(`${this.baseUrl}/video/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.task_id;
  }

  // 4. 视频任务轮询
  static async pollVideoTask(taskId: string): Promise<{status: 'pending'|'success'|'failed', url?: string}> {
    const res = await fetch(`${this.baseUrl}/video/generations/${taskId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`
      }
    });
    
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    const data = json.data;

    if (data.status === "SUCCESS") {
      return { status: "success", url: data.result_url };
    } else if (data.status === "FAILURE") {
      return { status: "failed" };
    } else {
      return { status: "pending" };
    }
  }
}
