'use strict';

import {
  ObjectID
} from 'mongodb';

import movieCreate from '../schema/mutations/movieCreate';
import {
  actorImagesFind
} from '~/js/server/data/actorImage';

const imagesByIdsGet = (
  actorImageIdCollection,
  db
) => {

  return (!actorImageIdCollection.length)
    ? Promise.resolve({})
    : actorImagesFind(
      {
        _id: {
          $in: actorImageIdCollection.map(
            (id) => new ObjectID(id)
          )
        }
      },
      {
        projection: {},
        sort: {},
        skip: 0,
        limit: 0
      },
      db
    )
      .then(
        (
          actorImageCollection
        ) => {

          return actorImageCollection.reduce(
            (
              memo,
              {
                _id,
                base64
              }
            ) => ({
              ...memo,
              [_id.toString()]: base64
            }),
            {}
          );
        }
      );
};

const characterImageGet = (
  character,
  imageMap
) => {

  return (character.actorImageId)
    ? imageMap[character.actorImageId] || character.profileImage || null
    : character.profileImage || null;
};

const cardImageGet = (
  card,
  imageMap
) => {

  return (card.actorImageId)
    ? imageMap[card.actorImageId] || card.gifyUrl || card.character?.profileImage || null
    : card.gifyUrl || card.character?.profileImage || null;
};

export default async (
  db,
  req,
  res
) => {

  const {
    deckTitle
  } = req.params;

  const genre = req.query.genre || process.env.GENRE || 'public-domain';

  const hero = req.query.hero || process.env.HERO || 'YOU!';

  return movieCreate(
    deckTitle,
    {
      spoofInput: {
        hero
      },
      genre,
      outputType: 'deck',
      createFlag: true
    },
    db,
    req
  )
    .then(
      (
        deck
      ) => {

        const randomFallbackTitle = 'The Matrix';

        return (!deck || !deck.splash)
          ? (deckTitle === 'random')
            ? res.json(
              {
                redirect: `/deck/${
                  encodeURIComponent(randomFallbackTitle)
                }?genre=${genre}&hero=${encodeURIComponent(hero)}`
              }
            )
            : res.status(404).json(
              {
                error: 'deck not found'
              }
            )
          : (deckTitle === 'random')
            ? res.json(
              {
                redirect: `/deck/${
                  encodeURIComponent(deck.splash.title)
                }?genre=${genre}&hero=${encodeURIComponent(hero)}`
              }
            )
            : (() => {

              const actorImageIdCollection = [
                ...(deck.splash.characters || []),
                ...(deck.cards || [])
              ]
                .reduce(
                  (
                    memo,
                    item
                  ) => {

                    const id = item.actorImageId;

                    return (id && !memo.includes(id))
                      ? [...memo, id]
                      : memo;
                  },
                  []
                );

              return imagesByIdsGet(
                actorImageIdCollection,
                db
              )
                .then(
                  (
                    imageMap
                  ) => {

                    const characters = (deck.splash.characters || [])
                      .filter(
                        (character) => character.render
                      )
                      .map(
                        (character) => ({
                          renderText: character.renderText,
                          role: character.role,
                          dualRoleIndex: character.dualRoleIndex,
                          image: characterImageGet(character, imageMap)
                        })
                      );

                    const cards = (deck.cards || [])
                      .map(
                        (card) => ({
                          renderText: card.renderText,
                          character: card.character
                            ? {
                              renderText: card.character.renderText,
                              role: card.character.role,
                              dualRoleIndex: card.character.dualRoleIndex,
                              image: characterImageGet(card.character, imageMap)
                            }
                            : null,
                          dualRoleIndex: card.dualRoleIndex,
                          image: cardImageGet(card, imageMap)
                        })
                      );

                    return res.json(
                      {
                        splash: {
                          title: deck.splash.title,
                          poster: deck.splash.poster,
                          characters,
                          spoofable: deck.splash.spoofable
                        },
                        cards
                      }
                    );
                  }
                );
            })();
      }
    )
    .catch(
      (
        error
      ) => {

        return res.status(500).json(
          {
            error: error.message || 'deck creation failed'
          }
        );
      }
    );
};
