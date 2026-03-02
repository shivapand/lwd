'use strict';

import path from 'path';
import fs from 'fs';
import {
  ObjectID
} from 'mongodb';

import deckGetFn from '../fns/deckGet';
import gifRenderedGet from '../fns/gifRenderedGet';
import {
  hostUrlGet
} from '~/js/server/fns/variable';
import {
  deckFind,
  deckFindOne,
  deckCountDocuments,
  deckCreate as deckCreateFn
} from '~/js/server/data/deck';
import movieSearch from 
  '../movieSearch';
import {
  movieCreate as movieCreateFn
} from '~/js/server/data/movie';

const sourceName = 'tmdb5000movies';

const deckCachedHandledGet = (
  deck,
  spoofInput,
  genre,
  db
) => {

  return (deck?.cards?.[0]?.renderText)
    ? Promise.resolve(deck)
    : deckGetFn(
      deck,
      spoofInput,
      genre,
      undefined,
      db
    );
};

const tmd5000moviesTitleByIndexGet = async (
  index
) => {

  const dataFilename = 'tmdb_5000_movies.json';

  const datasetsFolderPathString = 'temp/datasets';

  const jsonFilePath = path.join(
    process.cwd(),
    datasetsFolderPathString,
    'json',
    dataFilename
  );

  let data = await(
    new Promise(
      (
        resolve,
        reject
      ) => {

        return fs.readFile(
          jsonFilePath,
          'utf8',
          (
            error,
            res
          ) => {

            if (
              error
            ) {

              return reject(
                error
              );
            }

            return resolve(
              JSON.parse(
                res
              )
            );
          }
        );
      }
    )
  );

  const title = data[
    index
  ]?.title;

  return (
    title
  );
};

const titleMatchGet = (
  _title
) => {

  return movieSearch(
    _title,
    1,
    false
  )
    .then(
      (
        res
      ) => {

        const title = res[
          0
        ]?.title;

        const match = title?.match(
          _title
        );

        return (
          match
        ) ?
          title :
          null;
      }
    );
};

const deckByIdGet = async (
  deckId,
  spoofInput,
  genre,
  db
) => {

  let deck = await deckFindOne(
    {
      _id: new ObjectID(
        deckId
      )
    },
    undefined,
    db
  );

  deck = await deckCachedHandledGet(
    deck,
    spoofInput,
    genre,
    db
  );

  return (
    deck
  );
};

const deckByIndexGet = async (
  index,
  spoofInput,
  genre,
  db
) => {

  let text = await tmd5000moviesTitleByIndexGet(
    index
  );

  text = await titleMatchGet(
    text
  );

  let deck = await deckFindOne(
    {
      'splash.title': text
    },
    undefined,
    db
  );

  deck = await deckCachedHandledGet(
    deck,
    spoofInput,
    genre,
    db
  );

  return (
    deck
  );
};

const deckRandomGet = async (
  spoofInput,
  genre,
  db
) => {

  const count = await deckCountDocuments(
    {
      'splash.spoofable': true
    },
    undefined,
    db
  );

  const skip = (!count)
    ? 0
    : Math.floor(
      Math.random() *
      count
    );

  let deck = (!count)
    ? null
    : (
      await deckFind(
        {
          'splash.spoofable': true
        },
        {
          skip,
          limit: 1
        },
        db
      )
    )[
      0
    ];

  return (!deck)
    ? deckGetFn(
      'The Matrix',
      spoofInput,
      genre,
      undefined,
      db
    )
    : deckCachedHandledGet(
      deck,
      spoofInput,
      genre,
      db
    );
};

const movieCreate = async (
  movie,
  db,
  req
) => {

  const movieFilenameString = `${movie.title}_${movie.genre}_${movie.hero}`.replace(/[\s\n\r]+/g, '_');

  const path = `/output/${movieFilenameString}.gif`;

  const url = `
    ${
      hostUrlGet(
        req
      )
    }${
      path
    }
  `
    .trim();

  return movieCreateFn(
    {
      title: movie.title,
      genre: movie.genre,
      hero: movie.hero
    },
    {
      $set: {
        ...movie,
        path,
        url
      }
    },
    undefined,
    db
  );
};

const deckGet = async (
  text,
  spoofInput,
  genre,
  plotLimit,
  db
) => {

  switch (
    true
  ) {

    case (
      !!text.match(
        /^id:.{24}$/
      )
    ) :

      return deckByIdGet(
        text.split(
          /:/
        )[
          1
        ],
        spoofInput,
        genre,
        db
      );

    case (
      !!text.match(
        /^index:\d+$/
      )
    ) :

      return deckByIndexGet(
        parseInt(
          text.split(
            /:/
          )[
            1
          ]
        ),
        spoofInput,
        genre,
        db
      );

    case (
      !!text.match(
        /^random$/
      )
    ) :

      return deckRandomGet(
        spoofInput,
        genre,
        db
      );

    default :

      return deckFindOne(
        {
          'splash.title': text
        },
        undefined,
        db
      )
        .then(
          (
            existingDeck
          ) => {

            return (existingDeck)
              ? deckCachedHandledGet(
                existingDeck,
                spoofInput,
                genre,
                db
              )
              : deckGetFn(
                text,
                spoofInput,
                genre,
                plotLimit,
                db
              );
          }
        );
  }
};

const movieGet = async (
  deck,
  spoofInput,
  genre,
  db
) => {

  const movie = (
    await gifRenderedGet(
      deck,
      spoofInput.hero,
      db
    )
      .then(
        (
          base64
        ) => {

          return {
            title: deck.splash.title,
            description: deck.cards[
              0
            ]
              .text,
            hero: spoofInput.hero,
            genre,
            base64
          };
        }
      )
  );

  return (
    movie
  );
};

const outputGet = async (
  text,
  spoofInput,
  genre,
  outputType,
  plotLimit,
  db
) => {

  const deck = await deckGet(
    text,
    spoofInput,
    genre,
    plotLimit,
    db
  );

  switch (
    true
  ) {

    case (
      outputType === 
      'deck'
    ) :

      return (
        deck
      );

    default :

      return movieGet(
        deck,
        spoofInput,
        genre,
        db
      );
  }
};

const outputCreatedGet = (
  output,
  createFlag,
  db,
  req
) => {

  switch (
    true
  ) {

    case (
      !createFlag
    ) :

      return Promise.resolve(
        output
      );

    case (
      !!output.base64 &&
      !!output._id
    ) :

      return Promise.resolve(
        output
      );

    case (
      !!output.base64
    ) :

      return movieCreate(
        output,
        db,
        req
      );

    default :

      return (() => {

        const {
          _id,
          ...deckData
        } = output;

        return deckCreateFn(
          {
            'splash.title': output.splash?.title
          },
          {
            $set: deckData
          },
          undefined,
          db
        );
      })();
  }
};

export default async (
  text,
  options = {},
  db,
  req
) => {

  const {
    source = 'user',
    spoofInput = undefined,
    genre = undefined,
    outputType = 'deck',
    createFlag = false,
    plotLimit = 5
  } = options;

  let output = await outputGet(
    text,
    spoofInput,
    genre,
    outputType,
    plotLimit,
    db
  );

  return (!output)
    ? {}
    : await (async () => {

      output = await outputCreatedGet(
        {
          source,
          ...output
        },
        createFlag,
        db,
        req
      );

      return output;
    })();
};
