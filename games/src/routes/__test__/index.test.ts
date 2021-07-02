import request from 'supertest';
import { app } from '../../app';
import { createTicketRouter } from '../new';

const createTicket = () => {
  return request(app).post('/api/games').set('Cookie', global.signin()).send({
    title: 'asdffgasdfasd',
    price: 20,
  });
};

it('can fetch a list of games', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/games').send().expect(200);

  expect(response.body.length).toEqual(3);
});
