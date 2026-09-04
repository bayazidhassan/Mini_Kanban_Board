import cors from 'cors';
import express from 'express';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFoundRoute from './middlewares/notFoundRoute';
import router from './routes';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
);

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello Kanban Board!');
});

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
