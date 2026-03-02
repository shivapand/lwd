'use strict';

import path from 'path';
import fs from 'fs';
import {
  execSync
} from 'child_process';

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

const roleConfigCollection = {
  hero: {
    dir: 'hero',
    set: 'ninjas',
    text: 'ninja-hero'
  },
  villain: {
    dir: 'villain',
    set: 'bandits',
    text: 'bandit-villain'
  },
  heroine: {
    dir: 'heroine',
    set: 'ninjas',
    text: 'ninja-heroine'
  }
};

const roleArg = process.argv[2] || 'all';

const roleCollection = (roleArg === 'all')
  ? Object.keys(roleConfigCollection)
  : roleArg.split(',');

const OUTPUT_RES = process.env.OUTPUT_RES ||
  process.env.npm_package_config_OUTPUT_RES ||
  320;

const base64Get = (
  filePath
) => {

  const buffer = execSync(
    `convert "${filePath}" -resize ${OUTPUT_RES}x${OUTPUT_RES} -quality 80 jpeg:-`
  );

  return `data:image/jpeg;base64,${
    buffer.toString('base64')
  }`;
};

const seedRole = async (
  role,
  config,
  publicDomainGenreId,
  db
) => {

  const sourceDir = path.resolve(
    __dirname,
    '../source-images',
    config.dir
  );

  const sourceDirExists = fs.existsSync(
    sourceDir
  );

  (!sourceDirExists) &&
    (() => {

      // eslint-disable-next-line no-console
      console.log(
        `  Skipping ${role}: source-images/${config.dir} not found`
      );
    })();

  return (!sourceDirExists)
    ? null
    : (() => {

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

      const actorSet = setCreate(
        {
          _genreId: publicDomainGenreId,
          text: config.set
        },
        {
          $set: {
            _genreId: publicDomainGenreId,
            text: config.set
          }
        },
        undefined,
        db
      );

      return actorSet.then(
        (
          setDoc
        ) => {

          // eslint-disable-next-line no-console
          console.log(
            `  Set (${config.set}): ${setDoc._id}`
          );

          return actorCreate(
            {
              _setId: setDoc._id,
              role,
              text: config.text
            },
            {
              $set: {
                _setId: setDoc._id,
                role,
                text: config.text
              }
            },
            undefined,
            db
          )
            .then(
              (
                actor
              ) => {

                // eslint-disable-next-line no-console
                console.log(
                  `  Actor (${config.text}): ${actor._id}`
                );

                return deleteMany(
                  {
                    _actorId: actor._id
                  },
                  {},
                  'actorImages',
                  db
                )
                  .then(
                    () => {

                      // eslint-disable-next-line no-console
                      console.log(
                        `  Cleared existing actorImages for ${role}`
                      );

                      return fileNameCollection.reduce(
                        (
                          memo,
                          fileName
                        ) => {

                          return memo.then(
                            (
                              res
                            ) => {

                              const base64 = base64Get(
                                path.join(
                                  sourceDir,
                                  fileName
                                )
                              );

                              return actorImageCreate(
                                {
                                  _actorId: actor._id,
                                  _sourceFile: fileName
                                },
                                {
                                  $set: {
                                    _actorId: actor._id,
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
                    }
                  )
                  .then(
                    (
                      actorImageIdCollection
                    ) => {

                      const closeupPath = path.join(
                        sourceDir,
                        '00.png'
                      );

                      const closeupExists = fs.existsSync(
                        closeupPath
                      );

                      const closeupPromise = closeupExists
                        ? actorImageCreate(
                          {
                            _actorId: actor._id,
                            _type: 'closeup'
                          },
                          {
                            $set: {
                              _actorId: actor._id,
                              _type: 'closeup',
                              base64: base64Get(closeupPath)
                            }
                          },
                          undefined,
                          db
                        )
                        : Promise.resolve(null);

                      return closeupPromise.then(
                        (
                          closeupActorImage
                        ) => {

                          // eslint-disable-next-line no-console
                          console.log(
                            closeupActorImage
                              ? `  ActorImage closeup (00.png): ${closeupActorImage._id}`
                              : '  No closeup image (00.png not found)'
                          );

                          // eslint-disable-next-line no-console
                          console.log(
                            `  ${role}: ${
                              actorImageIdCollection.length
                            } card + ${
                              closeupActorImage ? 1 : 0
                            } closeup\n`
                          );

                          return actorImageIdCollection;
                        }
                      );
                    }
                  );
              }
            );
        }
      );
    })();
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
    `Seeding actor images [${roleCollection.join(', ')}]...\n`
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
    `  Genre (general): ${generalGenre._id}\n`
  );

  await roleCollection.reduce(
    (
      memo,
      role
    ) => {

      return memo.then(
        () => {

          const config = roleConfigCollection[role];

          return (!config)
            ? (() => {

              // eslint-disable-next-line no-console
              console.log(
                `  Unknown role: ${role}, skipping`
              );

              return Promise.resolve(null);
            })()
            : seedRole(
              role,
              config,
              publicDomainGenre._id,
              db
            );
        }
      );
    },
    Promise.resolve()
  );

  // eslint-disable-next-line no-console
  console.log(
    'Done.'
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
