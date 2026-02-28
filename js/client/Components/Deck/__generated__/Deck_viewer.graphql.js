/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type DeckDetail_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Deck_viewer$ref: FragmentReference;
declare export opaque type Deck_viewer$fragmentType: Deck_viewer$ref;
export type Deck_viewer = {|
  +$fragmentRefs: DeckDetail_viewer$ref,
  +$refType: Deck_viewer$ref,
|};
export type Deck_viewer$data = Deck_viewer;
export type Deck_viewer$key = {
  +$data?: Deck_viewer$data,
  +$fragmentRefs: Deck_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Deck_viewer",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeckDetail_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '2ac34663209bcc0b2d38165920d7ba75';

module.exports = node;
