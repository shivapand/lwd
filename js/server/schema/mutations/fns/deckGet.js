'use strict';

import movieDataBasicGet from '../fns/movieDataBasicGet';
import charactersGet from '../fns/charactersGet';
import wikidataRolesGet from './wikidataRolesGet';
import cardsCharactersAssignedGet
  from './cardsCharactersAssignedGet';
import cardsCharacterAssignedGet
  from './cardsCharacterAssignedGet';
import charactersMetaStarringAssignedGet
  from './charactersMetaStarringAssignedGet';
import charactersMetaRoleAssignedGet
  from './charactersMetaRoleAssignedGet';
import charactersMetaRenderAssignedGet
  from './charactersMetaRenderAssignedGet';
import cardsMetaAssignedGet from './cardsMetaAssignedGet';
import deckSpoofableGet
  from './deckSpoofableGet';
import deckCharactersSpoofedGet
  from './deckCharactersSpoofedGet';
import deckCardsSpoofedGet from './deckCardsSpoofedGet';
import deckActorImageIdsAssignedGet
  from './deckActorImageIdsAssignedGet';
import deckRenderDetailsAssignedGet
  from './deckRenderDetailsAssignedGet';
import cardsGifyUrlAssignedGet
  from './cardsGifyUrlAssignedGet';

const deckPreBuiltGet = async (
  input,
  plotLimit
) => {

  if (
    typeof(
      input
    ) !== 'string'
  ) {

    return Promise.resolve(
      input
    );
  }

  console.log(`[Deck] 1/6: Fetching basic movie data for "${input}"...`);
  let movieDataBasic = await movieDataBasicGet(
    input,
    plotLimit
  );

  if (
    !movieDataBasic?.plot ||
    !movieDataBasic?.cast
  ) {
    console.warn(`[Deck] Failed to get basic movie data for "${input}".`);
    return Promise.resolve(
      null
    );
  }

  console.log(`[Deck] 2/6: Extracting characters for "${movieDataBasic.title}"...`);
  let characters = await charactersGet(
    movieDataBasic.cast,
    movieDataBasic.plot
  );

  console.log(`[Deck] 3/6: Fetching Wikidata roles for "${movieDataBasic.title}"...`);
  const wikidataRoles = await wikidataRolesGet(
    characters,
    movieDataBasic.title
  )
    .catch(() => ({}));

  characters = characters.map(
    (character) => {

      const wikidataRole = Object.keys(wikidataRoles).find(
        (key) => wikidataRoles[key]?.text === character.text
      );

      return (wikidataRole)
        ? { ...character, role: wikidataRole }
        : character;
    }
  );

  let cards = cardsCharactersAssignedGet(
    movieDataBasic.plot,
    characters
  );

  cards = cardsCharacterAssignedGet(
    cards,
    characters
  );

  characters = charactersMetaStarringAssignedGet(
    characters,
    cards
  );

  console.log(`[Deck] 4/6: Assigning meta roles for "${movieDataBasic.title}"...`);
  characters = await charactersMetaRoleAssignedGet(
    characters
  );

  characters = charactersMetaRenderAssignedGet(
    characters
  );

  cards = cardsMetaAssignedGet(
    cards,
    characters
  );

  const spoofable = deckSpoofableGet(
    characters,
    cards
  );

  console.log(`[Deck] 5/6: Creating initial splash data for "${movieDataBasic.title}"...`);
  return {
    splash: {
      title: movieDataBasic.title,
      poster: movieDataBasic.poster,
      characters,
      spoofable
    },
    cards
  };
};

const deckPostProcessedGet = async (
  deck,
  spoofInput,
  genre,
  db
) => {

  if (
    !deck
  ) {
    return Promise.resolve(
      null
    );
  }

  if (
    !genre
  ) {
    return Promise.resolve(
      deck
    );
  }

  const spoofedCharacters = deckCharactersSpoofedGet(
    deck.splash.characters,
    spoofInput
  );

  const spoofedCards = deckCardsSpoofedGet(
    deck.cards,
    spoofedCharacters
  );

  deck = {
    ...deck,
    splash: {
      ...deck.splash,
      characters: spoofedCharacters
    },
    cards: spoofedCards
  };

  console.log(`[Deck] 6/6: Assigning actor images and Giphy URLs for "${deck.splash.title}"...`);
  deck = await deckActorImageIdsAssignedGet(
    deck,
    db
  )
    .catch(
      (error) => {

        // eslint-disable-next-line no-console
        console.error(
          'deckActorImageIdsAssignedGet error:',
          error
        );

        return (
          deck
        );
      }
    );

  const cardsWithGify = await cardsGifyUrlAssignedGet(
    deck.cards,
    deck.splash.title
  )
    .catch(
      () => {

        return (
          deck.cards
        );
      }
    );

  deck = {
    ...deck,
    cards: cardsWithGify
  };

  deck = deckRenderDetailsAssignedGet(
    deck
  );

  console.log(`[Deck] FINISHED: Fully processed deck for "${deck.splash.title}".`);

  return (
    deck
  );
};

export default async (
  input,
  spoofInput,
  genre,
  plotLimit,
  db
) => {

  let deck = await deckPreBuiltGet(
    input,
    plotLimit
  );

  deck = await deckPostProcessedGet(
    deck,
    spoofInput,
    genre,
    db
  );

  return (
    deck
  );
};
