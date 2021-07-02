import request from 'supertest';
import { app } from '../../app';
import { Game } from '../../models/game';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/games for post requests', async () => {
  const response = await request(app).post('/api/games').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/games').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasfas',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasfasdf',
    })
    .expect(400);
});

it('creates a game with valid inputs', async () => {
  let games = await Game.find({});
  expect(games.length).toEqual(0);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'asdfasdff',
      price: 20,
    })
    .expect(201);

  games = await Game.find({});
  expect(games.length).toEqual(1);
  expect(games[0].price).toEqual(20);
});

it('publishes an event', async () => {
  const title = 'asdfasdfa';

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
