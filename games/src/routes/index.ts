import express, { Request, Response } from 'express';
import { Game } from '../models/game';

const router = express.Router();

router.get('/api/games', async (req: Request, res: Response) => {
  const games = await Game.find({});

  res.send(games);
});

export { router as indexTicketRouter };
