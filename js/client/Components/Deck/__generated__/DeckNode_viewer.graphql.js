/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type Card_viewer$ref = any;
type Carousel_viewer$ref = any;
type DeckRefresh_viewer$ref = any;
type Splash_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeckNode_viewer$ref: FragmentReference;
declare export opaque type DeckNode_viewer$fragmentType: DeckNode_viewer$ref;
export type DeckNode_viewer = {|
  +$fragmentRefs: Splash_viewer$ref & Card_viewer$ref & Carousel_viewer$ref & DeckRefresh_viewer$ref,
  +$refType: DeckNode_viewer$ref,
|};
export type DeckNode_viewer$data = DeckNode_viewer;
export type DeckNode_viewer$key = {
  +$data?: DeckNode_viewer$data,
  +$fragmentRefs: DeckNode_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeckNode_viewer",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Splash_viewer"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Card_viewer"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Carousel_viewer"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeckRefresh_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '04ef6064e34ff18cab35fb3d40fc728c';

module.exports = node;
