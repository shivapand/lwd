/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type SplashCharacter_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SplashCharacters_viewer$ref: FragmentReference;
declare export opaque type SplashCharacters_viewer$fragmentType: SplashCharacters_viewer$ref;
export type SplashCharacters_viewer = {|
  +$fragmentRefs: SplashCharacter_viewer$ref,
  +$refType: SplashCharacters_viewer$ref,
|};
export type SplashCharacters_viewer$data = SplashCharacters_viewer;
export type SplashCharacters_viewer$key = {
  +$data?: SplashCharacters_viewer$data,
  +$fragmentRefs: SplashCharacters_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SplashCharacters_viewer",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SplashCharacter_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '1784d144039e54a0d98f181a7a0661b3';

module.exports = node;
