/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type ShareLink_viewer$ref: FragmentReference;
declare export opaque type ShareLink_viewer$fragmentType: ShareLink_viewer$ref;
export type ShareLink_viewer = {|
  +id: ?string,
  +$refType: ShareLink_viewer$ref,
|};
export type ShareLink_viewer$data = ShareLink_viewer;
export type ShareLink_viewer$key = {
  +$data?: ShareLink_viewer$data,
  +$fragmentRefs: ShareLink_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShareLink_viewer",
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
(node/*: any*/).hash = '74749a6b6fa52f1498c105a72893f32d';

module.exports = node;
