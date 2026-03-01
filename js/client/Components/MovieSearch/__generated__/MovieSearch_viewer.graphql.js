/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type MovieSearch_viewer$ref: FragmentReference;
declare export opaque type MovieSearch_viewer$fragmentType: MovieSearch_viewer$ref;
export type MovieSearch_viewer = {|
  +id: ?string,
  +$refType: MovieSearch_viewer$ref,
|};
export type MovieSearch_viewer$data = MovieSearch_viewer;
export type MovieSearch_viewer$key = {
  +$data?: MovieSearch_viewer$data,
  +$fragmentRefs: MovieSearch_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MovieSearch_viewer",
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
(node/*: any*/).hash = 'e54350577341696ff117bca973132208';

module.exports = node;
