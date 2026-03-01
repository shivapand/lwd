'use strict';

export default (
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
          character
        ) => {

          return (
            character.text ===
            card.character?.text
          );
        }
      );

      if (
        character
      ) {

        return [
          ...memo,
          {
            ...card,
            character: {
              ...card.character,
              role: character.role
            },
            dualRoleIndex: character.dualRoleIndex
          }
        ];
      }

      return [
        ...memo,
        card
      ];
    },
    []
  );
};
