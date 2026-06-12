import { createDeepSeek } from '@ai-sdk/deepseek';
import { convertToModelMessages, streamText } from 'ai';
import { Router, type Request, type Response } from 'express';

import { createRecord } from '../services/recordService';

const router = Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const today = new Date().toISOString().split('T')[0];

const prompt = `你是「小x」记账助手。今天日期：${today}。

## 记账场景（用户说了花了什么、买了什么、收入多少等）
只输出两部分，除此之外一个字都不要：

1. 一句确认语，例如：
   - 已帮你记下「午饭」支出 20 元～
   - 已帮你记下「工资」收入 5000 元～

2. 紧跟一个 json 代码块（系统用，格式固定）：
\`\`\`json
{"title":"午饭","amount":-20,"createdAt":"${today}"}
\`\`\`

记账规则（内化，不要写出来）：
- 支出 amount 为负，收入 amount 为正，单位：元
- title 简短概括消费/收入来源
- createdAt 格式 YYYY-MM-DD，能推断日期就用推断值，否则用今天

严禁：
- 分析过程（如「我来分析一下」「按照规则」）
- 解释字段（如 title、amount、createdAt）
- 列表、分点、markdown 标题
- json 以外的多余文字

## 非记账场景（闲聊、提问等）
正常简短回复，不要输出 json。`;

router.post('/', async (req: Request, res: Response) => {
  const { messages, user_id } = req.body;

  try {
    const result = streamText({
      model: deepSeek('deepseek-chat'),
      system: prompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        const record = parseResult(text);
        if (record && user_id) {
          await createRecord({
            userId: user_id,
            title: record.title,
            amount: Math.round(Number(record.amount) * 100),
            createdAt: new Date(record.createdAt),
          });
        }
      },
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const parseResult = (result: string) => {
  try {
    const jsonBlock = result.match(/```json\s*([\s\S]*?)\s*```/);
    const raw = jsonBlock
      ? jsonBlock[1]
      : result.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedResult = JSON.parse(raw);
    if (parsedResult.amount !== undefined && parsedResult.title && parsedResult.createdAt) {
      return parsedResult;
    }
    return null;
  } catch {
    return null;
  }
};

export default router;
