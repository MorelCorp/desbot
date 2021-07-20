import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@morelcorp/desbot-common';
import { Game, PLACEHOLDER_THUMBNAIL } from '../models/game';
import { GameUpdatedPublisher } from '../events/publishers/game-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/games/:id',
  requireAuth,
  validateRequest,
  async (req: Request, res: Response) => {
    const game = await Game.findById(req.params.id);

    if (!game) {
      throw new NotFoundError();
    }

    const {
      title,
      bggId = '0', //default empty if undefined
      thumbnail = PLACEHOLDER_THUMBNAIL, //default placeholder if undefined
    } = req.body;

    game.set({
      title: title,
      bggId: bggId,
      thumbnail: thumbnail,
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
