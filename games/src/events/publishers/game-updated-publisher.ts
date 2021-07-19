import {
  Publisher,
  Subjects,
  GameUpdatedEvent,
} from '@morelcorp/desbot-common';
import { natsWrapper } from '../../nats-wrapper';

export class GameUpdatedPublisher extends Publisher<GameUpdatedEvent> {
  subject: Subjects.GameUpdated = Subjects.GameUpdated;
}
