import { Subjects } from './subjects';

export interface GameUpdatedEvent {
  subject: Subjects.GameUpdated;
  data: {
    id: string;
    title: string;
    bggNumber?: number;
  };
}
