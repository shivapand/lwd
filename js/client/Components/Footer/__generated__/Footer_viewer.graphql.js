/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type Share_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type Footer_viewer$ref: FragmentReference;
declare export opaque type Footer_viewer$fragmentType: Footer_viewer$ref;
export type Footer_viewer = {|
  +$fragmentRefs: Share_viewer$ref,
  +$refType: Footer_viewer$ref,
|};
export type Footer_viewer$data = Footer_viewer;
export type Footer_viewer$key = {
  +$data?: Footer_viewer$data,
  +$fragmentRefs: Footer_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Footer_viewer",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Share_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '8cbbe9cf23a64ff072912c1998eca1e2';

module.exports = node;
