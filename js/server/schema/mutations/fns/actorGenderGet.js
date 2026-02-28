'use strict';

import cheerio from 'cheerio';

import mediawikiFetch from './mediawikiFetch';
import sentencesTokenizedGet from './sentencesTokenizedGet';

const queryGet = (
  actorUd
) => {

  return `
    https://en.wikipedia.org/api/rest_v1/page/mobile-sections-lead/${
      actorUd
    }
  `
    .trim();
};

const sentenceLeadGet = (
  $
) => {

  const [
    paragraphLead
  ] = $(
    'p'
  )
    .toArray()
    .map(
      (
        el
      ) => {

        return $(el)
          .text();
      }
    );

  const sentenceLead = (
    paragraphLead
  ) ?
    sentencesTokenizedGet(
      paragraphLead
    )[
      0
    ] :
    '';

  return (
    sentenceLead
  );
};

const occupationGet = (
  $
) => {

  const occupation = $(
    'th:contains(Occupation)'
  )
    .parent()
    .find('td')
    .text();

  return (
    occupation
  );
};

const textGet = (
  res
) => {

  const sectionLeadText = res.sections[
    0
  ]
    .text;

  const $ = cheerio.load(
    sectionLeadText
  );

  const sentenceLead = sentenceLeadGet(
    $
  );

  const occupation = occupationGet(
    $
  );

  const text =  `
    ${
      sentenceLead
    } ${
      occupation
    }
  `
    .trim();

  return (
    text
  );
};

export default (
  actor
) => {

  const genderUnknown = 'unknown';

  if (
    !actor?.ud
  ) {

    return Promise.resolve(
      genderUnknown
    );
  }

  return mediawikiFetch(
    queryGet(
      encodeURIComponent(
        actor.ud
      )
    )
  )
    .then(
      (
        res
      ) => {

        const text = textGet(
          res
        );

        switch (
          true
        ) {

          case (
            !!text.match(
              /actress/i
            )
          ) :

            return (
              'woman'
            );

          case (
            !!text.match(
              /(actor|comedian)/i
            )
          ) :

            return (
              'man'
            );

          default :

            return (
              genderUnknown
            );
        }
      }
    );
};
