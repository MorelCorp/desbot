import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Game } from '../../models/game';

it('returns a 404 if id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/games/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asasdfasdf',
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/games/${id}`)
    .send({
      title: 'asasdfasdf',
    })
    .expect(401);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
    });

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'superb new title',
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
