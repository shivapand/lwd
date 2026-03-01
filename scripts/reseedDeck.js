'use strict';

import {
  ObjectID
} from 'mongodb';
import mongoClientConnect
  from '~/js/server/fns/mongoClientConnect';
import deckGetFn
  from '~/js/server/schema/mutations/fns/deckGet';

const mongoUri = process.env.MONGO_LOCAL_URI;

const title = process.argv[2] ||
  'The Matrix';

const reseed = async () => {

  const db = await mongoClientConnect(
    mongoUri
  );

  // eslint-disable-next-line no-console
  console.log(
    `Reseed: deleting old deck for "${title}"...`
  );

  await db.collection(
    'decks'
  )
    .deleteMany(
      {
        'splash.title': title
      }
    );

  // eslint-disable-next-line no-console
  console.log(
    `Reseed: running full pipeline for "${title}"...`
  );

  const deck = await deckGetFn(
    title,
    undefined,
    undefined,
    5,
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    `Reseed: pipeline complete. Characters: ${
      deck?.splash?.characters?.length
    }, Cards: ${
      deck?.cards?.length
    }`
  );

  (deck?.splash?.characters || [])
    .forEach(
      (c, i) => {

        // eslint-disable-next-line no-console
        console.log(
          `  Character ${i}: ${
            c.text
          } (role: ${
            c.role
          }, gender: ${
            c.gender
          })`
        );
      }
    );

  await db.collection(
    'decks'
  )
    .insertOne(
      {
        _id: new ObjectID(),
        source: 'tmdb5000movies',
        ...deck
      }
    );

  // eslint-disable-next-line no-console
  console.log(
    'Reseed: deck stored successfully.'
  );

  process.exit(0);
};

reseed()
  .catch(
    (error) => {

      // eslint-disable-next-line no-console
      console.error(
        'Reseed failed:',
        error
      );
      process.exit(1);
    }
  );
