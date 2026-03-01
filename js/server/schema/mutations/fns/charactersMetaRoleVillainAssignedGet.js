'use strict';

import mediawikiFetch from './mediawikiFetch';
import cheerio from 'cheerio';
import wikidataRolesGet from './wikidataRolesGet';

const VILLAIN_KEYWORDS = [
  'antagonist',
  'villain',
  'antagonistic'
];

const wikiTextQueryGet = (title) =>
  `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${
    encodeURIComponent(title)
  }&prop=text&redirects=1&origin=*`;

const villainNameFromTextGet = (text, characters) => {

  const lowerText = text.toLowerCase();

  const keywordIndex = VILLAIN_KEYWORDS.reduce(
    (memo, keyword) => {

      const index = lowerText.indexOf(keyword);

      return (index >= 0 && (memo === -1 || index < memo))
        ? index
        : memo;
    },
    -1
  );

  return (keywordIndex === -1)
    ? null
    : (() => {

      const windowStart = Math.max(0, keywordIndex - 200);
      const windowEnd = Math.min(
        text.length,
        keywordIndex + 200
      );

      const window = text.slice(windowStart, windowEnd);

      return characters.reduce(
        (memo, character) => {

          return (memo)
            ? memo
            : (() => {

              const nameVariants = [
                character.characterNameFull,
                character.text,
                character.actor?.text
              ]
                .filter(Boolean);

              const matchFlag = nameVariants.find(
                (name) =>
                  window.toLowerCase().includes(
                    name.toLowerCase()
                  )
              );

              return (matchFlag &&
                character.castIndex > 0)
                ? character
                : null;
            })();
        },
        null
      );
    })();
};

const villainFromWikipediaGet = async (characters, title) => {

  const json = await mediawikiFetch(
    wikiTextQueryGet(title)
  );

  const html = json?.parse?.text?.['*'];

  return (!html)
    ? null
    : (() => {

      const $ = cheerio.load(html);

      const text = $.text();

      return villainNameFromTextGet(
        text,
        characters
      );
    })();
};

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
  title
) => {

  const wikidataRoles = await wikidataRolesGet(
    _characters,
    title
  )
    .catch(() => ({ hero: null, villain: null, heroine: null }));

  const villainFallback = (!wikidataRoles.villain)
    ? await villainFromWikipediaGet(
      _characters,
      title
    )
      .catch(() => null)
    : null;

  const roles = {
    hero: wikidataRoles.hero,
    heroine: wikidataRoles.heroine,
    villain: wikidataRoles.villain || villainFallback
  };

  const characters = charactersRolesAssignedGet(
    _characters,
    roles
  );

  return characters;
};
