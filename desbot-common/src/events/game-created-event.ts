import { Subjects } from './subjects';

export interface GameCreatedEvent {
  subject: Subjects.GameCreated;
  data: {
    id: string;
    title: string;
    bggNumber?: number;
  };
}
