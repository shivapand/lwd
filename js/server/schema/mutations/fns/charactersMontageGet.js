'use strict';

import {
  ObjectID
} from 'mongodb';
import {
  exec
} from 'child_process';

import {
  actorImageFindOne
} from '~/js/server/data/actorImage';
import {
  outputResGet
} from '~/js/server/fns/variable';
import base64FilterAppliedGet from 
  './base64FilterAppliedGet';
import base64TextCompositedGet from './base64TextCompositedGet';
import base64MiffStreamsConcatedGet from 
  './base64MiffStreamsConcatedGet';

const charactersBase64AssignedGetFn = (
  character,
  db
) => {

  if (
    !character.render
  ) {

    return Promise.resolve(
      null
    );
  }

  return actorImageFindOne(
    {
      _id: new ObjectID(
        character.actorImageId
      )
    },
    undefined,
    db
  )
    .then(
      (
        {
          base64
        }
      ) => {

        return (
          base64
        );
      }
    );
};

const charactersBase64AssignedGet = (
  characters,
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

          return charactersBase64AssignedGetFn(
            character,
            db
          )
            .then(
              (
                result
              ) => {

                if (
                  result
                ) {

                  return [
                    ...res,
                    {
                      ...character,
                      base64: result
                    }
                  ];
                }

                return [
                  ...res,
                  character
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

const charactersFilterTypeAssignedGetFn = (
  character
) => {

  switch (
    true
  ) {

    case (
      character.role !==
      'hero'
    ) :

      return (
        'giphy'
      );

    case (
      character.dualRoleIndex >=
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

const charactersFilterTypeAssignedGet = (
  _characters
) => {

  const characters = _characters.reduce(
    (
      memo,
      _character
    ) => {

      const filterType = charactersFilterTypeAssignedGetFn(
        _character
      );

      return [
        ...memo,
        {
          ..._character,
          filterType
        }
      ];
    },
    []
  );

  return (
    characters
  );
};

const charactersFilterAppliedGet = (
  characters
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

          if (
            character.base64 &&
            character.filterType
          ) {

            return base64FilterAppliedGet(
              character
            )
              .then(
                (
                  result
                ) => {

                  return [
                    ...res,
                    {
                      ...character,
                      base64: result
                    }
                  ];
                }
              );
          }

          return [
            ...res,
            character
          ];
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const characterBase64sGet = (
  characters
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

          if (
            character.render
          ) {

            return base64TextCompositedGet(
              character.base64,
              `
                ${
                  character.renderText
                }
              `
                .trim(),
              outputResGet() / 4,
              46,
              5
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

          return (
            res
          );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const charactersCompositedBase64Get = (
  characterStreamsConcated,
  direction = 'row'
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const proc = exec(
        `
          convert 
          \\(
            miff:-
            -bordercolor transparent
            -border ${
              (direction === 'row') ?
                '2x0' : '0x2'
            }
            -gravity south
            -background none
            ${
              (direction === 'row') ?
                '+' : '-'
            }append
          \\)
          png:-
        `
          .split(
            /\s/
          )
          .reduce(
            (
              memo,
              _command
            ) => {

              return `
                ${
                  memo
                } ${
                  _command
                }
              `
                .trim();
            },
            ''
          ),
        {
          encoding: 'base64'
        },
        (
          error,
          stdout
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          return resolve(
            `
              data:image/png;base64,${
                stdout
              }
            `
              .trim()
          );
        }
      );

      characterStreamsConcated.pipe(
        proc.stdin
      );
    }
  );
};

const charactersMontageGet = async (
  characters
) => {

  if (
    !characters.length
  ) {

    return Promise.resolve(
      null
    );
  }

  const characterBase64s = await characterBase64sGet(
    characters
  );

  const characterRows = characterBase64s.reduce(
    (
      memo,
      characterBase64,
      index
    ) => {

      if (
        index % 3
      ) {

        return [
          ...memo.slice(
            0, -1
          ),
          [
            ...memo[
              memo.length - 1
            ], 
            characterBase64
          ]
        ];
      }

      return [
        ...memo,
        [
          characterBase64
        ]
      ];
    },
    []
  );

  const characterRowStreams = await characterRows.reduce(
    (
      memo,
      characterBase64Row
    ) => {

      return memo.then(
        (
          res
        ) => {

          return base64MiffStreamsConcatedGet(
            characterBase64Row
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

  const characterRowCompositedBase64s = 
    await characterRowStreams.reduce(
      (
        memo,
        characterRowStream
      ) => {

        return memo.then(
          (
            res
          ) => {

            return charactersCompositedBase64Get(
              characterRowStream,
              'row'
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

  const characterRowCompositedStreams = 
    await base64MiffStreamsConcatedGet(
      characterRowCompositedBase64s
    );

  const charactersCompositedBase64 = 
    await charactersCompositedBase64Get(
      characterRowCompositedStreams,
      'column'
    );

  return (
    charactersCompositedBase64
  );
};

export default async (
  _characters,
  db
) => {

  let characters = await charactersBase64AssignedGet(
    _characters,
    db
  );

  characters = charactersFilterTypeAssignedGet(
    characters
  );

  characters = await charactersFilterAppliedGet(
    characters
  );

  const charactersMontageBase64 = 
    await charactersMontageGet(
      characters
    );

  return (
    charactersMontageBase64
  );
};
