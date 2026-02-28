/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type MovieSearchInput = {|
  text: string,
  clientMutationId?: ?string,
|};
export type MovieSearchMutationVariables = {|
  input: MovieSearchInput
|};
export type MovieSearchMutationResponse = {|
  +movieSearch: ?{|
    +viewer: ?{|
      +id: ?string
    |},
    +results: ?$ReadOnlyArray<?{|
      +title: ?string
    |}>,
  |}
|};
export type MovieSearchMutation = {|
  variables: MovieSearchMutationVariables,
  response: MovieSearchMutationResponse,
|};
*/


/*
mutation MovieSearchMutation(
  $input: MovieSearchInput!
) {
  movieSearch(input: $input) {
    viewer {
      id
    }
    results {
      title
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MovieSearchPayload",
    "kind": "LinkedField",
    "name": "movieSearch",
    "plural": false,
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "MovieSearchResult",
        "kind": "LinkedField",
        "name": "results",
        "plural": true,
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
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MovieSearchMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MovieSearchMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2c41e306a973d2a006cfcb5aadae936d",
    "id": null,
    "metadata": {},
    "name": "MovieSearchMutation",
    "operationKind": "mutation",
    "text": "mutation MovieSearchMutation(\n  $input: MovieSearchInput!\n) {\n  movieSearch(input: $input) {\n    viewer {\n      id\n    }\n    results {\n      title\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'de4ffc60b65a85b16d4f6e3f0070cdd8';

module.exports = node;
