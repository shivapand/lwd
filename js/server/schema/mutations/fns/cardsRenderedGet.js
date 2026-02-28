'use strict';

import cardsBase64AssignedGet from 
  './cardsBase64AssignedGet';
import base64FilterAppliedGet from 
  './base64FilterAppliedGet';
import base64TextCompositedGet from 
  './base64TextCompositedGet';

import {
  outputResGet
} from '~/js/server/fns/variable';

const cardsFilterTypeAssignedGetFn = (
  card
) => {

  switch (
    true
  ) {

    case (
      card?.character?.role !==
      'hero'
    ) :

      return(
        'giphy'
      );

    case (
      card.dualRoleIndex >=
      0
    ) :

      return (
        'dualRole'
      );

    default : 

      return (
        null
      );
  }
};

const cardsFilterTypeAssignedGet = (
  _cards
) => {

  const cards = _cards.reduce(
    (
      memo,
      _card
    ) => {

      const filterType = cardsFilterTypeAssignedGetFn(
        _card
      );

      return [
        ...memo,
        {
          ..._card,
          filterType
        }
      ];
    },
    []
  );

  return (
    cards
  );
};

const cardsFilterAppliedGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      card
    ) => {

      return memo.then(
        (
          res
        ) => {

          if (
            card.filterType
          ) {

            return base64FilterAppliedGet(
              card
            )
              .then(
                (
                  result
                ) => {

                  return [
                    ...res,
                    {
                      ...card,
                      base64: result
                    }
                  ];
                }
              );
          }

          return [
            ...res,
            card
          ];
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const cardsRenderedGet = (
  cards
) => {

  return cards.reduce(
    (
      memo,
      card
    ) => {

      return memo.then(
        (
          res
        ) => {

          return base64TextCompositedGet(
            card.base64,
            card.renderText,
            outputResGet(),
            20,
            10
          )
            .then(
              (
                result
              ) => {

                return [
                  ...res,
                  result
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
  _cards,
  db
) => {

  let cards = await cardsBase64AssignedGet(
    _cards,
    db
  );

  cards = cardsFilterTypeAssignedGet(
    cards
  );

  cards = await cardsFilterAppliedGet(
    cards
  );

  const base64s = await cardsRenderedGet(
    cards
  );

  return (
    base64s
  );
};
