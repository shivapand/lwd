/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type Card_card$ref = any;
type Splash_splash$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeckNode_deck$ref: FragmentReference;
declare export opaque type DeckNode_deck$fragmentType: DeckNode_deck$ref;
export type DeckNode_deck = {|
  +id: ?string,
  +splash: ?{|
    +$fragmentRefs: Splash_splash$ref
  |},
  +cards: ?$ReadOnlyArray<?{|
    +$fragmentRefs: Card_card$ref
  |}>,
  +$refType: DeckNode_deck$ref,
|};
export type DeckNode_deck$data = DeckNode_deck;
export type DeckNode_deck$key = {
  +$data?: DeckNode_deck$data,
  +$fragmentRefs: DeckNode_deck$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeckNode_deck",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Splash",
      "kind": "LinkedField",
      "name": "splash",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Splash_splash"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Card",
      "kind": "LinkedField",
      "name": "cards",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Card_card"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Deck",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '8ebeeff002e5f467d7e03eb593798032';

module.exports = node;
