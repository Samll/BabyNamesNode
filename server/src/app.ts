import express from 'express';

import router from './routes';

const app = express();

app.use(express.json());
app.use('/api', router);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
