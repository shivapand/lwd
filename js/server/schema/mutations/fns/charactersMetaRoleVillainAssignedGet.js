'use strict';

const characterMatchFromNameGet = (name, characters) =>
  (!name)
    ? null
    : characters.find(
      (character) => {

        const lowerName = name.toLowerCase();

        return [
          character.text,
          character.characterNameFull
        ]
          .filter(Boolean)
          .find(
            (variant) =>
              variant.toLowerCase().includes(lowerName) ||
              lowerName.includes(variant.toLowerCase())
          );
      }
    );

const charactersRolesAssignedGet = (characters, roles) =>

  characters.reduce(
    (memo, character) => [
      ...memo,
      (character.text === roles.villain?.text)
        ? { ...character, role: 'villain' }
        : (character.text === roles.hero?.text)
          ? { ...character, role: 'hero' }
          : (character.text === roles.heroine?.text)
            ? { ...character, role: 'heroine' }
            : character
    ],
    []
  );

export default async (
  _characters,
  title,
  geminiRoles
) => {

  const roles = (!geminiRoles)
    ? { hero: null, heroine: null, villain: null }
    : {
      hero: characterMatchFromNameGet(geminiRoles.hero, _characters),
      heroine: characterMatchFromNameGet(geminiRoles.heroine, _characters),
      villain: characterMatchFromNameGet(geminiRoles.villain, _characters)
    };

  return charactersRolesAssignedGet(_characters, roles);
};
