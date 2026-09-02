import cors from 'cors';
import express from 'express';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Hello Kanban Board!');
});

export default app;
