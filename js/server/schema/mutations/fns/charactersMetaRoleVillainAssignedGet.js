'use strict';

import hfInferenceFetch from './hfInferenceFetch';

const HF_MODEL = 'facebook/bart-large-mnli';

const VILLAIN_THRESHOLD = 0.4;

const CANDIDATE_LABELS = [
  'villain',
  'hero',
  'supporting character'
];

const classifyCharacter = async (characterName, title) =>

  hfInferenceFetch(
    HF_MODEL,
    {
      inputs: `${characterName} is a character in ${title}`,
      parameters: {
        candidate_labels: CANDIDATE_LABELS
      }
    }
  );

const villainGet = async (characters, title) => {

  const uniqueCharacters = characters.reduce(
    (memo, character) =>
      memo.find((m) => m.text === character.text)
        ? memo
        : [...memo, character],
    []
  );

  const classificationCollection = await Promise.all(
    uniqueCharacters.map(
      (character) =>
        classifyCharacter(character.characterNameFull || character.text, title)
          .then(
            (result) => ({
              text: character.text,
              villainScore: (Array.isArray(result))
                ? (result.find((r) => r.label === 'villain')?.score || 0)
                : 0
            })
          )
          .catch(() => ({ text: character.text, villainScore: 0 }))
    )
  );

  const villainMatch = classificationCollection
    .filter(({ villainScore }) => villainScore > VILLAIN_THRESHOLD)
    .sort((a, b) => b.villainScore - a.villainScore)[0];

  return villainMatch
    ? characters.find(
      (character) => character.text === villainMatch.text
    )
    : null;
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

  const antagonist = await villainGet(
    _characters,
    title
  )
    .catch(() => null);

  const characters = charactersAssignedGet(
    _characters,
    antagonist
  );

  return characters;
};
