/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type ShareDownload_viewer$ref: FragmentReference;
declare export opaque type ShareDownload_viewer$fragmentType: ShareDownload_viewer$ref;
export type ShareDownload_viewer = {|
  +id: ?string,
  +$refType: ShareDownload_viewer$ref,
|};
export type ShareDownload_viewer$data = ShareDownload_viewer;
export type ShareDownload_viewer$key = {
  +$data?: ShareDownload_viewer$data,
  +$fragmentRefs: ShareDownload_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShareDownload_viewer",
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
(node/*: any*/).hash = '78e18172058b8944c62d30ed93d8b33c';

module.exports = node;
