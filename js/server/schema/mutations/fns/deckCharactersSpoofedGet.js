'use strict';

import spoofNamesGetFn from './spoofNamesGet';
import charactersSortedByStarringIndexGet 
  from './charactersSortedByStarringIndexGet';

const spoofNameCapitalizedGetFn = (
  _spoofName
) => {

  return _spoofName.split(
    ''
  )
    .map(
      (
        letter,
        index
      ) => {

        if (
          !index
        ) {

          return letter.toUpperCase();
        }

        return (
          letter
        );
      }
    )
    .join(
      ''
    );
};

const spoofNameCapitalizedGet = (
  spoofName
) => {

  return spoofName.split(
    /\s/
  )
    .map(
      (
        _spoofName
      ) => {

        return spoofNameCapitalizedGetFn(
          _spoofName
        );
      }
    )
    .join(
      '-'
    );
};

const spoofNamesShuffledGet = (
  spoofNames
) => {

  return spoofNames.map(
    (
      spoofName
    ) => {

      return {
        value: spoofName,
        random: Math.random() 
      };
    }
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
        }
      }
    )
    .map(
      (
        {
          value
        }
      ) => {

        return (
          value
        );
      }
    );
};

const characterGroupsSpoofNameAssignedGetFn = (
  _characterGroups,
  _spoofNames
) => {

  const spoofNames = spoofNamesShuffledGet(
    _spoofNames
  );

  const characterGroups = _characterGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      return [
        ...memo,
        characterGroup.reduce(
          (
            memo,
            character
          ) => {

            const text = spoofNames[
              character.roleGroupIndex
            ] ||
            character.text;

            return [
              ...memo,
              {
                ...character,
                text,
                _text: character.text
              }
            ];
          },
          []
        )
      ];
    },
    []
  );

  return (
    characterGroups
  );
};

const characterGroupsSpoofNameAssignedGet = (
  _characterGroups,
  spoofNames,
  spoofInput
) => {

  const heroGroups = 
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      0
    ],
    [
      spoofNameCapitalizedGet(
        spoofInput?.hero ||
        spoofNamesShuffledGet(
          spoofNames.hero
        )[
          0
        ]
      )
    ]
  );

  const heroineGroups = 
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      1
    ],
    [
      spoofNameCapitalizedGet(
        spoofInput?.heroine ||
        spoofNamesShuffledGet(
          spoofNames.heroine
        )[
          0
        ]
      )
    ]
  );

  const villainGroups = 
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      2
    ],
    [
      spoofNameCapitalizedGet(
        spoofInput?.villain ||
        spoofNamesShuffledGet(
          spoofNames.villain
        )[
          0
        ]
      )
    ]
  );

  const manGroups = 
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      3
    ],
    spoofNames.man
  );

  const womanGroups =
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      4
    ],
    spoofNames.woman
  );

  const unknownGroups =
  characterGroupsSpoofNameAssignedGetFn(
    _characterGroups[
      5
    ],
    spoofNames.unknown
  );

  const characterGroups = [
    heroGroups,
    heroineGroups,
    villainGroups,
    manGroups,
    womanGroups,
    unknownGroups
  ];

  return (
    characterGroups
  );
};

const charactersGet = (
  characterGroups
) => {

  return characterGroups.reduce(
    (
      memo,
      _characterGroups
    ) => {

      const characters = _characterGroups.reduce(
        (
          memo,
          characterGroup
        ) => {

          return [
            ...memo,
            ...characterGroup.reduce(
              (
                memo,
                character
              ) => {

                return [
                  ...memo,
                  character
                ];
              },
              []
            )
          ];
        },
        []
      );

      return [
        ...memo,
        ...characters
      ];
    },
    []
  );
};

const characterGroupsGet = (
  _characters
) => {

  return [
    'hero',
    'heroine',
    'villain',
    'man',
    'woman',
    'unknown'
  ]
    .reduce(
      (
        memo,
        role
      ) => {

        const characters = _characters.filter(
          (
            character
          ) => {

            return (
              character.role ===
              role
            );
          }
        );

        const characterSubGroups = characters.reduce(
          (
            memo,
            character
          ) => {

            const index = character.roleGroupIndex;

            return [
              ...memo.slice(
                0, index
              ),
              [
                ...memo[
                  index
                ] ||
                [],
                character
              ],
              ...memo.slice(
                index + 1
              )
            ];
          },
          []
        );

        return [
          ...memo,
          characterSubGroups
        ];
      },
      []
    );
};

export default (
  _characters,
  spoofInput
) => {

  let characterGroups = characterGroupsGet(
    _characters
  );

  const spoofNames = spoofNamesGetFn();

  characterGroups = characterGroupsSpoofNameAssignedGet(
    characterGroups,
    spoofNames,
    spoofInput
  );

  let characters = charactersGet(
    characterGroups
  );

  characters = charactersSortedByStarringIndexGet(
    characters
  );

  return (
    characters
  );
};
