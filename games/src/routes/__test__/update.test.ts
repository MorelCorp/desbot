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
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/games/${id}`)
    .send({
      title: 'asasdfasdf',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the game', async () => {
  const response = await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdfasdf',
      price: 20,
    });

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ddddffff',
      price: 45,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
    })
    .expect(400);
});

it('updates the game provided valid input', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'superb new title',
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/games/${response.body.id}`)
    .send({});

  expect(ticketResponse.body.title).toEqual('superb new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'superb new title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the game is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/games')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  const game = await Game.findById(response.body.id);
  game!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await game!.save();

  await request(app)
    .put(`/api/games/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'superb new title',
      price: 100,
    })
    .expect(400);
});
