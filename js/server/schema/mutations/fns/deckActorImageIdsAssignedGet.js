'use strict';

import {
  ObjectID
} from 'mongodb';

import {
  actorsFind as actorsFindFn
} from '~/js/server/data/actor';
import {
  actorImagesFind,
  actorImageFindOne
} from '~/js/server/data/actorImage';

const shuffledGet = (
  els
) => {

  return els.reduce(
    (
      memo,
      el
    ) => {

      return [
        ...memo,
        {
          el,
          random: Math.random()
        }
      ];
    },
    []
  )
    .sort(
      (
        a, b
      ) => {

        switch (
          true
        ) {

          case (
            a.random >
            b.random
          ) :

            return 1;

          case (
            b.random >
            a.random
          ) :

            return -1;

          default:

            return 0;
        }
      }
    )
    .map(
      (
        {
          el
        }
      ) => {

        return (
          el
        );
      }
    );
};

const starringActorsFlatlistGet = (
  characters
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      return (!character.actor)
        ? memo
        : [
          ...memo,
          {
            ...character.actor,
            _text: character.text,
            role: character.role
          }
        ];
    },
    []
  );
};

const spoofActorWeightAssignedGetFn = (
  spoofActor,
  spoofActorsPrevious
) => {

  const {
    count,
    distance
  } = spoofActorsPrevious.reduce(
    (
      memo,
      _spoofActorsPrevious,
      index
    ) => {

      return (
        _spoofActorsPrevious?._id?.toString() !==
        spoofActor._id.toString()
      )
        ? memo
        : {
          count: memo.count + 1,
          distance: spoofActorsPrevious.length - (
            index + 1
          )
        };
    },
    {
      count: 0,
      distance: spoofActorsPrevious.length
    }
  );

  return {
    ...spoofActor,
    count,
    distance
  };
};

const spoofActorsSortedGet = (
  spoofActors
) => {

  return spoofActors.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a.count >
          b.count
        ) :

          return 1;

        case (
          b.count >
          a.count
        ) :

          return -1;

        case (
          a.distance >
          b.distance
        ) :

          return -1;

        case (
          b.distance >
          a.distance
        ) :

          return 1;

        default:

          return 0;
      }
    }
  );
};

const spoofActorsGetFn = async (
  starringActor,
  spoofActorsPrevious,
  db
) => {

  const role = starringActor.role;

  let spoofActors = await actorsFindFn(
    {
      role
    },
    undefined,
    db
  );

  spoofActors = shuffledGet(
    spoofActors
  );

  spoofActors = spoofActors.reduce(
    (
      memo,
      spoofActor
    ) => {

      return [
        ...memo,
        spoofActorWeightAssignedGetFn(
          spoofActor,
          spoofActorsPrevious
        )
      ];
    },
    []
  );

  spoofActors = spoofActorsSortedGet(
    spoofActors
  );

  return spoofActors[
    0
  ];
};

const spoofActorsGet = async (
  starringActors,
  db
) => {

  return starringActors.reduce(
    (
      memo,
      starringActor
    ) => {

      return memo.then(
        (
          res
        ) => {

          return spoofActorsGetFn(
            starringActor,
            res,
            db
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  {
                    ...result,
                    _text:
                      starringActor._text
                  }
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
};

const charactersActorAssignedGet = (
  characters,
  spoofActors
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      return [
        ...memo,
        {
          ...character,
          _actor: spoofActors.find(
            (
              spoofActor
            ) => {

              return (
                spoofActor._text ===
                character.text
              );
            }
          )
        }
      ];
    },
    []
  );
};

const cardCharactersGet = (
  cards,
  characters
) => {

  return cards.reduce(
    (
      memo,
      card
    ) => {

      const character = characters.find(
        (
          c
        ) => {

          return (
            c.text ===
            card.character?.text
          );
        }
      );

      return [
        ...memo,
        (character)
          ? { ...character }
          : null
      ];
    },
    []
  );
};

const actorImageIdsPreviousGet = (
  cardCharacters
) => {

  return cardCharacters.reduce(
    (
      memo,
      cardCharacter
    ) => {

      const actorImageId = cardCharacter?.actorImageId;

      return (!actorImageId)
        ? memo
        : [
          ...memo,
          actorImageId
        ];
    },
    []
  );
};

const actorImageIdWeightGet = (
  actorImageId,
  actorImageIdsPrevious
) => {

  return actorImageIdsPrevious.reduce(
    (
      memo,
      _actorImageIdsPrevious,
      index
    ) => {

      return (
        _actorImageIdsPrevious.toString() !==
        actorImageId.toString()
      )
        ? memo
        : {
          count: memo.count + 1,
          distance: actorImageIdsPrevious.length - (
            index + 1
          )
        };
    },
    {
      count: 0,
      distance: actorImageIdsPrevious.length
    }
  );
};

const actorImageIdsSortedByWeightGet = (
  actorImageIds,
  actorImageIdsPrevious
) => {

  return actorImageIds.reduce(
    (
      memo,
      actorImageId
    ) => {

      return [
        ...memo,
        {
          actorImageId,
          ...actorImageIdWeightGet(
            actorImageId,
            actorImageIdsPrevious
          )
        }
      ];
    },
    []
  )
    .sort(
      (
        a, b
      ) => {

        switch (
          true
        ) {

          case (
            a.count >
            b.count
          ) :

            return 1;

          case (
            b.count >
            a.count
          ) :

            return -1;

          case (
            a.distance >
            b.distance
          ) :

            return -1;

          case (
            b.distance >
            a.distance
          ) :

            return 1;

          default:

            return 0;
        }
      }
    )
    .map(
      (
        {
          actorImageId
        }
      ) => {

        return (
          actorImageId
        );
      }
    );
};

const cardCharactersActorImageIdAssignedGetFn = async (
  cardCharacter,
  cardCharacters,
  db
) => {

  return (!cardCharacter?._actor)
    ? null
    : (() => {

      const actorImageIdsPrevious = actorImageIdsPreviousGet(
        cardCharacters
      );

      return actorImagesFind(
        {
          _actorId: new ObjectID(
            cardCharacter._actor._id
          ),
          _type: {
            $ne: 'closeup'
          }
        },
        {
          projection: {
            _id: 1
          },
          sort: {},
          skip: 0,
          limit: 0
        },
        db
      )
        .then(
          (
            actorImages
          ) => {

            const actorImageIds = actorImageIdsSortedByWeightGet(
              shuffledGet(
                actorImages.map(
                  (
                    { _id }
                  ) => _id.toString()
                )
              ),
              actorImageIdsPrevious
            );

            return actorImageIds[
              0
            ] || null;
          }
        );
    })();
};

const cardCharactersActorImageIdAssignedGet = (
  cardCharacters,
  db
) => {

  return cardCharacters.reduce(
    (
      memo,
      cardCharacter
    ) => {

      return memo.then(
        (
          res
        ) => {

          return cardCharactersActorImageIdAssignedGetFn(
            cardCharacter,
            res,
            db
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  (result)
                    ? {
                      ...cardCharacter,
                      actorImageId: result
                    }
                    : cardCharacter
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
};

const cardsCharacterAssignedGet = (
  cards,
  cardCharacters
) => {

  return cards.reduce(
    (
      memo,
      card,
      index
    ) => {

      const cardCharacter = cardCharacters[
        index
      ];

      return [
        ...memo,
        (cardCharacter?.actorImageId)
          ? {
            ...card,
            actorImageId: cardCharacter.actorImageId
          }
          : card
      ];
    },
    []
  );
};

const charactersActorImageIdAssignedGet = (
  characters,
  cardCharacters
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      const cardCharacter = cardCharacters.find(
        (
          cardCharacter
        ) => {

          return (
            cardCharacter?.text ===
            character.text
          );
        }
      );

      return [
        ...memo,
        {
          ...character,
          actorImageId: cardCharacter?.actorImageId
        }
      ];
    },
    []
  );
};

const charactersCloseupImageAssignedGet = (
  characters,
  charactersWithActor,
  db
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      return memo.then(
        (
          res
        ) => {

          const enriched = charactersWithActor.find(
            (
              c
            ) => {

              return (
                c.text ===
                character.text &&
                c._actor
              );
            }
          );

          return (!enriched)
            ? [
              ...res,
              character
            ]
            : actorImageFindOne(
              {
                _actorId: new ObjectID(
                  enriched._actor._id
                ),
                _type: 'closeup'
              },
              {
                projection: {
                  _id: 1
                },
                sort: {}
              },
              db
            )
              .then(
                (
                  closeupImage
                ) => {

                  return [
                    ...res,
                    (closeupImage)
                      ? {
                        ...character,
                        actorImageId: closeupImage._id
                          .toString()
                      }
                      : character
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
};

export default async (
  deck,
  db
) => {

  const starringActors = starringActorsFlatlistGet(
    deck.splash.characters
  );

  const spoofActors = await spoofActorsGet(
    starringActors,
    db
  );

  const characters = charactersActorAssignedGet(
    deck.splash.characters,
    spoofActors
  );

  const _charactersWithActor = characters;

  let cardCharacters = cardCharactersGet(
    deck.cards,
    characters
  );

  cardCharacters =
  await cardCharactersActorImageIdAssignedGet(
    cardCharacters,
    db
  );

  const cards = cardsCharacterAssignedGet(
    deck.cards,
    cardCharacters
  );

  const _characters = charactersActorImageIdAssignedGet(
    deck.splash.characters,
    cardCharacters
  );

  const __characters = await charactersCloseupImageAssignedGet(
    _characters,
    _charactersWithActor,
    db
  );

  return {
    ...deck,
    cards,
    splash: {
      ...deck.splash,
      characters: __characters
    }
  };
};
