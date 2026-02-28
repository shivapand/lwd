/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type Viewer_viewer$ref = any;
export type clientQueryVariables = {||};
export type clientQueryResponse = {|
  +viewer: ?{|
    +$fragmentRefs: Viewer_viewer$ref
  |}
|};
export type clientQuery = {|
  variables: clientQueryVariables,
  response: clientQueryResponse,
|};
*/


/*
query clientQuery {
  viewer {
    ...Viewer_viewer
    id
  }
}

fragment Card_viewer on Viewer {
  id
}

fragment Carousel_viewer on Viewer {
  id
}

fragment DeckDetail_viewer on Viewer {
  id
  decks(first: 1) {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  ...DeckNode_viewer
}

fragment DeckNode_viewer on Viewer {
  ...Splash_viewer
  ...Card_viewer
  ...Carousel_viewer
  ...DeckRefresh_viewer
}

fragment DeckRefresh_viewer on Viewer {
  id
}

fragment Deck_viewer on Viewer {
  ...DeckDetail_viewer
}

fragment Footer_viewer on Viewer {
  ...Share_viewer
}

fragment Header_viewer on Viewer {
  ...MovieSearch_viewer
}

fragment Home_viewer on Viewer {
  id
}

fragment MovieSearchResultItem_viewer on Viewer {
  id
}

fragment MovieSearch_viewer on Viewer {
  ...MovieSearchResultItem_viewer
}

fragment ShareDownload_viewer on Viewer {
  id
}

fragment ShareLink_viewer on Viewer {
  id
}

fragment Share_viewer on Viewer {
  ...ShareDownload_viewer
  ...ShareLink_viewer
}

fragment SplashCharacter_viewer on Viewer {
  id
}

fragment SplashCharacters_viewer on Viewer {
  ...SplashCharacter_viewer
}

fragment SplashSpoofInput_viewer on Viewer {
  id
}

fragment Splash_viewer on Viewer {
  ...SplashCharacters_viewer
  ...SplashSpoofInput_viewer
}

fragment Viewer_viewer on Viewer {
  id
  deckTitle
  ...Header_viewer
  ...Home_viewer
  ...Deck_viewer
  ...Footer_viewer
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "clientQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Viewer_viewer"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "QUery",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "clientQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "deckTitle",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "concreteType": "DeckConnection",
            "kind": "LinkedField",
            "name": "decks",
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
            "storageKey": "decks(first:1)"
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "filters": [
              "deckTitle",
              "spoofInput",
              "genre"
            ],
            "handle": "connection",
            "key": "Connection_decks",
            "kind": "LinkedHandle",
            "name": "decks"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b9edb5d734cac9235f092522323ed577",
    "id": null,
    "metadata": {},
    "name": "clientQuery",
    "operationKind": "query",
    "text": "query clientQuery {\n  viewer {\n    ...Viewer_viewer\n    id\n  }\n}\n\nfragment Card_viewer on Viewer {\n  id\n}\n\nfragment Carousel_viewer on Viewer {\n  id\n}\n\nfragment DeckDetail_viewer on Viewer {\n  id\n  decks(first: 1) {\n    edges {\n      node {\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  ...DeckNode_viewer\n}\n\nfragment DeckNode_viewer on Viewer {\n  ...Splash_viewer\n  ...Card_viewer\n  ...Carousel_viewer\n  ...DeckRefresh_viewer\n}\n\nfragment DeckRefresh_viewer on Viewer {\n  id\n}\n\nfragment Deck_viewer on Viewer {\n  ...DeckDetail_viewer\n}\n\nfragment Footer_viewer on Viewer {\n  ...Share_viewer\n}\n\nfragment Header_viewer on Viewer {\n  ...MovieSearch_viewer\n}\n\nfragment Home_viewer on Viewer {\n  id\n}\n\nfragment MovieSearchResultItem_viewer on Viewer {\n  id\n}\n\nfragment MovieSearch_viewer on Viewer {\n  ...MovieSearchResultItem_viewer\n}\n\nfragment ShareDownload_viewer on Viewer {\n  id\n}\n\nfragment ShareLink_viewer on Viewer {\n  id\n}\n\nfragment Share_viewer on Viewer {\n  ...ShareDownload_viewer\n  ...ShareLink_viewer\n}\n\nfragment SplashCharacter_viewer on Viewer {\n  id\n}\n\nfragment SplashCharacters_viewer on Viewer {\n  ...SplashCharacter_viewer\n}\n\nfragment SplashSpoofInput_viewer on Viewer {\n  id\n}\n\nfragment Splash_viewer on Viewer {\n  ...SplashCharacters_viewer\n  ...SplashSpoofInput_viewer\n}\n\nfragment Viewer_viewer on Viewer {\n  id\n  deckTitle\n  ...Header_viewer\n  ...Home_viewer\n  ...Deck_viewer\n  ...Footer_viewer\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '69f623defc9f490b6f9f7298fac25b65';

module.exports = node;
