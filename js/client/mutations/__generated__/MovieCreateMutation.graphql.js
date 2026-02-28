/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type MovieCreateInput = {|
  text: string,
  source?: ?string,
  spoofInput?: ?spoofInput,
  genre?: ?string,
  outputType?: ?string,
  createFlag?: ?boolean,
  clientMutationId?: ?string,
|};
export type spoofInput = {|
  hero?: ?string,
  villain?: ?string,
|};
export type MovieCreateMutationVariables = {|
  input: MovieCreateInput
|};
export type MovieCreateMutationResponse = {|
  +movieCreate: ?{|
    +viewer: ?{|
      +id: ?string,
      +deckTitle: ?string,
    |},
    +output: ?{|
      +splash?: ?{|
        +title: ?string
      |},
      +path?: ?string,
      +base64?: ?string,
    |},
  |}
|};
export type MovieCreateMutation = {|
  variables: MovieCreateMutationVariables,
  response: MovieCreateMutationResponse,
|};
*/


/*
mutation MovieCreateMutation(
  $input: MovieCreateInput!
) {
  movieCreate(input: $input) {
    viewer {
      id
      deckTitle
    }
    output {
      __typename
      ... on Deck {
        splash {
          title
        }
      }
      ... on Movie {
        path
        base64
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "Viewer",
  "kind": "LinkedField",
  "name": "viewer",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deckTitle",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v3 = {
  "kind": "InlineFragment",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Deck",
  "abstractKey": null
},
v4 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "path",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "base64",
      "storageKey": null
    }
  ],
  "type": "Movie",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MovieCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MovieCreatePayload",
        "kind": "LinkedField",
        "name": "movieCreate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "output",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MovieCreateMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MovieCreatePayload",
        "kind": "LinkedField",
        "name": "movieCreate",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "output",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "a25d472804807707e7dec6ab163b0ae0",
    "id": null,
    "metadata": {},
    "name": "MovieCreateMutation",
    "operationKind": "mutation",
    "text": "mutation MovieCreateMutation(\n  $input: MovieCreateInput!\n) {\n  movieCreate(input: $input) {\n    viewer {\n      id\n      deckTitle\n    }\n    output {\n      __typename\n      ... on Deck {\n        splash {\n          title\n        }\n      }\n      ... on Movie {\n        path\n        base64\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dc25e86349614890ace645151241f18d';

module.exports = node;
