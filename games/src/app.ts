import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createGameRouter } from './routes/new';
import { showGameRouter } from './routes/show';
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@morelcorp/desbot-common';
import { indexGameRouter } from './routes/index';
import { updateGameRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(showGameRouter);
app.use(createGameRouter);
app.use(indexGameRouter);
app.use(updateGameRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
