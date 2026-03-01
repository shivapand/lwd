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
      +title: ?string,
      +year: ?string,
      +poster: ?string,
      +rating: ?string,
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
      year
      poster
      rating
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "year",
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
            "kind": "ScalarField",
            "name": "rating",
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
    "cacheID": "7609281b9eacf36b3cf08f5d02a42215",
    "id": null,
    "metadata": {},
    "name": "MovieSearchMutation",
    "operationKind": "mutation",
    "text": "mutation MovieSearchMutation(\n  $input: MovieSearchInput!\n) {\n  movieSearch(input: $input) {\n    viewer {\n      id\n    }\n    results {\n      title\n      year\n      poster\n      rating\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aa272949e0bbef4d18f767098f3d82b2';

module.exports = node;
