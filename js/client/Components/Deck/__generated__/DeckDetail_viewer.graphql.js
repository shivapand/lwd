/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type DeckNode_deck$ref = any;
type DeckNode_viewer$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DeckDetail_viewer$ref: FragmentReference;
declare export opaque type DeckDetail_viewer$fragmentType: DeckDetail_viewer$ref;
export type DeckDetail_viewer = {|
  +id: ?string,
  +decks: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: ?string,
        +$fragmentRefs: DeckNode_deck$ref,
      |}
    |}>
  |},
  +$fragmentRefs: DeckNode_viewer$ref,
  +$refType: DeckDetail_viewer$ref,
|};
export type DeckDetail_viewer$data = DeckDetail_viewer;
export type DeckDetail_viewer$key = {
  +$data?: DeckDetail_viewer$data,
  +$fragmentRefs: DeckDetail_viewer$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": 1,
      "kind": "LocalArgument",
      "name": "deckFirst"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "deckTitle"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "genre"
    },
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "refetch"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "spoofInput"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "deckFirst",
        "cursor": null,
        "direction": "forward",
        "path": [
          "decks"
        ]
      }
    ]
  },
  "name": "DeckDetail_viewer",
  "selections": [
    (v0/*: any*/),
    {
      "alias": "decks",
      "args": [
        {
          "kind": "Variable",
          "name": "deckTitle",
          "variableName": "deckTitle"
        },
        {
          "kind": "Variable",
          "name": "genre",
          "variableName": "genre"
        },
        {
          "kind": "Variable",
          "name": "spoofInput",
          "variableName": "spoofInput"
        }
      ],
      "concreteType": "DeckConnection",
      "kind": "LinkedField",
      "name": "__Connection_decks_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "DeckEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Deck",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "condition": "refetch",
                  "kind": "Condition",
                  "passingValue": true,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "DeckNode_deck"
                    }
                  ]
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "DeckNode_viewer"
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '21c9d8957766dfdd2d44f5744a4398c9';

module.exports = node;
