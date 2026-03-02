'use strict';

import deckCharactersSpoofedGet
  from './deckCharactersSpoofedGet';
import deckCardsSpoofedGet
  from './deckCardsSpoofedGet';

export default (
  deck,
  spoofInput
) => {

  const spoofedCharacters = deckCharactersSpoofedGet(
    deck.splash.characters,
    spoofInput
  );

  const spoofedCards = deckCardsSpoofedGet(
    deck.cards,
    spoofedCharacters
  );

  return {
    ...deck,
    splash: {
      ...deck.splash,
      characters: spoofedCharacters
    },
    cards: spoofedCards
  };
};
