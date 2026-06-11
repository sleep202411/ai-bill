import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { Router, type Request, type Response } from 'express';

const router = Router();

const deepSeek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

router.post('/', async (_req: Request, res: Response) => {
  const result = await generateText({
    model: deepSeek('deepseek-chat'),
    prompt: 'hello',
  });

  res.json(result);
});

export default router;
