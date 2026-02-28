/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Home_viewer$ref: FragmentReference;
declare export opaque type Home_viewer$fragmentType: Home_viewer$ref;
export type Home_viewer = {|
  +id: ?string,
  +$refType: Home_viewer$ref,
|};
export type Home_viewer$data = Home_viewer;
export type Home_viewer$key = {
  +$data?: Home_viewer$data,
  +$fragmentRefs: Home_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_viewer",
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
(node/*: any*/).hash = 'a9911c4db29213a1220cc4a81d12174e';

module.exports = node;
