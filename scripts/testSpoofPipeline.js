'use strict';

import movieDataBasicGet
  from '~/js/server/schema/mutations/fns/movieDataBasicGet';
import charactersGet
  from '~/js/server/schema/mutations/fns/charactersGet';
import cardsGet
  from '~/js/server/schema/mutations/fns/cardsGet';
import deckSpoofedGet
  from '~/js/server/schema/mutations/fns/deckSpoofedGet';

// eslint-disable-next-line no-console
const log = console.log.bind(console);

const MOVIES = [
  'The Matrix',
  'Inception',
  'The Dark Knight',
  'Gladiator',
  'Titanic',
  'The Godfather',
  'Pulp Fiction',
  'Fight Club',
  'Forrest Gump',
  'The Shawshank Redemption',
  'Interstellar',
  'The Lion King',
  'Jurassic Park',
  'Avatar',
  'The Avengers',
  'Star Wars',
  'Jaws',
  'Alien',
  'Blade Runner',
  'Terminator 2: Judgment Day',
  'Goodfellas',
  'Braveheart',
  'The Silence of the Lambs',
  'Hero',
  'Kill Bill'
];

const SPOOF_INPUT = {
  hero: 'TestHero'
};

const ROLES = [
  'hero',
  'heroine',
  'villain',
  'man',
  'woman',
  'man'
];

const mockRolesAssignedGet = (
  characters
) => {

  return characters.reduce(
    (memo, character, index) => {

      const role = ROLES[index] ||
        ((index % 2 === 0) ? 'man' : 'woman');

      return [
        ...memo,
        {
          ...character,
          actor: {
            ...character.actor,
            gender: (
              role === 'heroine' ||
              role === 'woman'
            )
              ? 'woman'
              : 'man'
          },
          role,
          starringIndex: index,
          roleMatchIndex: -1,
          dualRoleIndex: -1,
          roleIndex: ROLES.indexOf(role),
          roleGroupIndex: memo.filter(
            (m) => m.role === role
          ).length
        }
      ];
    },
    []
  );
};

const wordBoundaryCheckGet = (
  text,
  name
) => {

  const escaped = name.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const allRegex = new RegExp(
    escaped,
    'gi'
  );

  const boundaryRegex = new RegExp(
    `\\b${escaped}\\b`,
    'gi'
  );

  const allMatches = (
    text.match(allRegex) || []
  ).length;

  const boundaryMatches = (
    text.match(boundaryRegex) || []
  ).length;

  return (allMatches === boundaryMatches)
    ? null
    : {
      name,
      total: allMatches,
      atBoundary: boundaryMatches,
      embedded: allMatches - boundaryMatches
    };
};

const cardCorruptionCheckGet = (
  card,
  characters
) => {

  const spoofedText = card.text;

  const uniqueNames = characters
    .map((c) => c.text)
    .filter(
      (name, i, arr) =>
        arr.indexOf(name) === i
    );

  return uniqueNames.reduce(
    (memo, spoofName) => {

      const violation = wordBoundaryCheckGet(
        spoofedText,
        spoofName
      );

      return (!violation)
        ? memo
        : [
          ...memo,
          {
            ...violation,
            cardText: spoofedText.substring(0, 100)
          }
        ];
    },
    []
  );
};

const doubleInsertCheckGet = (
  card,
  characters
) => {

  const uniqueNames = characters
    .map((c) => c.text)
    .filter(
      (name, i, arr) =>
        arr.indexOf(name) === i
    );

  return uniqueNames.reduce(
    (memo, name) => {

      const escaped = name.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      const re = new RegExp(
        `\\b${escaped}\\b`,
        'gi'
      );

      const origRe = new RegExp(
        `\\b${escaped}\\b`,
        'gi'
      );

      const spoofCount = (
        card.text.match(re) || []
      ).length;

      const origCount = (
        card._text.match(origRe) || []
      ).length;

      return (spoofCount <= origCount + 1)
        ? memo
        : [
          ...memo,
          {
            name,
            spoofCount,
            origCount,
            cardText: card.text.substring(0, 100)
          }
        ];
    },
    []
  );
};

const movieTestGet = async (
  title,
  index
) => {

  const movieDataBasic = await movieDataBasicGet(
    title,
    5
  )
    .catch(
      () => null
    );

  return (
    !movieDataBasic?.plot ||
    !movieDataBasic?.cast
  )
    ? (() => {

      log(
        `  [${index + 1}] SKIP ${title}: no data`
      );

      return {
        title,
        status: 'SKIP',
        issues: []
      };
    })()
    : await (async () => {

      const characters = await charactersGet(
        movieDataBasic.cast,
        movieDataBasic.plot
      );

      const cards = cardsGet(
        movieDataBasic.plot,
        characters
      );

      const roledCharacters = mockRolesAssignedGet(
        characters
      );

      const deck = {
        splash: {
          title: movieDataBasic.title,
          poster: movieDataBasic.poster,
          characters: roledCharacters,
          spoofable: true
        },
        cards
      };

      const spoofed = deckSpoofedGet(
        deck,
        SPOOF_INPUT
      );

      const spoofedChars = spoofed.splash.characters;

      const embeddedIssues = spoofed.cards.reduce(
        (memo, card, cardIndex) => {

          const violations = cardCorruptionCheckGet(
            card,
            spoofedChars
          );

          return (violations.length === 0)
            ? memo
            : [
              ...memo,
              ...violations.map(
                (v) => ({
                  type: 'EMBEDDED',
                  ...v,
                  cardIndex
                })
              )
            ];
        },
        []
      );

      const doubleIssues = spoofed.cards.reduce(
        (memo, card, cardIndex) => {

          const violations = doubleInsertCheckGet(
            card,
            spoofedChars
          );

          return (violations.length === 0)
            ? memo
            : [
              ...memo,
              ...violations.map(
                (v) => ({
                  type: 'DOUBLED',
                  ...v,
                  cardIndex
                })
              )
            ];
        },
        []
      );

      const issues = [
        ...embeddedIssues,
        ...doubleIssues
      ];

      const roleBreakdown = roledCharacters.reduce(
        (memo, c) => ({
          ...memo,
          [c.role]: (memo[c.role] || 0) + 1
        }),
        {}
      );

      const status = (issues.length === 0)
        ? 'PASS'
        : 'FAIL';

      log(
        `  [${index + 1}] ${status} ${
          movieDataBasic.title
        } | chars=${
          roledCharacters.length
        } roles=${
          JSON.stringify(roleBreakdown)
        } cards=${spoofed.cards.length}`
      );

      issues.forEach(
        (issue) => {

          log(
            `    ${issue.type}: "${
              issue.name
            }" ${
              issue.type === 'EMBEDDED'
                ? `found ${issue.embedded}x inside words`
                : `appears ${issue.spoofCount}x (orig ${issue.origCount}x)`
            } in card ${
              issue.cardIndex
            }: ${issue.cardText}...`
          );
        }
      );

      return {
        title: movieDataBasic.title,
        status,
        issues
      };
    })();
};

const run = async () => {

  log('=== Spoof Pipeline Test: 25 Movies ===\n');

  const results = [];

  const _fn = async (index) => {

    return (index >= MOVIES.length)
      ? results
      : movieTestGet(
        MOVIES[index],
        index
      )
        .then(
          (result) => {

            results.push(result);

            return _fn(index + 1);
          }
        );
  };

  await _fn(0);

  const passed = results.filter(
    (r) => r.status === 'PASS'
  ).length;

  const failed = results.filter(
    (r) => r.status === 'FAIL'
  ).length;

  const skipped = results.filter(
    (r) => r.status === 'SKIP'
  ).length;

  log(
    `\n=== Results: ${passed} PASS / ${
      failed
    } FAIL / ${skipped} SKIP ===`
  );

  (failed > 0) &&
    log(
      '\nFailed movies:',
      results
        .filter((r) => r.status === 'FAIL')
        .map((r) => r.title)
        .join(', ')
    );

  process.exit(
    (failed > 0)
      ? 1
      : 0
  );
};

run()
  .catch(
    (error) => {

      // eslint-disable-next-line no-console
      console.error(
        'Test failed:', error
      );
      process.exit(1);
    }
  );
