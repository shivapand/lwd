/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type MovieSearch_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Header_viewer$ref: FragmentReference;
declare export opaque type Header_viewer$fragmentType: Header_viewer$ref;
export type Header_viewer = {|
  +$fragmentRefs: MovieSearch_viewer$ref,
  +$refType: Header_viewer$ref,
|};
export type Header_viewer$data = Header_viewer;
export type Header_viewer$key = {
  +$data?: Header_viewer$data,
  +$fragmentRefs: Header_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Header_viewer",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MovieSearch_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'c2fce802108f2616c1c0a1bbcf5f3b01';

module.exports = node;
