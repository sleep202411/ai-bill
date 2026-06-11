import express from 'express';
import type { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import chatRoute from './routes/chatRoute';
import recordRoute from './routes/recordRoute';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8001;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.use('/chat', chatRoute);
app.use('/records', recordRoute);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
