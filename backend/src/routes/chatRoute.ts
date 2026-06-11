import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { Router, type Request, type Response } from 'express';
import { createRecord } from '../services/recordService';

const router = Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

// YYYY-MM-DD HH:MM:SS
const today = new Date().toISOString().split('T')[0];

const prompt = `请你分析一下我的输入，如果是消费或者支出记录，则按照json格式返回，不然正常返回。json格式为：{
  "title": "消费或支出记录的标题",
  "amount": "消费或支出记录的金额",
  "createdAt": "消费或支出记录的创建时间"
}，规则如下：
1.如果是消费，则amount是负数，如果是收入，则amount是正数。
2.如果是支出，则title是消费的商品或者服务，如果是收入，则title是收入的来源，如果分析不出来，则填其他
3.今天是${today}，如果能分析出日期，则date是日期，否则为今天`;

router.post('/', async (_req: Request, res: Response) => {

const {messages, user_id} = _req.body;

let resJson = {
  text: '',
  records: []
}

try {

  const result = await generateText({
    model: deepSeek('deepseek-chat'),
    prompt: prompt,
    messages: messages,
  });

  const record = parseResult(result.text);
  if (record) {
    // save to database
    await createRecord({
      userId: user_id,
      title: record.title,
      amount: record.amount,
      createdAt: record.createdAt,
    });
    resJson.records = record;
  } else {
    resJson.text = result.text;
  }

  res.status(200).json(resJson);
  return;
} catch (error) {
  console.error(error);
  res.status(500).json(resJson);
  return;
}
});

const parseResult = (result: string) => {
  try {
    // 清理一下可能存在的markdown格式
    const cleanResult = result.replace(/```json/g, '').replace(/```/g, '');
    const parsedResult = JSON.parse(cleanResult);
    if (parsedResult.amount && parsedResult.title && parsedResult.createdAt) {
      return parsedResult;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default router;
