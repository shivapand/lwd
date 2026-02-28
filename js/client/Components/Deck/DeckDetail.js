'use strict';

import React,
{
  cloneElement,
  useEffect,
  useCallback,
  useState,
  useReducer
} from 'react';
import {
  createRefetchContainer,
  graphql
} from 'react-relay';
import Loading from 'Components/Loading';

const DeckDetail = (
  props
) => {

  const [
    deck,
    deckDispatch
  ] = useReducer(
    () => {

      return (
        props.viewer.decks.edges[
          0
        ]
          .node
      );
    }
  );

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const refetchFn = useCallback(
    () => {

      return Promise.resolve(
        loadingSet(
          true
        )
      )
        .then(
          () => {

            return new Promise(
              (
                resolve
              ) => {

                return props.relay.refetch(
                  (
                    fragmentVariables
                  ) => {

                    return {
                      ...fragmentVariables,
                      deckTitle: 
                        props.match.params.deckTitle,
                      genre: props.match.location.query
                        .genre ||
                      process.env.GENRE,
                      spoofInput: {
                        hero: props.match.location.query
                          .hero ||
                        process.env.HERO
                      },
                      refetch: true
                    };
                  },
                  null,
                  () => {

                    return resolve(
                      null
                    );
                  },
                  {
                    force: true
                  }
                );
              }
            );
          }
        )
        .then(
          () => {

            return deckDispatch();
          }
        )
        .then(
          () => {

            return loadingSet(
              false
            );
          }
        );
    },
    [
      props.relay,
      props.match.params.deckTitle,
      props.match.location.query.genre,
      props.match.location.query.hero
    ]
  );

  const refetch = useCallback(
    () => {

      return refetchFn();
    },
    [
      refetchFn
    ]
  );

  useEffect(
    () => {

      refetch();
    },
    [
      refetch
    ]
  );

  const onSplashSpoofInputTriggerHandle = (
    text
  ) => {

    return Promise.resolve(
      props.match.router
        .push(
          `
            ${
              props.match.location.pathname
            }?genre=${
              props.match.location.query.genre
            }&hero=${
              text
            }
          `
            .trim()
        )
    );
  };

  const childrenRender = () => {

    return (
      !loading &&
      deck &&
      props.children
    ) &&
      cloneElement(
        props.children,
        {
          deck,
          viewer: props.viewer,
          match: props.match,
          onSplashSpoofInputTrigger: 
            onSplashSpoofInputTriggerHandle
        }
      );
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Loading/>;
  };

  return (
    <div
      className = 'DeckDetail h-100'
    >
      {
        childrenRender()
      }
      {
        loadingRender()
      }
    </div>
  );
};

export default createRefetchContainer(
  DeckDetail,
  {
    viewer: graphql`
      fragment DeckDetail_viewer on Viewer 
      @argumentDefinitions(
        deckFirst: {
          type: "Int!",
          defaultValue: 1
        },
        deckTitle: {
          type: "String"
        },
        spoofInput: {
          type: "spoofInput"
        },
        genre: {
          type: "String"
        },
        refetch: {
          type: "Boolean",
          defaultValue: false
        }
      ) {
        id,
        decks(
          first: $deckFirst,
          deckTitle: $deckTitle,
          spoofInput: $spoofInput,
          genre: $genre
        ) @connection(
          key: "Connection_decks"
        ) {
          edges {
            node {
              id,
              ...DeckNode_deck @include(
                if: $refetch
              )
            }
          }
        },
        ...DeckNode_viewer
      }
    `
  },
  graphql`
    query DeckDetailRefetchQuery(
      $deckTitle: String!,
      $spoofInput: spoofInput,
      $genre: String!,
      $refetch: Boolean!
    ) {
      viewer {
        ...DeckDetail_viewer @arguments(
          deckTitle: $deckTitle,
          spoofInput: $spoofInput,
          genre: $genre,
          refetch: $refetch
        )
      }
    }
  `
);
