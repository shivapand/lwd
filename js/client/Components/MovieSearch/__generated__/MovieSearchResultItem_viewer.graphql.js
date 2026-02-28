/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type MovieSearchResultItem_viewer$ref: FragmentReference;
declare export opaque type MovieSearchResultItem_viewer$fragmentType: MovieSearchResultItem_viewer$ref;
export type MovieSearchResultItem_viewer = {|
  +id: ?string,
  +$refType: MovieSearchResultItem_viewer$ref,
|};
export type MovieSearchResultItem_viewer$data = MovieSearchResultItem_viewer;
export type MovieSearchResultItem_viewer$key = {
  +$data?: MovieSearchResultItem_viewer$data,
  +$fragmentRefs: MovieSearchResultItem_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MovieSearchResultItem_viewer",
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
(node/*: any*/).hash = '96907cf8fcb8b812ea8181c86c777927';

module.exports = node;
