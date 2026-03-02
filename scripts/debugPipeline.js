'use strict';

import movieDataBasicGet
  from '~/js/server/schema/mutations/fns/movieDataBasicGet';
import charactersGet
  from '~/js/server/schema/mutations/fns/charactersGet';
import wikidataRolesGet
  from '~/js/server/schema/mutations/fns/wikidataRolesGet';
import cardsCharactersAssignedGet
  from '~/js/server/schema/mutations/fns/cardsCharactersAssignedGet';
import cardsCharacterAssignedGet
  from '~/js/server/schema/mutations/fns/cardsCharacterAssignedGet';
import charactersMetaStarringAssignedGet
  from '~/js/server/schema/mutations/fns/charactersMetaStarringAssignedGet';
import charactersMetaRoleAssignedGet
  from '~/js/server/schema/mutations/fns/charactersMetaRoleAssignedGet';
import charactersMetaRenderAssignedGet
  from '~/js/server/schema/mutations/fns/charactersMetaRenderAssignedGet';
import cardsMetaAssignedGet
  from '~/js/server/schema/mutations/fns/cardsMetaAssignedGet';
import deckSpoofableGet
  from '~/js/server/schema/mutations/fns/deckSpoofableGet';

const title = process.argv[2] ||
  'The Matrix';

const debug = async () => {

  // eslint-disable-next-line no-console
  const log = console.log.bind(console);

  log(`=== Debug Pipeline for "${title}" ===`);

  log('\n=== Step 1: movieDataBasicGet ===');
  const movieDataBasic = await movieDataBasicGet(title, 5);
  log(`  Cast count: ${movieDataBasic?.cast?.length}`);
  log(`  Plot cards: ${movieDataBasic?.plot?.length}`);

  log('\n=== Step 2: charactersGet ===');
  let characters = await charactersGet(movieDataBasic.cast, movieDataBasic.plot);
  log(`  Characters count: ${characters?.length}`);

  log('\n=== Step 3: wikidataRolesGet ===');
  const wikidataRoles = await wikidataRolesGet(characters, title).catch(() => ({}));
  log('  Wikidata Roles:');
  ['hero', 'heroine', 'villain'].forEach(role => {
    const char = wikidataRoles[role];
    log(`    ${role}: ${char ? char.text : 'null'}`);
  });

  // Merge logic
  characters = characters.map(c => {
    const wikidataRole = Object.keys(wikidataRoles).find(k => wikidataRoles[k]?.text === c.text);
    return wikidataRole ? { ...c, role: wikidataRole } : c;
  });

  log('\n=== Step 4: Cards Assignment ===');
  let cards = cardsCharactersAssignedGet(movieDataBasic.plot, characters);
  cards = cardsCharacterAssignedGet(cards);
  log(`  Cards count: ${cards?.length}`);

  log('\n=== Step 5: Meta Assignment ===');
  characters = charactersMetaStarringAssignedGet(characters, cards);
  characters = await charactersMetaRoleAssignedGet(characters);
  characters = charactersMetaRenderAssignedGet(characters);
  cards = cardsMetaAssignedGet(cards, characters);

  characters.forEach((c, i) => {
    log(`  Char ${i}: ${c.text} role=${c.role} starringIndex=${c.starringIndex} render=${c.render}`);
  });

  log('\n=== Step 6: Spoofable ===');
  const spoofable = deckSpoofableGet(characters, cards);
  log(`  Spoofable: ${spoofable}`);

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
