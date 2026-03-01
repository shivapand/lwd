'use strict';

import nodeFetch from 'node-fetch';

const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

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

const sparqlQueryGet = (title, limit) =>
  `SELECT ?film ?filmLabel ?year ?image ?articleName WHERE {
  ?film wdt:P31 wd:Q11424 .
  ?film rdfs:label ?label .
  FILTER(LANG(?label) = "en")
  FILTER(CONTAINS(LCASE(?label), LCASE("${title}")))
  OPTIONAL { ?film wdt:P577 ?pubDate }
  OPTIONAL { ?film wdt:P18 ?image }
  OPTIONAL {
    ?sitelink schema:about ?film .
    ?sitelink schema:isPartOf <https://en.wikipedia.org/> .
    ?sitelink schema:name ?articleName .
  }
  BIND(YEAR(?pubDate) AS ?year)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
ORDER BY DESC(?year)
LIMIT ${limit}`;

const posterUrlGet = (imageUri) => {

  const filename = decodeURIComponent(
    imageUri.split('/').pop()
  );

  return `https://commons.wikimedia.org/wiki/Special:FilePath/${
    encodeURIComponent(filename)
  }?width=92`;
};

const resultGet = (binding) => ({
  title: binding.articleName?.value || binding.filmLabel?.value || '',
  snippet: '',
  year: binding.year?.value || null,
  poster: binding.image?.value
    ? posterUrlGet(binding.image.value)
    : null,
  rating: null
});

export default async (
  text,
  limit = 5
) => {

  return (!text)
    ? FEATURED_COLLECTION
    : await (async () => {

  const query = sparqlQueryGet(text, limit);

  const url = `${WIKIDATA_SPARQL_URL}?query=${
    encodeURIComponent(query)
  }&format=json`;

  const res = await nodeFetch(url, {
    headers: {
      'User-Agent': 'LWD-Demo-Bot (pyratin@gmail.com)',
      'Accept': 'application/sparql-results+json'
    },
    timeout: 15000
  });

  return (!res.ok)
    ? []
    : await (async () => {

      const json = await res.json();

      const bindingCollection = json?.results?.bindings || [];

      return bindingCollection.map(resultGet);
    })();

    })();
};
