'use strict';

const heroExistsGet = (
  characters
) => {

  return characters.find(
    (
      character
    ) => {

      return (
        !character.roleIndex
      );
    }
  );
};

const textIsLengthyGet = (
  cards
) => {

  return cards
    .reduce(
      (
        memo,
        {
          text
        }
      ) => {

        if (
          !memo &&
          (
            text.length >
            (
              100 + 
              25
            )
          )
        ) {

          return (
            true
          );
        }

        return (
          memo
        );
      },
      false
    );
};

export default (
  characters,
  cards
) => {

  const heroExists = heroExistsGet(
    characters
  );

  const textIsLengthy = textIsLengthyGet(
    cards
  );

  return (
    !!heroExists &&
    !textIsLengthy
  );
};
