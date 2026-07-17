/**
 * 基于 fetch 的 OpenAI 兼容 API 调用。
 */

export interface LlmOptions {
  /** API Key；留空则使用 fallback */
  apiKey?: string;
  /** 基础 URL，默认 OpenAI */
  baseUrl?: string;
  /** 模型名称 */
  model?: string;
  /** 最大 token */
  maxTokens?: number;
  /** 温度 */
  temperature?: number;
}

export interface LlmResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export async function callOpenAICompatible(
  prompt: string,
  options: LlmOptions = {}
): Promise<LlmResponse> {
  const {
    apiKey = process.env.OPENAI_API_KEY,
    baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
    model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
    maxTokens = 4096,
    temperature = 0.7,
  } = options;

  if (!apiKey) {
    throw new Error('缺少 LLM API Key。请提供 apiKey 参数或设置 OPENAI_API_KEY 环境变量。');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是一个专业的演示文稿规划助手。' },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'unknown');
    throw new Error(`LLM 请求失败 (${response.status}): ${text}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('LLM 返回内容为空');
  }

  return {
    content,
    usage: {
      promptTokens: json.usage?.prompt_tokens,
      completionTokens: json.usage?.completion_tokens,
      totalTokens: json.usage?.total_tokens,
    },
  };
}
