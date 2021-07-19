import { Subjects } from './subjects';

export interface PlayerCreatedEvent {
  subject: Subjects.PlayerCreated;
  data: {
    id: string;
    name: string;
    userID?: string;
  };
}
