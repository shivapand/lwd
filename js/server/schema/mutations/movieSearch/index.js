'use strict';

import nodeFetch from 'node-fetch';

const MEDIAWIKI_API_URL =
  'https://en.wikipedia.org/w/api.php';

const FEATURED_COLLECTION = [
  { title: 'The Dark Knight', snippet: '', year: '2008', poster: null, rating: null },
  { title: 'The Matrix', snippet: '', year: '1999', poster: null, rating: null },
  { title: 'Inception', snippet: '', year: '2010', poster: null, rating: null },
  { title: 'Gladiator', snippet: '', year: '2000', poster: null, rating: null },
  { title: 'Interstellar', snippet: '', year: '2014', poster: null, rating: null },
  { title: 'Kill Bill: Volume 1', snippet: '', year: '2003', poster: null, rating: null },
  { title: 'The Godfather', snippet: '', year: '1972', poster: null, rating: null },
  { title: 'Pulp Fiction', snippet: '', year: '1994', poster: null, rating: null }
];

const EXCLUDE_PATTERN =
  /\(disambiguation\)|\bfilmography\b|\blist of\b/i;

const htmlStripGet = (
  html
) => html.replace(
  /<[^>]*>/g,
  ''
);

const yearExtractGet = (
  title,
  snippet
) => {

  const titleMatch = title.match(
    /\((\d{4})\s+film\)/
  );

  return titleMatch
    ? titleMatch[1]
    : (() => {

      const snippetMatch = snippet.match(
        /\b((?:19|20)\d{2})\b/
      );

      return snippetMatch
        ? snippetMatch[1]
        : null;
    })();
};

const titleCleanGet = (
  title
) => title.replace(
  /\s*\(\d{4}\s+film\)\s*$/,
  ''
).replace(
  /\s*\(film\)\s*$/,
  ''
);

const resultGet = (
  entry
) => {

  const snippet = htmlStripGet(
    entry.snippet || ''
  );

  const year = yearExtractGet(
    entry.title,
    snippet
  );

  return ({
    title: titleCleanGet(
      entry.title
    ),
    snippet,
    year,
    poster: null,
    rating: null
  });
};

const resultFilmFilterGet = (
  entry
) => !EXCLUDE_PATTERN.test(entry.title);

export default async (
  text,
  limit = 8
) => {

  return (!text)
    ? FEATURED_COLLECTION
    : await (async () => {

      const url = `${
        MEDIAWIKI_API_URL
      }?action=query&list=search&srsearch=${
        encodeURIComponent(
          `${text} hastemplate:"Infobox film"`
        )
      }&format=json&srlimit=${
        limit
      }&srprop=snippet`;

      const res = await nodeFetch(
        url,
        {
          headers: {
            'User-Agent':
              'LWD-Demo-Bot (pyratin@gmail.com)'
          },
          timeout: 5000
        }
      );

      return (!res.ok)
        ? []
        : await (async () => {

          const json = await res.json();

          const searchCollection =
            json?.query?.search || [];

          return searchCollection
            .filter(
              resultFilmFilterGet
            )
            .map(
              resultGet
            );
        })();
    })();
};
