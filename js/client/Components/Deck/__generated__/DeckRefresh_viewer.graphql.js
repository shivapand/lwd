/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeckRefresh_viewer$ref: FragmentReference;
declare export opaque type DeckRefresh_viewer$fragmentType: DeckRefresh_viewer$ref;
export type DeckRefresh_viewer = {|
  +id: ?string,
  +$refType: DeckRefresh_viewer$ref,
|};
export type DeckRefresh_viewer$data = DeckRefresh_viewer;
export type DeckRefresh_viewer$key = {
  +$data?: DeckRefresh_viewer$data,
  +$fragmentRefs: DeckRefresh_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DeckRefresh_viewer",
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
(node/*: any*/).hash = '94d6503ecdd4bbab86f34e54937e7517';

module.exports = node;
