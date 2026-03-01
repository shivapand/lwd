'use strict';

const villainCandidateGet = (characters) => {

  const heroCastIndex = characters.find(
    (character) =>
      !character.castIndex &&
      character.actor?.gender === 'man'
  )?.castIndex;

  return characters.find(
    (character) =>
      character.castIndex > 0 &&
      character.castIndex !== heroCastIndex &&
      character.actor?.gender === 'man'
  ) || null;
};

const charactersAssignedGet = (characters, antagonist) =>

  characters.reduce(
    (memo, character) => [
      ...memo,
      (character.text === antagonist?.text)
        ? { ...character, role: 'villain' }
        : character
    ],
    []
  );

export default async (
  _characters,
  title
) => {

  const antagonist = villainCandidateGet(
    _characters
  );

  const characters = charactersAssignedGet(
    _characters,
    antagonist
  );

  return characters;
};
