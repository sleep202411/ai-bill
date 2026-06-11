import { Router, type Request, type Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json([]);
});

router.post('/', (req: Request, res: Response) => {
  const { user_id, title, amount } = req.body;

  res.status(201).json({
    id: Date.now(),
    user_id,
    title,
    amount,
    createdAt: new Date().toISOString(),
  });
});

export default router;
