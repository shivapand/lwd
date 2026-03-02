'use strict';

import {
  mongoUriGet
} from '~/js/server/fns/variable';
import mongoClientConnect
  from '~/js/server/fns/mongoClientConnect';
import movieCreate from
  '~/js/server/schema/mutations/movieCreate';
import {
  deckFindOne
} from '~/js/server/data/deck';

const movieCollection = [
  'The Matrix'
];

const deckCreateFn = async (
  title,
  db
) => {

  const exists = await deckFindOne(
    {
      'splash.title': title
    },
    undefined,
    db
  );

  if (
    exists
  ) {

    // eslint-disable-next-line no-console
    console.log(
      `skip (exists): ${title}`
    );

    return (
      null
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `creating: ${title}`
  );

  return movieCreate(
    title,
    {
      source: 'user',
      createFlag: true
    },
    db,
    undefined
  );
};

const seedDecksCreate = async () => {

  const db = await mongoClientConnect(
    mongoUriGet()
  );

  const resultCollection = await movieCollection
    .reduce(
      (
        memo,
        title
      ) => {

        return memo.then(
          async (
            res
          ) => {

            const result = await deckCreateFn(
              title,
              db
            );

            // eslint-disable-next-line no-console
            console.log(
              `${
                result
                  ? 'done'
                  : 'skipped'
              }: ${title}`
            );

            return [
              ...res,
              result
            ];
          }
        );
      },
      Promise.resolve(
        []
      )
    );

  const createdCount = resultCollection.filter(
    Boolean
  ).length;

  // eslint-disable-next-line no-console
  console.log(
    `seedDecksCreate: ${createdCount} decks created`
  );

  process.exit(0);
};

seedDecksCreate();
