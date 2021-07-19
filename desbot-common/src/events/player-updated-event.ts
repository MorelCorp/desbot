import { Subjects } from './subjects';

export interface PlayerUpdatedEvent {
  subject: Subjects.PlayerUpdated;
  data: {
    id: string;
    name: string;
    userID?: string;
  };
}
