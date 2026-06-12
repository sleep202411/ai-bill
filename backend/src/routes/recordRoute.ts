import { Router } from 'express';

import { getRecords } from '../services/recordService';

const router = Router();

router.post('/', async (req, res) => {
  const { user_id, date } = req.body; // date format: YYYY-MM-DD

  try {
    const records = await getRecords(user_id, date);
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
