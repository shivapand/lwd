/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type SplashCharacter_character$ref: FragmentReference;
declare export opaque type SplashCharacter_character$fragmentType: SplashCharacter_character$ref;
export type SplashCharacter_character = {|
  +renderText: ?string,
  +role: ?string,
  +dualRoleIndex: ?number,
  +image: ?string,
  +$refType: SplashCharacter_character$ref,
|};
export type SplashCharacter_character$data = SplashCharacter_character;
export type SplashCharacter_character$key = {
  +$data?: SplashCharacter_character$data,
  +$fragmentRefs: SplashCharacter_character$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SplashCharacter_character",
  "selections": [
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
      "kind": "ScalarField",
      "name": "role",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dualRoleIndex",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "image",
      "storageKey": null
    }
  ],
  "type": "Character",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '71b31ef568756855bb30c947168122e7';

module.exports = node;
