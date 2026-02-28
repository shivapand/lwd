/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type Carousel_viewer$ref: FragmentReference;
declare export opaque type Carousel_viewer$fragmentType: Carousel_viewer$ref;
export type Carousel_viewer = {|
  +id: ?string,
  +$refType: Carousel_viewer$ref,
|};
export type Carousel_viewer$data = Carousel_viewer;
export type Carousel_viewer$key = {
  +$data?: Carousel_viewer$data,
  +$fragmentRefs: Carousel_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Carousel_viewer",
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
(node/*: any*/).hash = '3c54820e9de373675122daf8c7f0fd49';

module.exports = node;
