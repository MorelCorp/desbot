import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the game is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/games/${id}`).send().expect(404);
});

it('returns a 200 if the game is found', async () => {
  const title = 'Superb Game';

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  const gameameResponse = await request(app)
    .get(`/api/games/${response.body.id}`)
    .send()
    .expect(200);

  expect(gameameResponse.body.title).toEqual(title);
});
