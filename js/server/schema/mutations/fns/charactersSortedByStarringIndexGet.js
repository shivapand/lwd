'use strict';

export default (
  characters
) => {

  return characters.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a.starringIndex >
          b.starringIndex
        ) :

          return 1;

        case (
          b.starringIndex >
          a.starringIndex
        ) :

          return -1;
      }
    }
  );
};

