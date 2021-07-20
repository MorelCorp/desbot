import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@morelcorp/desbot-common';
import { Game, PLACEHOLDER_THUMBNAIL } from '../models/game';
import { GameCreatedPublisher } from '../events/publishers/game-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/games',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      title,
      bggId = '0', //default empty if undefined
      thumbnail = PLACEHOLDER_THUMBNAIL, //default placeholder if undefined
    } = req.body;

    const game = Game.build({
      title,
      bggId,
      thumbnail,
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
