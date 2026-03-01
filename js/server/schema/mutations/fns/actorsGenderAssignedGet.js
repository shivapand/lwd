'use strict';

import mediawikiFetch from './mediawikiFetch';

const GENDER_MAP = {
  Q6581097: 'man',
  Q6581072: 'woman'
};

const genderMapGet = (
  actors
) => {

  const titlesCollection = actors
    .filter(
      (
        actor
      ) => {

        return (
          !!actor.ud
        );
      }
    )
    .map(
      (
        actor
      ) => {

        return encodeURIComponent(
          actor.ud
        );
      }
    );

  return (
    !titlesCollection.length
  ) ?
    Promise.resolve(
      {}
    ) :
    mediawikiFetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&titles=${
        titlesCollection.join('|')
      }&props=claims|sitelinks&format=json`
    )
      .then(
        (
          res
        ) => {

          return (
            !res?.entities
          ) ?
            {} :
            Object.values(
              res.entities
            )
              .reduce(
                (
                  memo,
                  entity
                ) => {

                  const genderId = entity
                    ?.claims
                    ?.P21
                    ?.[0]
                    ?.mainsnak
                    ?.datavalue
                    ?.value
                    ?.id;

                  const title = entity
                    ?.sitelinks
                    ?.enwiki
                    ?.title;

                  return (
                    !title
                  ) ?
                    memo :
                    {
                      ...memo,
                      [title]: GENDER_MAP[genderId] || 'unknown'
                    };
                },
                {}
              );
        }
      );
};

const udDecodedGet = (
  ud
) => {

  return decodeURIComponent(
    ud
  )
    .replace(
      /_/g,
      ' '
    );
};

export default (
  actors
) => {

  return genderMapGet(
    actors
  )
    .then(
      (
        genderMap
      ) => {

        return actors.map(
          (
            actor
          ) => {

            const gender = (
              actor.ud
            ) ?
              genderMap[
                udDecodedGet(
                  actor.ud
                )
              ] || 'unknown' :
              'unknown';

            return {
              ...actor,
              gender
            };
          }
        );
      }
    );
};
