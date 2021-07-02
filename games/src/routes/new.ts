import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@morelcorp_learn/desbot-common';
import { Game } from '../models/game';
import { TicketCreatedPublisher } from '../events/publishers/game-created-publisher';
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

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: game.id,
      title: game.title,
      price: game.price,
      userId: game.userId,
      version: game.version,
    });

    res.status(201).send(game);
  }
);

export { router as createTicketRouter };
