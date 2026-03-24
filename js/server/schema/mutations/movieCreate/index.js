'use strict';

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
import {
  movieFindOne,
  movieCreate as movieCreateFn
} from '~/js/server/data/movie';

const sourceName = 'user';

const deckCachedHandledGet = (
  deck,
  spoofInput,
  genre,
  db
) => {

  return deckGetFn(
    deck,
    spoofInput,
    genre,
    undefined,
    db
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

  const result = (!deck || !deck.splash)
    ? await deckGetFn(
      'The Matrix',
      spoofInput,
      genre,
      undefined,
      db
    )
    : await deckGetFn(
      deck.splash.title,
      spoofInput,
      genre,
      undefined,
      db
    );

  // Fallback to The Matrix if the random selection failed (e.g. LLM failure)
  return result || deckGetFn(
    'The Matrix',
    spoofInput,
    genre,
    undefined,
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
  isSearch,
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
        /^random$/
      )
    ) :

      return deckRandomGet(
        spoofInput,
        genre,
        db
      );

    default :

      if (
        !isSearch
      ) {

        const deck = await deckFindOne(
          {
            'splash.title': text
          },
          undefined,
          db
        );

        if (
          deck
        ) {

          return deckCachedHandledGet(
            deck,
            spoofInput,
            genre,
            db
          );
        }
      }

      return deckGetFn(
        text,
        spoofInput,
        genre,
        plotLimit,
        db
      );
  }
};

const movieGet = async (
  deck,
  spoofInput,
  genre,
  db
) => {

  const existingMovie = await movieFindOne(
    {
      title: deck.splash.title,
      hero: spoofInput.hero,
      genre
    },
    undefined,
    db
  );

  if (
    existingMovie
  ) {

    return existingMovie;
  }

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
  isSearch,
  db
) => {

  if (
    outputType !== 'deck' &&
    !isSearch
  ) {

    const movie = await movieFindOne(
      {
        title: text,
        hero: spoofInput.hero,
        genre
      },
      undefined,
      db
    );

    if (
      movie
    ) {

      return movie;
    }
  }

  const deck = await deckGet(
    text,
    spoofInput,
    genre,
    plotLimit,
    isSearch,
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
    plotLimit = 5,
    isSearch = false
  } = options;

  let output = await (
    outputType === 'deck'
  )
    ? await deckGet(
      text,
      spoofInput,
      genre,
      plotLimit,
      isSearch,
      db
    )
    : await outputGet(
      text,
      spoofInput,
      genre,
      outputType,
      plotLimit,
      isSearch,
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
