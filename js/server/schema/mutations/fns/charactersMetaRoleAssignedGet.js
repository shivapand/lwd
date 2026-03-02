'use strict';

const ROLE_INDEX = {
  hero: 0,
  heroine: 1,
  villain: 2,
  man: 3,
  woman: 4,
  unknown: 5
};

export default async (
  _characters
) => {

  const characters = _characters.reduce(
    (
      memo,
      character
    ) => {

      const roleIndex = ROLE_INDEX[
        character.role
      ] ?? 5;

      const roleGroupIndex = memo.filter(
        (
          _character
        ) => {

          return (
            _character.role ===
            character.role
          );
        }
      ).length;

      return [
        ...memo,
        {
          ...character,
          roleIndex,
          roleGroupIndex,
          roleMatchIndex: -1
        }
      ];
    },
    []
  );

  return (
    characters
  );
};
