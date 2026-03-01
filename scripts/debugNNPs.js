'use strict';

import movieDataBasicGet
  from '~/js/server/schema/mutations/fns/movieDataBasicGet';
import plotNNPsGet
  from '~/js/server/schema/mutations/fns/plotNNPsGet';
import castNNPsGet
  from '~/js/server/schema/mutations/fns/castNNPsGet';
import NNPsCrossMatchesGet
  from '~/js/server/schema/mutations/fns/NNPsCrossMatchesGet';

const title = process.argv[2] ||
  'The Matrix';

const debug = async () => {

  // eslint-disable-next-line no-console
  const log = console.log.bind(console);

  const movieDataBasic = await movieDataBasicGet(
    title,
    5
  );

  log('=== Cast NNPs ===');

  const castNNPs = castNNPsGet(
    movieDataBasic.cast
  );

  castNNPs.slice(0, 15).forEach(
    (nnp, i) => {

      log(
        `  ${i}: "${
          nnp.text
        }" castIndex=${
          nnp.castIndex
        } distance=${
          nnp.distance
        }`
      );
    }
  );

  log('\n=== Plot NNPs ===');

  const plotNNPs = plotNNPsGet(
    movieDataBasic.plot
  );

  plotNNPs.forEach(
    (nnp, i) => {

      log(
        `  ${i}: "${
          nnp.text
        }" sentence=${
          nnp.sentenceIndex
        } distance=${
          nnp.distance
        }`
      );
    }
  );

  log('\n=== Cross Matches ===');

  const matches = NNPsCrossMatchesGet(
    plotNNPs,
    castNNPs,
    false
  );

  matches.forEach(
    (match, i) => {

      log(
        `  ${i}: plot="${
          plotNNPs[match.NNPIndex]?.text
        }" <-> cast="${
          castNNPs[match._NNPIndex]?.text
        }" text="${
          match.text
        }"`
      );
    }
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
