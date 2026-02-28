/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type SplashSpoofInput_viewer$ref: FragmentReference;
declare export opaque type SplashSpoofInput_viewer$fragmentType: SplashSpoofInput_viewer$ref;
export type SplashSpoofInput_viewer = {|
  +id: ?string,
  +$refType: SplashSpoofInput_viewer$ref,
|};
export type SplashSpoofInput_viewer$data = SplashSpoofInput_viewer;
export type SplashSpoofInput_viewer$key = {
  +$data?: SplashSpoofInput_viewer$data,
  +$fragmentRefs: SplashSpoofInput_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SplashSpoofInput_viewer",
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
(node/*: any*/).hash = '7f8a9debce30558b96f30afc578987d2';

module.exports = node;
