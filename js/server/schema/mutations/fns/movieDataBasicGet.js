'use strict';

import latinize from 'latinize';

import mediawikiFetch from './mediawikiFetch';
import movieDataBasicPlotGet from './movieDataBasicPlotGet';
import movieDataBasicCastGet from './movieDataBasicCastGet';

const titleEncodedGet = (
  title
) => {

  return encodeURIComponent(
    title
  );
};

const pageMobileSectionQueryGet = (
  title
) => {

  return `
    https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${
      titleEncodedGet(
        title
      )
    }
  `
    .trim();
};

const moviePageSectionTextsGetFn = (
  json,
  anchorName
) => {

  const section = json.remaining.sections
    .find(
      (
        {
          anchor
        }
      ) => {

        return (
          anchor?.match(
            new RegExp(
              `
                ${
                  anchorName
                }
              `
                .trim(),
              'i'
            )
          )
        );
      }
    );

  return section?.text;
};

const sectionTextCleanedGet = (
  sectionText
) => {

  sectionText = sectionText?.replace(
    /\n/g,
    ' '
  );

  sectionText = sectionText?.replace(
    /\s{2,}/g,
    ' '
  );

  sectionText = latinize(
    sectionText
  );

  sectionText = sectionText?.replace(
    /((?:[A-Z][a-z]*.?\s?)*)"([A-Za-z.]+)"((?:\s?[A-Z][a-z]*.?)*)/g,
    '$1$2$3'
  );

  return (
    sectionText
  );
};

const moviePageSectionTextsGet = (
  json,
  anchorNames
) => {

  return anchorNames.reduce(
    (
      memo,
      anchorName
    ) => {

      let sectionText = moviePageSectionTextsGetFn(
        json,
        anchorName
      );

      sectionText = sectionTextCleanedGet(
        sectionText
      );

      return [
        ...memo,
        sectionText
      ];
    },
    []
  );
};

const processFn = (
  title,
  poster,
  plotText,
  castText,
  plotLimit,
  processFlag
) => {

  if (
    !plotText ||
    !castText
  ) {

    return (
      null
    );
  }

  else if (
    !processFlag
  ) {

    return {
      plotText,
      castText
    };
  }

  let plot = movieDataBasicPlotGet(
    plotText,
    plotLimit
  );

  const cast = movieDataBasicCastGet(
    castText
  );

  return {
    title,
    poster,
    cast,
    plot,
    castText,
    plotText
  };
};

export default async (
  title,
  plotLimit,
  processFlag = true
) => {

  // eslint-disable-next-line no-console
  console.log(
    `
      movieDataBasicGet: ${
        title
      }
    `
      .trim()
  );

  const query = pageMobileSectionQueryGet(
    title
  );

  const json = await mediawikiFetch(
    query
  );

  const poster = (
    json.lead?.image
  ) ?
    Object.values(
      json.lead.image.urls
    )[
      0
    ]:
    null;

  const anchorNames = [
    'Cast',
    'Plot'
  ];

  let [
    castText,
    plotText
  ] = moviePageSectionTextsGet(
    json,
    anchorNames
  );

  return processFn(
    title,
    poster,
    plotText,
    castText,
    plotLimit,
    processFlag
  );
};
