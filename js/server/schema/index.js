'use strict';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLInt
} from 'graphql';
import {
  mutationWithClientMutationId,
  connectionDefinitions,
  connectionArgs
} from 'graphql-relay';
import {
  ObjectID
} from 'mongodb';

import viewerGet from './fns/viewer';
import movieSearch from './mutations/movieSearch';
import movieCreate from './mutations/movieCreate';
import deckConnectionGet from './query/deckConnectionGet';
import {
  actorImageFindOne 
} from '~/js/server/data/actorImage';
import {
  deckFindOne
} from '~/js/server/data/deck';

const characterType = new GraphQLObjectType(
  {
    name: 'Character',
    fields() {

      return {
        renderText: {
          type: GraphQLString
        },
        role: {
          type: GraphQLString
        },
        dualRoleIndex: {
          type: GraphQLInt
        },
        actorImageId: {
          type: GraphQLID
        },
        image: {
          type: GraphQLString,
          resolve(
            {
              actorImageId
            },
            args,
            {
              db
            }
          ) {

            return actorImageFindOne(
              {
                _id: new ObjectID(
                  actorImageId
                )
              },
              undefined,
              db
            )
              .then(
                (
                  {
                    base64
                  }
                ) => {

                  return (
                    base64
                  );
                }
              );
          }
        }
      };
    }
  }
);

const splashType = new GraphQLObjectType(
  {
    name: 'Splash',
    fields() {

      return {
        title: {
          type: GraphQLString,
        },
        poster: {
          type: GraphQLString
        },
        characters: {
          type: new GraphQLList(
            characterType
          ),
          resolve(
            {
              characters
            }
          ) {

            return characters.filter(
              (
                character
              ) => {

                return (
                  character.render
                );
              }
            );
          }
        },
        spoofable: {
          type: GraphQLBoolean
        }
      };
    }
  }
);

const cardType = new GraphQLObjectType(
  {
    name: 'Card',
    fields() {

      return {
        renderText: {
          type: GraphQLString
        },
        character: {
          type: characterType
        },
        actorImageId: {
          type: GraphQLID
        },
        dualRoleIndex: {
          type: GraphQLInt
        },
        image: {
          type: GraphQLString,
          resolve(
            {
              actorImageId,
              gifyUrl
            },
            args,
            {
              db
            }
          ) {

            return (
              actorImageId
            ) ?
              actorImageFindOne(
                {
                  _id: new ObjectID(
                    actorImageId
                  )
                },
                undefined,
                db
              )
                .then(
                  (
                    {
                      base64
                    }
                  ) => {

                    return (
                      base64
                    );
                  }
                ):
              gifyUrl;
          }
        }
      };
    }
  }
);

const deckType = new GraphQLObjectType(
  {
    name: 'Deck',
    fields() {

      return {
        id: {
          type: GraphQLID,
          resolve(
            {
              _id: deckId
            }
          ) {

            return (
              deckId
            ) &&
              deckId.toString();
          }
        },
        splash: {
          type: splashType
        },
        cards: {
          type: new GraphQLList(
            cardType
          )
        }
      };
    }
  }
);

const movieType = new GraphQLObjectType(
  {
    name: 'Movie',
    fields() {

      return {
        id: {
          type: GraphQLID,
          resolve(
            {
              _id: movieId
            }
          ) {

            return (
              movieId
            ) &&
              movieId.toString();
          }
        },
        title: {
          type: GraphQLString
        },
        base64: {
          type: GraphQLString
        },
        path: {
          type: GraphQLString
        },
        url: {
          type: GraphQLString
        }
      };
    }
  }
);

const outputType = new GraphQLUnionType(
  {
    name: 'Output',
    types: [
      deckType,
      movieType
    ],
    resolveType(
      {
        splash
      }
    ) {

      return (
        splash
      ) ?
        deckType :
        movieType;
    }
  }
);

const {
  connectionType: deckConnectionType
} = connectionDefinitions(
  {
    name: 'Deck',
    nodeType: deckType
  }
);

const viewerType = new GraphQLObjectType(
  {
    name: 'Viewer',
    fields() {

      return {
        id: {
          type: GraphQLID,
          resolve(
            {
              _id: viewerId
            }
          ) {

            return (
              viewerId
            );
          }
        },
        text: {
          type: GraphQLString
        },
        deckTitle: {
          type: GraphQLString,
          resolve(
            parent,
            args,
            {
              db
            }
          ) {

            return movieCreate(
              'random',
              undefined,
              db,
              undefined
            )
              .then(
                (
                  {
                    splash: {
                      title
                    }
                  }
                ) => {

                  return (
                    title
                  );
                }
              );
          }
        },
        decks: {
          type: deckConnectionType,
          args: {
            deckId: {
              type: GraphQLID
            },
            deckTitle: {
              type: GraphQLString
            },
            spoofInput: {
              type: spoofInputType
            },
            genre: {
              type: GraphQLString
            },
            ...connectionArgs
          },
          async resolve(
            parent,
            {
              deckId: _deckId,
              deckTitle,
              spoofInput,
              genre,
              ...connectionArgs
            },
            {
              db
            }
          ) {

            const deckId = (
              deckTitle
            ) ?
              (
                await deckFindOne(
                  {
                    'splash.title': deckTitle
                  },
                  undefined,
                  db
                )
              )?._id :
              _deckId;

            return deckConnectionGet(
              deckId,
              {
                spoofInput,
                genre
              },
              connectionArgs,
              db
            );
          }
        }
      };
    }
  }
);

const queryType = new GraphQLObjectType(
  {
    name: 'QUery',
    fields() {

      return {
        viewer: {
          type: viewerType,
          resolve() {

            return viewerGet();
          }
        }
      };
    }
  }
);

const movieSearchResultType = new GraphQLObjectType(
  {
    name: 'MovieSearchResult',
    fields() {

      return {
        title: {
          type: GraphQLString
        },
        snippet: {
          type: GraphQLString
        }
      };
    }
  }
);

const MovieSearchMutation = mutationWithClientMutationId(
  {
    name: 'MovieSearch',
    inputFields: {
      text: {
        type: new GraphQLNonNull(
          GraphQLString
        )
      }
    },
    outputFields: {
      viewer: {
        type: viewerType,
        resolve() {

          return viewerGet();
        }
      },
      results: {
        type: new GraphQLList(
          movieSearchResultType
        ),
        resolve(
          results
        ) {

          return (
            results
          );
        }
      }
    },
    mutateAndGetPayload(
      {
        text
      }
    ) {

      return movieSearch(
        text
      );
    }
  }
);

const spoofInputType = new GraphQLInputObjectType(
  {
    name: 'spoofInput',
    fields() {

      return {
        hero: {
          type: GraphQLString
        },
        villain: {
          type: GraphQLString
        }
      };
    }
  }
);

const MovieCreateMutation = mutationWithClientMutationId(
  {
    name: 'MovieCreate',
    inputFields: {
      text: {
        type: new GraphQLNonNull(
          GraphQLString
        )
      },
      source: {
        type: GraphQLString
      },
      spoofInput: {
        type: spoofInputType
      },
      genre: {
        type: GraphQLString
      },
      outputType: {
        type: GraphQLString
      },
      createFlag: {
        type: GraphQLBoolean
      }
    },
    outputFields: {
      viewer: {
        type: viewerType,
        resolve() {

          return viewerGet();
        }
      },
      output: {
        type: outputType,
        resolve(
          output
        ) {

          return (
            output
          );
        }
      },
    },
    mutateAndGetPayload(
      {
        text,
        ...options
      },
      {
        db,
        req
      }
    ) {

      return movieCreate(
        text,
        options,
        db,
        req
      );
    }
  }
);

const mutationType = new GraphQLObjectType(
  {
    name: 'Mutation',
    fields() {

      return {
        movieSearch: MovieSearchMutation,
        movieCreate: MovieCreateMutation
      };
    }
  }
);

export default new GraphQLSchema(
  {
    query: queryType,
    mutation: mutationType
  }
);
