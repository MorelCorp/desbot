import request from 'supertest';
import { app } from '../../app';
import { createGameRouter } from '../new';

const createGame = () => {
  return request(app).post('/api/games').set('Cookie', global.signin()).send({
    title: 'Generic Title: The Game',
  });
};

it('can fetch a list of games', async () => {
  await createGame();
  await createGame();
  await createGame();

  const response = await request(app).get('/api/games').send().expect(200);

  expect(response.body.length).toEqual(3);
});
