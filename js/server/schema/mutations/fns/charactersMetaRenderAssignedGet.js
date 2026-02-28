'use strict';

const characterExistsGet = (
  character,
  _characters
) => {

  return _characters.find(
    (
      _character
    ) => {

      return (
        (
          _character.roleIndex ===
          character.roleIndex
        ) &&
        (
          _character.roleGroupIndex ===
          character.roleGroupIndex
        )
      );
    }
  );
};

const charactersRenderAssignedGet = (
  _characters 
) => {

  const characters = _characters.reduce(
    (
      memo,
      _character
    ) => {

      const exists = characterExistsGet(
        _character,
        memo
      );

      if (
        _character.starringCardIndexes &&
        (
          _character.dualRoleIndex ===
          -1
        ) &&
        !exists
      ) {
        
        return [
          ...memo,
          {
            ..._character,
            render: true
          }
        ];
      }

      return [
        ...memo,
        {
          ..._character,
          render: false
        }
      ];
    },
    []
  );

  return (
    characters
  );
};

const charactersSplashIndexAssignedGetFn = (
  _characters
) => {

  let characters = _characters.sort(
    (
      a, b
    ) => {

      switch (
        true
      ) {

        case (
          a.render &&
          !b.render
        ) :

          return -1;

        case (
          b.render &&
          !a.render
        ) :

          return 1;

        case (
          a.roleIndex >
          b.roleIndex
        ) :

          return 1;

        case (
          b.roleIndex >
          a.roleIndex
        ) :

          return -1;

        case (
          a.roleGroupIndex >
          b.roleGroupIndex
        ) :

          return 1;

        case (
          b.roleGroupIndex >
          a.roleGroupIndex
        ) :

          return -1;
      }
    }
  );

  characters = characters.reduce(
    (
      memo,
      character,
      index
    ) => {

      if (
        character.render
      ) {

        return [
          ...memo,
          {
            ...character,
            splashIndex: index
          }
        ];
      }

      return [
        ...memo,
        {
          ...character,
          splashIndex: -1
        }
      ];
    },
    []
  );

  return (
    characters
  );
};

const charactersSplashIndexAssignedGet = (
  _characters
) => {

  let __characters = charactersSplashIndexAssignedGetFn(
    [
      ..._characters
    ]
  );

  let characters = _characters.reduce(
    (
      memo,
      _character
    ) => {

      const __character = __characters.find(
        (
          __character
        ) => {

          return (
            __character.starringIndex ===
            _character.starringIndex
          );
        }
      );

      return [
        ...memo,
        {
          ..._character,
          splashIndex: __character.splashIndex
        }
      ];
    },
    []
  );

  return (
    characters
  );
};

export default (
  _characters
) => {

  let characters = charactersRenderAssignedGet(
    _characters
  );

  characters = charactersSplashIndexAssignedGet(
    characters
  );

  return (
    characters
  );
};
