'use strict';

import movieDataBasicGet
  from '~/js/server/schema/mutations/fns/movieDataBasicGet';
import charactersGet
  from '~/js/server/schema/mutations/fns/charactersGet';
import wikidataRolesGet
  from '~/js/server/schema/mutations/fns/wikidataRolesGet';

const title = process.argv[2] ||
  'The Matrix';

const debug = async () => {

  // eslint-disable-next-line no-console
  const log = console.log.bind(console);

  log(`=== Final Role Integration Debug for "${title}" ===`);

  const movieDataBasic = await movieDataBasicGet(
    title,
    5
  );

  let characters = await charactersGet(
    movieDataBasic.cast,
    movieDataBasic.plot
  );

  log('Characters from LLM:');
  characters.forEach(c => log(`  ${c.text} (role: ${c.role})`));

  log('\n=== Calling wikidataRolesGet ===');

  const wikidataRoles = await wikidataRolesGet(
    characters,
    title
  );

  log('Wikidata Roles:');
  ['hero', 'heroine', 'villain'].forEach(role => {
    const char = wikidataRoles[role];
    log(`  ${role}: ${char ? char.text : 'null'}`);
  });

  log('\n=== Merging Roles (logic from deckGet.js) ===');

  const finalCharacters = characters.map(
    (character) => {

      const wikidataRole = Object.keys(wikidataRoles).find(
        (key) => wikidataRoles[key]?.text === character.text
      );

      return (wikidataRole)
        ? { ...character, role: wikidataRole }
        : character;
    }
  );

  log('Final Merged Characters:');
  finalCharacters.forEach(c => log(`  ${c.text} (role: ${c.role})`));

  process.exit(0);
};

debug()
  .catch(
    (error) => {
      // eslint-disable-next-line no-console
      console.error(
        'Debug failed:', error
      );
      process.exit(1);
    }
  );
