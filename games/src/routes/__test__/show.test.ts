import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the game is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/games/${id}`).send().expect(404);
});

it('returns a 404 if the game is not found', async () => {
  const title = 'Concert Game';
  const price = 20;

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const gameameResponse = await request(app)
    .get(`/api/games/${response.body.id}`)
    .send()
    .expect(200);

  expect(gameameResponse.body.title).toEqual(title);
  expect(gameameResponse.body.price).toEqual(price);
});
