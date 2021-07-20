import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const PLACEHOLDER_THUMBNAIL =
  'https://via.placeholder.com/200x150?text=No+Image';

interface GameAttrs {
  title: string;
  bggId: string;
  thumbnail: string;
}

interface GameDoc extends mongoose.Document {
  version: number;
  title: string;
  bggId: string;
  thumbnail: string;
}

interface GameModel extends mongoose.Model<GameDoc> {
  build(attrs: GameAttrs): GameDoc;
}

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    bggId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

gameSchema.set('versionKey', 'version');
gameSchema.plugin(updateIfCurrentPlugin);

gameSchema.statics.build = (attrs: GameAttrs) => {
  return new Game(attrs);
};

const Game = mongoose.model<GameDoc, GameModel>('Game', gameSchema);

export { Game, PLACEHOLDER_THUMBNAIL };
