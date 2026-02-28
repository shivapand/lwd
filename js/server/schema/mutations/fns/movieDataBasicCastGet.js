'use strict';

import cheerio from 'cheerio';

import NNPsGet from './NNPsGet';
import sentencesTokenizedGet
  from './sentencesTokenizedGet';

const castLinesGet = (
  _castText
) => {

  const castText = _castText.replace(
    /<br>/g,
    '\n'
  );

  const $ = cheerio.load(
    castText,
    {
      decodeEntities: false
    }
  );

  return $(
    'li'
  )
    .toArray()
    .map(
      (
        _el
      ) => {

        const el = $(_el)
          .find('span.mw-reflink-text')
          .remove()
          .end();

        return [
          $(el)
            .text(),
          $(el)
            .html()
        ];
      }
    );
};

const actorLinkMatchedGet = (
  castLine
) => {

  const castHtml = castLine[
    1
  ];

  const actorLinkRegExp =
    /^<a href="\/wiki\/([^"]*?)"[^>]*?>([^<]*?)<\/a>/;

  const match = castHtml.match(
    actorLinkRegExp
  );

  return (
    match
  ) ?
    {
      text: match[
        2
      ],
      ud: match[
        1
      ]
    } :
    null;
};

const actorNNPMatchedGet = (
  castLine
) => {

  const castText = castLine[
    0
  ];

  const NNPs = NNPsGet(
    castText
  );

  const match = NNPs.find(
    (
      {
        distance
      }
    ) => {

      return (
        distance ===
        0
      );
    }
  );

  return (
    match
  ) ?
    {
      text: match.text,
      ud: null
    } :
    null;
};

const actorSyntaxMatchedGet = (
  castLine
) => {

  const castText = castLine[
    0
  ];

  const syntaxRegExp = /(.*)\sas\s/;

  const match = (
    castText.match(
      syntaxRegExp
    )
  );

  return (
    match
  ) ?
    {
      text: match[
        1
      ],
      ud: null
    } :
    null;
};

const actorsGetFn = (
  castLine
) => {

  let actor;

  switch (
    true
  ) {

    case (
      (
        actor = actorLinkMatchedGet(
          castLine
        )
      ) &&
      !!actor
    ) :
    case (
      (
        actor = actorNNPMatchedGet(
          castLine
        )
      ) &&
      !!actor
    ) :
    case (
      (
        actor = actorSyntaxMatchedGet(
          castLine
        )
      ) &&
      !!actor
    ) :

      return (
        actor
      );
  }
};

const actorsGet = (
  castLines
) => {

  return castLines.reduce(
    (
      memo,
      castLine
    ) => {

      const actor = actorsGetFn(
        castLine
      );

      if (
        actor
      ) {

        return [
          ...memo,
          actor
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const actorsCleanedGet = (
  actors
) => {

  return actors.map(
    (
      actor
    ) => {

      delete actor.index;
      delete actor.distance;
      delete actor.tokenIndex;

      return (
        actor
      );
    }
  );
};

const actorRegExpGet = (
  actorText
) => {

  return new RegExp(
    `
      ^${
        actorText
      }
    `
      .trim(),
    'm'
  );
};

const castGetFn = (
  actors,
  castLines
) => {

  const castText = castLines.reduce(
    (
      memo,
      [
        _castText
      ]
    ) => {

      return [
        ...memo,
        _castText
      ];
    },
    []
  )
    .join(
      '\n'
    );

  const cast = actors.reduce(
    (
      memo,
      actor,
      index
    ) => {

      let role = castText.split(
        actorRegExpGet(
          actor.text
        )
      )?.[
        1
      ];

      if (
        (
          actors.length >
          (
            index + 1
          )
        ) &&
        role
      ) {

        role = role.split(
          actorRegExpGet(
            actors[
              index + 1
            ]
              .text
          )
        )?.[
          0
        ];
      }

      role = (role) ?
        role :
        '';

      role = (
        role.trim()
      ) ?
        sentencesTokenizedGet(
          role
        )[
          0
        ] :
        role;

      role = (
        role.trim()
      ) ?
        role.split(
          /[:,\n—]/
        )[
          0
        ] :
        role;

      role = `
        ${
          actor.text
        } ${
          role.trim()
        }
      `
        .trim();

      if (
        role
      ) {

        return [
          ...memo,
          {
            actor,
            role
          }
        ];
      }

      return (
        memo
      );
    },
    []
  );

  return (
    cast
  );
};

export default (
  castText
) => {

  if (
    !castText
  ) {

    return (
      null
    );
  }

  const castLines = castLinesGet(
    castText
  );

  let actors = actorsGet(
    castLines
  );

  actors = actorsCleanedGet(
    actors
  );

  let cast = castGetFn(
    actors,
    castLines
  );

  return (
    cast
  );
};

