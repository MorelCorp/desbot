import {
  Publisher,
  Subjects,
  GameCreatedEvent,
} from '@morelcorp/desbot-common';

export class GameCreatedPublisher extends Publisher<GameCreatedEvent> {
  subject: Subjects.GameCreated = Subjects.GameCreated;
}
