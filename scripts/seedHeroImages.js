'use strict';

import path from 'path';
import fs from 'fs';

import {
  MongoClient
} from 'mongodb';
import {
  genreCreate
} from '~/js/server/data/genre';
import {
  setCreate
} from '~/js/server/data/set';
import {
  actorCreate
} from '~/js/server/data/actor';
import {
  actorImageCreate
} from '~/js/server/data/actorImage';
import {
  deleteMany
} from '~/js/server/data/index';

const mongoUri =
  process.env.MONGO_URI ||
  process.env.MONGO_REMOTE_URI ||
  process.env.npm_package_config_MONGO_REMOTE_URI ||
  'mongodb://pyratin:didi1234@ac-6dl3ehk-shard-00-00.9mbvglo.mongodb.net:27017/lwd?ssl=true&replicaSet=atlas-drrhrz-shard-0&authSource=admin';

const sourceDir = path.resolve(
  __dirname,
  '../source-images/hero'
);

const fileNameCollection = fs.readdirSync(
  sourceDir
)
  .filter(
    (fileName) => {

      return (
        /^\d+\.png$/.test(fileName) &&
        fileName !== '00.png'
      );
    }
  )
  .sort();

const base64Get = (
  fileName
) => {

  const buffer = fs.readFileSync(
    path.join(
      sourceDir,
      fileName
    )
  );

  return `data:image/png;base64,${
    buffer.toString('base64')
  }`;
};

const seed = async () => {

  const client = await MongoClient.connect(
    mongoUri,
    {
      useUnifiedTopology: true
    }
  );

  const db = client.db(
    'lwd'
  );

  // eslint-disable-next-line no-console
  console.log(
    'Seeding hero images...'
  );

  const publicDomainGenre = await genreCreate(
    {
      text: 'public-domain'
    },
    {
      $set: {
        text: 'public-domain'
      }
    },
    undefined,
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    `  Genre (public-domain): ${publicDomainGenre._id}`
  );

  const generalGenre = await genreCreate(
    {
      text: 'general'
    },
    {
      $set: {
        text: 'general'
      }
    },
    undefined,
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    `  Genre (general): ${generalGenre._id}`
  );

  const ninjaSet = await setCreate(
    {
      _genreId: publicDomainGenre._id,
      text: 'ninjas'
    },
    {
      $set: {
        _genreId: publicDomainGenre._id,
        text: 'ninjas'
      }
    },
    undefined,
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    `  Set (ninjas): ${ninjaSet._id}`
  );

  const heroActor = await actorCreate(
    {
      _setId: ninjaSet._id,
      role: 'hero',
      text: 'ninja-hero'
    },
    {
      $set: {
        _setId: ninjaSet._id,
        role: 'hero',
        text: 'ninja-hero'
      }
    },
    undefined,
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    `  Actor (ninja-hero): ${heroActor._id}`
  );

  await deleteMany(
    {
      _actorId: heroActor._id
    },
    {},
    'actorImages',
    db
  );

  // eslint-disable-next-line no-console
  console.log(
    '  Cleared existing actorImages'
  );

  const actorImageIdCollection =
    await fileNameCollection.reduce(
      (
        memo,
        fileName
      ) => {

        return memo.then(
          (
            res
          ) => {

            const base64 = base64Get(
              fileName
            );

            return actorImageCreate(
              {
                _actorId: heroActor._id,
                _sourceFile: fileName
              },
              {
                $set: {
                  _actorId: heroActor._id,
                  base64
                }
              },
              undefined,
              db
            )
              .then(
                (
                  actorImage
                ) => {

                  // eslint-disable-next-line no-console
                  console.log(
                    `  ActorImage (${fileName}): ${actorImage._id}`
                  );

                  return [
                    ...res,
                    actorImage._id
                  ];
                }
              );
          }
        );
      },
      Promise.resolve(
        []
      )
    );

  const closeupFileName = '00.png';

  const closeupExists = fs.existsSync(
    path.join(
      sourceDir,
      closeupFileName
    )
  );

  const closeupActorImage = closeupExists &&
    await actorImageCreate(
      {
        _actorId: heroActor._id,
        _type: 'closeup'
      },
      {
        $set: {
          _actorId: heroActor._id,
          _type: 'closeup',
          base64: base64Get(closeupFileName)
        }
      },
      undefined,
      db
    );

  // eslint-disable-next-line no-console
  console.log(
    closeupActorImage
      ? `  ActorImage closeup (${closeupFileName}): ${closeupActorImage._id}`
      : '  No closeup image (00.png not found)'
  );

  // eslint-disable-next-line no-console
  console.log(
    `\nDone. ${
      actorImageIdCollection.length
    } card images + ${
      closeupActorImage ? 1 : 0
    } closeup seeded.`
  );

  process.exit(0);
};

seed()
  .catch(
    (error) => {

      // eslint-disable-next-line no-console
      console.error(
        'Seed failed:',
        error
      );
      process.exit(1);
    }
  );
