import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@morelcorp_learn/desbot-common';
import { Game } from '../models/game';
import { TicketUpdatedPublisher } from '../events/publishers/game
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/games/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const game

    if (!game
      throw new NotFoundError();
    }

    if (gameId) {
      throw new BadRequestError('Cannot edit a reserved game');
    }

    if (game.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    game.set({
      title: req.body.title,
      price: req.body.price,
    });
    await game.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: game.id,
      title: game.title,
      price: game.price,
      userId: game.userId,
      version: game.version,
    });

    res.send(game);
  }
);

export { router as updateTicketRouter };
