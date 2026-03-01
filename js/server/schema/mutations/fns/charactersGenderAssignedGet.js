'use strict';

export default async (
  _characters
) => {

  const characters = _characters.reduce(
    (memo, character) => {

      const gender = character.actor?.gender || 'unknown';

      return [
        ...memo,
        {
          ...character,
          role: character.role || gender,
          actor: {
            ...character.actor,
            gender
          }
        }
      ];
    },
    []
  );

  return characters;
};
