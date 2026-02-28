/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type DeckDetail_viewer$ref = any;
export type spoofInput = {|
  hero?: ?string,
  villain?: ?string,
|};
export type DeckDetailRefetchQueryVariables = {|
  deckTitle: string,
  spoofInput?: ?spoofInput,
  genre: string,
  refetch: boolean,
|};
export type DeckDetailRefetchQueryResponse = {|
  +viewer: ?{|
    +$fragmentRefs: DeckDetail_viewer$ref
  |}
|};
export type DeckDetailRefetchQuery = {|
  variables: DeckDetailRefetchQueryVariables,
  response: DeckDetailRefetchQueryResponse,
|};
*/


/*
query DeckDetailRefetchQuery(
  $deckTitle: String!
  $spoofInput: spoofInput
  $genre: String!
  $refetch: Boolean!
) {
  viewer {
    ...DeckDetail_viewer_3ROcCi
    id
  }
}

fragment Card_card on Card {
  image
  renderText
  character {
    role
  }
  actorImageId
  dualRoleIndex
}

fragment Card_viewer on Viewer {
  id
}

fragment Carousel_viewer on Viewer {
  id
}

fragment DeckDetail_viewer_3ROcCi on Viewer {
  id
  decks(first: 1, deckTitle: $deckTitle, spoofInput: $spoofInput, genre: $genre) {
    edges {
      node {
        id
        ...DeckNode_deck @include(if: $refetch)
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

fragment DeckNode_deck on Deck {
  id
  splash {
    ...Splash_splash
  }
  cards {
    ...Card_card
  }
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

fragment SplashCharacter_character on Character {
  renderText
  role
  dualRoleIndex
  image
}

fragment SplashCharacter_viewer on Viewer {
  id
}

fragment SplashCharacters_splash on Splash {
  characters {
    ...SplashCharacter_character
  }
}

fragment SplashCharacters_viewer on Viewer {
  ...SplashCharacter_viewer
}

fragment SplashSpoofInput_viewer on Viewer {
  id
}

fragment Splash_splash on Splash {
  title
  poster
  ...SplashCharacters_splash
}

fragment Splash_viewer on Viewer {
  ...SplashCharacters_viewer
  ...SplashSpoofInput_viewer
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "deckTitle"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "genre"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "refetch"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "spoofInput"
},
v4 = {
  "kind": "Variable",
  "name": "deckTitle",
  "variableName": "deckTitle"
},
v5 = {
  "kind": "Variable",
  "name": "genre",
  "variableName": "genre"
},
v6 = {
  "kind": "Variable",
  "name": "spoofInput",
  "variableName": "spoofInput"
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = [
  (v4/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v5/*: any*/),
  (v6/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "renderText",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dualRoleIndex",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "image",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeckDetailRefetchQuery",
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
            "args": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "kind": "Variable",
                "name": "refetch",
                "variableName": "refetch"
              },
              (v6/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "DeckDetail_viewer"
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeckDetailRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          {
            "alias": null,
            "args": (v8/*: any*/),
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
                      (v7/*: any*/),
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
                            "alias": null,
                            "args": null,
                            "concreteType": "Splash",
                            "kind": "LinkedField",
                            "name": "splash",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "title",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "poster",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Character",
                                "kind": "LinkedField",
                                "name": "characters",
                                "plural": true,
                                "selections": [
                                  (v9/*: any*/),
                                  (v10/*: any*/),
                                  (v11/*: any*/),
                                  (v12/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Card",
                            "kind": "LinkedField",
                            "name": "cards",
                            "plural": true,
                            "selections": [
                              (v12/*: any*/),
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Character",
                                "kind": "LinkedField",
                                "name": "character",
                                "plural": false,
                                "selections": [
                                  (v10/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "actorImageId",
                                "storageKey": null
                              },
                              (v11/*: any*/)
                            ],
                            "storageKey": null
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
            "alias": null,
            "args": (v8/*: any*/),
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
    "cacheID": "efe99f72e159474fe6622878b994c59c",
    "id": null,
    "metadata": {},
    "name": "DeckDetailRefetchQuery",
    "operationKind": "query",
    "text": "query DeckDetailRefetchQuery(\n  $deckTitle: String!\n  $spoofInput: spoofInput\n  $genre: String!\n  $refetch: Boolean!\n) {\n  viewer {\n    ...DeckDetail_viewer_3ROcCi\n    id\n  }\n}\n\nfragment Card_card on Card {\n  image\n  renderText\n  character {\n    role\n  }\n  actorImageId\n  dualRoleIndex\n}\n\nfragment Card_viewer on Viewer {\n  id\n}\n\nfragment Carousel_viewer on Viewer {\n  id\n}\n\nfragment DeckDetail_viewer_3ROcCi on Viewer {\n  id\n  decks(first: 1, deckTitle: $deckTitle, spoofInput: $spoofInput, genre: $genre) {\n    edges {\n      node {\n        id\n        ...DeckNode_deck @include(if: $refetch)\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  ...DeckNode_viewer\n}\n\nfragment DeckNode_deck on Deck {\n  id\n  splash {\n    ...Splash_splash\n  }\n  cards {\n    ...Card_card\n  }\n}\n\nfragment DeckNode_viewer on Viewer {\n  ...Splash_viewer\n  ...Card_viewer\n  ...Carousel_viewer\n  ...DeckRefresh_viewer\n}\n\nfragment DeckRefresh_viewer on Viewer {\n  id\n}\n\nfragment SplashCharacter_character on Character {\n  renderText\n  role\n  dualRoleIndex\n  image\n}\n\nfragment SplashCharacter_viewer on Viewer {\n  id\n}\n\nfragment SplashCharacters_splash on Splash {\n  characters {\n    ...SplashCharacter_character\n  }\n}\n\nfragment SplashCharacters_viewer on Viewer {\n  ...SplashCharacter_viewer\n}\n\nfragment SplashSpoofInput_viewer on Viewer {\n  id\n}\n\nfragment Splash_splash on Splash {\n  title\n  poster\n  ...SplashCharacters_splash\n}\n\nfragment Splash_viewer on Viewer {\n  ...SplashCharacters_viewer\n  ...SplashSpoofInput_viewer\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e2734ed06ca6211da6608b4c5d03628a';

module.exports = node;
