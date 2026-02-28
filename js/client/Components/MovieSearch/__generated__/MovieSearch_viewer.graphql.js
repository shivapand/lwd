/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type MovieSearchResultItem_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type MovieSearch_viewer$ref: FragmentReference;
declare export opaque type MovieSearch_viewer$fragmentType: MovieSearch_viewer$ref;
export type MovieSearch_viewer = {|
  +$fragmentRefs: MovieSearchResultItem_viewer$ref,
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "MovieSearchResultItem_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '19bc16da23f0835cff022236dadd0736';

module.exports = node;
