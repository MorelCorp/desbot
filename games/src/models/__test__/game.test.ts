import { Game } from '../game';
import mongoose from 'mongoose';

it('implements optimistic concurrency control', async (done) => {
  //create an instance of a game
  const game = Game.build({
    title: 'Terraforming Mars',
    bggId: '0',
    thumbnail: 'none',
  });

  // save the game to the db
  await game.save();

  // fetch the game twice
  const firstInstance = await Game.findById(game.id);
  const secondInstance = await Game.findById(game.id);

  // make two separate changes to the games we fetched
  firstInstance?.set({
    thumbnail: 'new thumbnail',
  });
  secondInstance?.set({ bggId: '167791' });

  // save the first fetched game
  await firstInstance?.save();

  // save the second fetchet game and we want this to fail
  try {
    await secondInstance?.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const game = Game.build({
    title: 'Generic Game',
    bggId: '0',
    thumbnail: 'none',
  });
  await game.save();
  expect(game.version).toEqual(0);
  await game.save();
  expect(game.version).toEqual(1);
  await game.save();
  expect(game.version).toEqual(2);
});
