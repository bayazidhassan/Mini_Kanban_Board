import cors from 'cors';
import express from 'express';
import notFoundRoute from './middlewares/notFoundRoute';

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

app.use(notFoundRoute);

export default app;
