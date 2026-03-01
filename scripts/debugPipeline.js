'use strict';

import mongoClientConnect
  from '~/js/server/fns/mongoClientConnect';
import movieDataBasicGet
  from '~/js/server/schema/mutations/fns/movieDataBasicGet';
import charactersGet
  from '~/js/server/schema/mutations/fns/charactersGet';
import cardsGet
  from '~/js/server/schema/mutations/fns/cardsGet';
import charactersGenderAssignedGet
  from '~/js/server/schema/mutations/fns/charactersGenderAssignedGet';
import charactersMetaAssignedGet
  from '~/js/server/schema/mutations/fns/charactersMetaAssignedGet';
import cardsMetaAssignedGet
  from '~/js/server/schema/mutations/fns/cardsMetaAssignedGet';
import deckSpoofableGet
  from '~/js/server/schema/mutations/fns/deckSpoofableGet';

const title = process.argv[2] ||
  'The Matrix';

const debug = async () => {

  // eslint-disable-next-line no-console
  const log = console.log.bind(console);

  log('=== Step 1: movieDataBasicGet ===');

  const movieDataBasic = await movieDataBasicGet(
    title,
    5
  );

  log(
    'Cast count:', movieDataBasic?.cast?.length
  );

  (movieDataBasic?.cast || [])
    .slice(0, 8)
    .forEach(
      (c, i) => {

        log(
          `  Cast ${i}: actor=${
            c.actor?.text
          } ud=${
            c.actor?.ud
          } role=${
            c.role?.substring(0, 60)
          }`
        );
      }
    );

  log(
    'Plot cards:', movieDataBasic?.plot?.length
  );

  log('\n=== Step 2: charactersGet ===');

  const characters = await charactersGet(
    movieDataBasic.cast,
    movieDataBasic.plot,
    movieDataBasic.plotText
  );

  log(
    'Characters count:', characters?.length
  );

  characters.forEach(
    (c, i) => {

      log(
        `  Char ${i}: ${
          c.text
        } (actor: ${
          c.actor?.text
        }, castIndex: ${
          c.castIndex
        })`
      );
    }
  );

  log('\n=== Step 3: cardsGet ===');

  const cards = cardsGet(
    movieDataBasic.plot,
    characters
  );

  log(
    'Cards count:', cards?.length
  );

  cards.forEach(
    (c, i) => {

      log(
        `  Card ${i}: ${
          c.text?.substring(0, 60)
        }... char=${
          c.character?.text
        }`
      );
    }
  );

  log('\n=== Step 4: charactersGenderAssignedGet ===');

  const genderedChars = await charactersGenderAssignedGet(
    characters
  );

  genderedChars.forEach(
    (c, i) => {

      log(
        `  Char ${i}: ${
          c.text
        } role=${
          c.role
        } actor.gender=${
          c.actor?.gender
        } ud=${
          c.actor?.ud
        }`
      );
    }
  );

  log('\n=== Step 5: charactersMetaAssignedGet ===');

  const metaChars = await charactersMetaAssignedGet(
    genderedChars,
    cards,
    title
  );

  metaChars.forEach(
    (c, i) => {

      log(
        `  Char ${i}: ${
          c.text
        } role=${
          c.role
        } starringIndex=${
          c.starringIndex
        } roleGroupIndex=${
          c.roleGroupIndex
        }`
      );
    }
  );

  log('\n=== Step 6: spoofable ===');

  const finalCards = cardsMetaAssignedGet(
    cards,
    metaChars
  );

  const spoofable = deckSpoofableGet(
    metaChars,
    finalCards
  );

  log(
    'Spoofable:', spoofable
  );

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
