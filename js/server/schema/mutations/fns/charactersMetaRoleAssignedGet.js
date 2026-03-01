'use strict';

import charactersMetaRoleVillainAssignedGet
  from './charactersMetaRoleVillainAssignedGet';
import NNPCrossMatchesGet from './NNPCrossMatchesGet';
import charactersSortedByStarringIndexGet 
  from './charactersSortedByStarringIndexGet';

const _NNPsGet = (
  characters
) => {

  return characters.map(
    (
      {
        text
      },
      index
    ) => {

      return {
        text,
        index
      };
    }
  );
};

const roleExistsGet = (
  character,
  characters
) => {

  const NNP = {
    text: character.text,
    index: 0
  };

  const _NNPs = _NNPsGet(
    characters
  );

  const matches = NNPCrossMatchesGet(
    NNP,
    _NNPs
  );

  return matches?.[
    0
  ];
};

const charactersRoleMatchIndexAssignedGet = (
  characters
) => {

  return characters.reduce(
    (
      memo,
      character
    ) => {

      const roles = memo.filter(
        (
          _memo
        ) => {

          return (
            _memo.castIndex ===
            character.castIndex
          );
        }
      );

      const match = roleExistsGet(
        character,
        roles
      );

      const roleMatchIndex = (
        match &&
        (
          roles[
            match._NNPIndex
          ]
            .roleMatchIndex ===
          -1
        )
      ) ?
        roles[
          match._NNPIndex
        ]
          .starringIndex :
        -1;

      const dualRoleIndex = roles.findIndex(
        (
          role
        ) => {

          return (
            (
              !character.castIndex
            ) &&
            (
              role.dualRoleIndex === 
              -1
            ) &&
            (
              roleMatchIndex ===
              -1
            )
          );
        }
      );

      return [
        ...memo,
        {
          ...character,
          roleMatchIndex,
          dualRoleIndex
        }
      ];
    },
    []
  );
};

const charactersMetaHeroineAssignedGet = (
  characters
) => {

  const existingHeroine = characters.find(
    (character) => character.role === 'heroine'
  );

  const match = existingHeroine ||
    characters.find(
      (character) =>
        character.actor.gender === 'woman' &&
        character.castIndex > 0 &&
        character.profileImage
    ) ||
    characters.find(
      (character) =>
        character.actor.gender === 'woman' &&
        character.castIndex > 0
    );

  return (!match)
    ? characters
    : [
      ...characters.slice(
        0,
        match.starringIndex
      ),
      {
        ...match,
        role: 'heroine'
      },
      ...characters.slice(
        match.starringIndex +
        1
      )
    ];
};

const characterGroupsGet = (
  characters
) => {

  let characterGroups = characters.reduce(
    (
      memo,
      character
    ) => {

      const roleMatchIndex = character.roleMatchIndex;

      if (
        roleMatchIndex >=
        0
      ) {

        return [
          ...memo.slice(
            0, roleMatchIndex
          ),
          [
            ...memo[
              roleMatchIndex
            ],
            character
          ],
          ...memo.slice(
            roleMatchIndex + 1
          ),
          null
        ];
      }

      return [
        ...memo,
        [
          character
        ]
      ];
    },
    []
  );

  characterGroups = characterGroups.filter(
    (
      characterGroup
    ) => {

      return (
        characterGroup
      );
    }
  );

  return (
    characterGroups
  );
};

const characterGroupsOrderedGet = (
  characterGroups
) => {

  let heroGroups = characterGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const match = characterGroup.find(
        (
          character
        ) => {

          return (
            character.role === 'hero' ||
            (
              !character.castIndex &&
              (
                character.actor.gender ===
                'man'
              )
            )
          );
        }
      );

      if (
        match
      ) {

        return [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'hero'
              };
            }
          )
        ];
      }

      return (
        memo
      );
    },
    []
  );

  let heroineGroups = characterGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const match = characterGroup.find(
        (
          character
        ) => {

          return (
            character.role ===
            'heroine'
          );
        }
      );

      if (
        match
      ) {

        return [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'heroine'
              };
            }
          )
        ];
      }

      return (
        memo
      );
    },
    []
  );

  const heroCastIndexCollection = heroGroups.reduce(
    (
      memo,
      group
    ) => {

      return [
        ...memo,
        ...group.map(
          (
            character
          ) => {

            return (
              character.castIndex
            );
          }
        )
      ];
    },
    []
  );

  let villainGroups = characterGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const heroOverlapFlag = characterGroup.find(
        (
          character
        ) => {

          return heroCastIndexCollection.includes(
            character.castIndex
          );
        }
      );

      const match = (
        !heroOverlapFlag
      ) &&
        characterGroup.find(
          (
            character
          ) => {

            return (
              character.role ===
              'villain'
            );
          }
        );

      return (
        !match
      )
        ? memo
        : [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'villain'
              };
            }
          )
        ];
    },
    []
  );

  const otherGroups = characterGroups.filter(
    (
      characterGroup
    ) => {

      const characterGroupCastIndex = characterGroup[
        0
      ]
        .castIndex;

      const heroCastIndex = heroGroups[
        0
      ]?.[
        0
      ]?.castIndex;

      const heroineCastIndex = heroineGroups[
        0
      ]?.[
        0
      ]?.castIndex;

      const villainCastIndex = villainGroups[
        0
      ]?.[
        0
      ]?.castIndex;

      return (
        (
          characterGroupCastIndex !==
          heroCastIndex
        ) &&
        (
          characterGroupCastIndex !==
          heroineCastIndex
        ) &&
        (
          characterGroupCastIndex !==
          villainCastIndex
        )
      );
    }
  );

  const manGroups = otherGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const match = characterGroup.find(
        (
          character
        ) => {

          return (
            character.actor.gender ===
            'man'
          );
        }
      );

      if (
        match
      ) {

        return [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'man'
              };
            }
          )
        ];
      }

      return (
        memo
      );
    },
    []
  );

  const womanGroups = otherGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const match = characterGroup.find(
        (
          character
        ) => {

          return (
            character.actor.gender ===
            'woman'
          );
        }
      );

      if (
        match
      ) {

        return [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'woman'
              };
            }
          )
        ];
      }

      return (
        memo
      );
    },
    []
  );

  const unknownGroups = otherGroups.reduce(
    (
      memo,
      characterGroup
    ) => {

      const match = characterGroup.find(
        (
          character
        ) => {

          return (
            character.actor.gender ===
            'unknown'
          );
        }
      );

      if (
        match
      ) {

        return [
          ...memo,
          characterGroup.map(
            (
              character
            ) => {

              return {
                ...character,
                role: 'unknown'
              };
            }
          )
        ];
      }

      return (
        memo
      );
    },
    []
  );

  return [
    heroGroups,
    heroineGroups,
    villainGroups,
    manGroups,
    womanGroups,
    unknownGroups
  ];
};

const charactersGet = (
  characterGroups
) => {

  return characterGroups.reduce(
    (
      memo,
      _characterGroups,
      roleIndex
    ) => {

      const characters = _characterGroups.reduce(
        (
          memo,
          characterGroup,
          roleGroupIndex
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
                  {
                    ...character,
                    roleIndex,
                    roleGroupIndex
                  }
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

const charactersRoleAssignedGet = async (
  _characters
) => {

  let characters =
  await charactersMetaRoleVillainAssignedGet(
    _characters
  );

  characters = charactersMetaHeroineAssignedGet(
    characters
  );

  let characterGroups = characterGroupsGet(
    characters
  );

  characterGroups = characterGroupsOrderedGet(
    characterGroups
  );

  characters = charactersGet(
    characterGroups
  );

  characters = charactersSortedByStarringIndexGet(
    characters
  );

  return (
    characters
  );
};

export default async (
  _characters
) => {

  let characters = charactersRoleMatchIndexAssignedGet(
    _characters
  );

  characters = await charactersRoleAssignedGet(
    characters
  );

  return (
    characters
  );
};
