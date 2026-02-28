/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type SplashCharacters_splash$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Splash_splash$ref: FragmentReference;
declare export opaque type Splash_splash$fragmentType: Splash_splash$ref;
export type Splash_splash = {|
  +title: ?string,
  +poster: ?string,
  +$fragmentRefs: SplashCharacters_splash$ref,
  +$refType: Splash_splash$ref,
|};
export type Splash_splash$data = Splash_splash;
export type Splash_splash$key = {
  +$data?: Splash_splash$data,
  +$fragmentRefs: Splash_splash$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Splash_splash",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "poster",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SplashCharacters_splash"
    }
  ],
  "type": "Splash",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '9220ea6549e35b55d9a21ecc14dc50c7';

module.exports = node;
