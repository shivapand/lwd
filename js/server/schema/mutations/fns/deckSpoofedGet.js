'use strict';

import deckCharactersSpoofedGet 
  from './deckCharactersSpoofedGet';
import deckCardsSpoofedGet from './deckCardsSpoofedGet';

export default (
  deck,
  spoofInput
) => {

  const characters = deckCharactersSpoofedGet(
    deck.splash.characters,
    spoofInput
  );

  const cards = deckCardsSpoofedGet(
    deck.cards,
    characters
  );

  return {
    ...deck,
    splash: {
      ...deck.splash,
      characters
    },
    cards
  };
};
