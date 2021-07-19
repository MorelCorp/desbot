import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@morelcorp/desbot-common';
import { Game } from '../models/game';
import { GameUpdatedPublisher } from '../events/publishers/game-updated-publisher';
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
    const game = await Game.findById(req.params.id);

    if (!game) {
      throw new NotFoundError();
    }

    if (game.orderId) {
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
    new GameUpdatedPublisher(natsWrapper.client).publish({
      id: game.id,
      title: game.title,
    });

    res.send(game);
  }
);

export { router as updateGameRouter };
