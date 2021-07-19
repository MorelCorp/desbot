import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface GameAttrs {
  title: string;
  price: number;
  userId: string;
}

interface GameDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface GameModel extends mongoose.Model<GameDoc> {
  build(attrs: GameAttrs): GameDoc;
}

const gameameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

gameameSchema.set('versionKey', 'version');
gameameSchema.plugin(updateIfCurrentPlugin);

gameameSchema.statics.build = (attrs: GameAttrs) => {
  return new Game(attrs);
};

const Game = mongoose.model<GameDoc, GameModel>('Game', gameameSchema);

export { Game };
