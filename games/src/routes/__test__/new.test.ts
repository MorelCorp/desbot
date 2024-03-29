import request from 'supertest';
import { app } from '../../app';
import { Game, PLACEHOLDER_THUMBNAIL } from '../../models/game';
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
    })
    .expect(400);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('creates a game with valid inputs', async () => {
  let games = await Game.find({});
  expect(games.length).toEqual(0);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'Good Title',
      bggId: '000',
      thumbnail: 'thumbnail link',
    })
    .expect(201);

  games = await Game.find({});
  expect(games.length).toEqual(1);
  expect(games[0].bggId).toEqual('000');
  expect(games[0].thumbnail).toEqual('thumbnail link');
});

it('creates a game with default params if not all provided', async () => {
  let games = await Game.find({});
  expect(games.length).toEqual(0);

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title: 'Good Title',
    })
    .expect(201);

  games = await Game.find({});
  expect(games.length).toEqual(1);
  expect(games[0].bggId).toEqual('0');
  expect(games[0].thumbnail).toEqual(PLACEHOLDER_THUMBNAIL);
});

it('publishes an event', async () => {
  const title = 'asdfasdfa';

  await request(app)
    .post('/api/games')
    .set('Cookie', global.signin())
    .send({
      title,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
