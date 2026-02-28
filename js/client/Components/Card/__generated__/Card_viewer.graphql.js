/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Card_viewer$ref: FragmentReference;
declare export opaque type Card_viewer$fragmentType: Card_viewer$ref;
export type Card_viewer = {|
  +id: ?string,
  +$refType: Card_viewer$ref,
|};
export type Card_viewer$data = Card_viewer;
export type Card_viewer$key = {
  +$data?: Card_viewer$data,
  +$fragmentRefs: Card_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Card_viewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'b5fa692cd0b3898a578f28f01dd56164';

module.exports = node;
