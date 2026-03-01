/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type SplashCharacter_character$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SplashCharacters_splash$ref: FragmentReference;
declare export opaque type SplashCharacters_splash$fragmentType: SplashCharacters_splash$ref;
export type SplashCharacters_splash = {|
  +characters: ?$ReadOnlyArray<?{|
    +role: ?string,
    +$fragmentRefs: SplashCharacter_character$ref,
  |}>,
  +$refType: SplashCharacters_splash$ref,
|};
export type SplashCharacters_splash$data = SplashCharacters_splash;
export type SplashCharacters_splash$key = {
  +$data?: SplashCharacters_splash$data,
  +$fragmentRefs: SplashCharacters_splash$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SplashCharacters_splash",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Character",
      "kind": "LinkedField",
      "name": "characters",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "role",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SplashCharacter_character"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Splash",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '9e5fbc03fa223fda1f43ce6f5cfed910';

module.exports = node;
