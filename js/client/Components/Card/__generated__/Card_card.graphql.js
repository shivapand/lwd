/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Card_card$ref: FragmentReference;
declare export opaque type Card_card$fragmentType: Card_card$ref;
export type Card_card = {|
  +image: ?string,
  +renderText: ?string,
  +character: ?{|
    +role: ?string
  |},
  +actorImageId: ?string,
  +dualRoleIndex: ?number,
  +$refType: Card_card$ref,
|};
export type Card_card$data = Card_card;
export type Card_card$key = {
  +$data?: Card_card$data,
  +$fragmentRefs: Card_card$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Card_card",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "image",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "renderText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Character",
      "kind": "LinkedField",
      "name": "character",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "role",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "actorImageId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dualRoleIndex",
      "storageKey": null
    }
  ],
  "type": "Card",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '325f385a9631ec1e9494f0240a54cdf5';

module.exports = node;
