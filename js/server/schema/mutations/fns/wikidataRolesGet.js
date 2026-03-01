'use strict';

import nodeFetch from 'node-fetch';

const WIKIDATA_SPARQL_URL = 'https://query.wikidata.org/sparql';

const HERO_OCCUPATION_COLLECTION = [
  'superhero'
];

const VILLAIN_OCCUPATION_COLLECTION = [
  'supervillain',
  'serial killer',
  'mass murderer',
  'terrorist'
];

const sparqlQueryGet = (title) =>
  `SELECT ?characterLabel
       ?narrativeRoleLabel
       (GROUP_CONCAT(DISTINCT ?occupationLabel; separator="|") AS ?occupations)
       ?description
WHERE {
  ?movie wdt:P31 wd:Q11424 .
  ?movie rdfs:label "${title}"@en .
  ?movie wdt:P674 ?character .
  OPTIONAL { ?character wdt:P5800 ?narrativeRole }
  OPTIONAL {
    ?character wdt:P106 ?occupation .
    ?occupation rdfs:label ?occupationLabel .
    FILTER(LANG(?occupationLabel) = "en")
  }
  OPTIONAL {
    ?character schema:description ?description .
    FILTER(LANG(?description) = "en")
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
}
GROUP BY ?characterLabel ?narrativeRoleLabel ?description`;

const roleFromNarrativeGet = (narrativeRoleLabel) => {

  const lower = (narrativeRoleLabel || '').toLowerCase();

  return (lower === 'protagonist' || lower === 'main heroine')
    ? 'hero'
    : (lower === 'antagonist' || lower === 'main antagonist')
      ? 'villain'
      : null;
};

const roleFromDescriptionGet = (description) => {

  const lower = (description || '').toLowerCase();

  return (lower.includes('protagonist'))
    ? 'hero'
    : (lower.includes('antagonist') || lower.includes('villain'))
      ? 'villain'
      : null;
};

const roleFromOccupationsGet = (occupations) => {

  const lower = (occupations || '').toLowerCase();

  const heroFlag = HERO_OCCUPATION_COLLECTION.find(
    (occupation) => lower.includes(occupation)
  );

  const villainFlag = VILLAIN_OCCUPATION_COLLECTION.find(
    (occupation) => lower.includes(occupation)
  );

  return (heroFlag)
    ? 'hero'
    : (villainFlag)
      ? 'villain'
      : null;
};

const roleGet = (row) => {

  const narrativeRole = roleFromNarrativeGet(
    row.narrativeRoleLabel?.value
  );

  const descriptionRole = roleFromDescriptionGet(
    row.description?.value
  );

  const occupationRole = roleFromOccupationsGet(
    row.occupations?.value
  );

  return narrativeRole || descriptionRole || occupationRole;
};

const characterMatchGet = (wikidataName, characters) => {

  const lowerName = wikidataName.toLowerCase();

  return characters.find(
    (character) => {

      const nameVariantCollection = [
        character.characterNameFull,
        character.text
      ]
        .filter(Boolean)
        .reduce(
          (memo, name) => [
            ...memo,
            ...name.split('/').map(
              (part) => part.trim()
            )
          ],
          []
        );

      return nameVariantCollection.find(
        (variant) =>
          variant.toLowerCase().includes(lowerName) ||
          lowerName.includes(variant.toLowerCase())
      );
    }
  );
};

const wikidataRolesGet = async (characters, title) => {

  const query = sparqlQueryGet(title);

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
    ? { hero: null, villain: null, heroine: null }
    : (async () => {

      const json = await res.json();

      const rowCollection = json?.results?.bindings || [];

      const roles = rowCollection.reduce(
        (memo, row) => {

          const characterLabel = row.characterLabel?.value;

          const role = (!characterLabel)
            ? null
            : roleGet(row);

          const matchedCharacter = (role)
            ? characterMatchGet(characterLabel, characters)
            : null;

          return (!matchedCharacter)
            ? memo
            : (() => {

              const key = (role === 'hero' && matchedCharacter.actor?.gender === 'woman')
                ? 'heroine'
                : role;

              return (!memo[key])
                ? { ...memo, [key]: matchedCharacter }
                : memo;
            })();
        },
        { hero: null, villain: null, heroine: null }
      );

      return ['hero', 'villain', 'heroine'].reduce(
        (memo, key) => {

          const character = roles[key];

          return (!character)
            ? memo
            : (() => {

              const roleKey = (key === 'heroine')
                ? 'hero'
                : key;

              const aliasCollection = rowCollection
                .filter((row) => {

                  const label = row.characterLabel?.value;

                  return label &&
                    roleGet(row) === roleKey &&
                    !characterMatchGet(label, characters);
                })
                .map((row) => row.characterLabel.value);

              const characterNameFull = aliasCollection.reduce(
                (fullName, alias) =>
                  fullName.toLowerCase().includes(alias.toLowerCase())
                    ? fullName
                    : `${fullName} / ${alias}`,
                character.characterNameFull || character.text
              );

              return {
                ...memo,
                [key]: { ...character, characterNameFull }
              };
            })();
        },
        { hero: null, villain: null, heroine: null }
      );
    })();
};

export default wikidataRolesGet;
