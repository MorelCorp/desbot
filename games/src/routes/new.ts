import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@morelcorp/desbot-common';
import { Game } from '../models/game';
import { GameCreatedPublisher } from '../events/publishers/game-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/games',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greated than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const game = Game.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await game.save();

    new GameCreatedPublisher(natsWrapper.client).publish({
      id: game.id,
      title: game.title,
    });

    res.status(201).send(game);
  }
);

export { router as createGameRouter };
