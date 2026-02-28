/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type SplashCharacter_viewer$ref: FragmentReference;
declare export opaque type SplashCharacter_viewer$fragmentType: SplashCharacter_viewer$ref;
export type SplashCharacter_viewer = {|
  +id: ?string,
  +$refType: SplashCharacter_viewer$ref,
|};
export type SplashCharacter_viewer$data = SplashCharacter_viewer;
export type SplashCharacter_viewer$key = {
  +$data?: SplashCharacter_viewer$data,
  +$fragmentRefs: SplashCharacter_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SplashCharacter_viewer",
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
(node/*: any*/).hash = 'cbe0d27f5d226e92692ac2835ee1dade';

module.exports = node;
