'use strict';

import React,
{
  useState
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

import {
  useIsMounted
} from 'fns';
import MovieCreateMutation from 'mutations/MovieCreate';
import Loading from 'Components/Loading';

const DeckRefresh = (
  props
) => {

  const  [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const isMounted = useIsMounted(
    false
  );

  let clientMutationId = 0;

  const onMovieCreateErrorHandle = (
    json
  ) => {

    return JSON.parse(
      json.errors[
        0
      ]
        .message
    );
  };

  const onMovieCreateCompletedHandle = (
    json
  ) => {

    return props.match.router
      .push(
        `
          /Deck/${
            json.movieCreate.viewer.deckTitle
          }${
            props.match.location.search
          }
        `
          .trim()
      );
  };

  const movieCreateFn = () => {

    return MovieCreateMutation.commit(
      {
        input: {
          clientMutationId: (
            clientMutationId++
          )
            .toString(),
          text: 'random',
          genre: process.env.GENRE
        }
      },
      props.relay.environment,
      onMovieCreateErrorHandle,
      onMovieCreateCompletedHandle
    );
  };

  const movieCreate = () => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return movieCreateFn();
        }
      )
      .then(
        () => {

          if (
            isMounted.current
          ) {

            return Promise.resolve(
              loadingSet(
                false
              )
            );
          }
        }
      );
  };

  const onRefreshTriggerHandle = () => {

    event.preventDefault();
    event.stopPropagation();

    return movieCreate();
  };

  const refreshIconRender = () => {

    return (
      <i
        className = 'fa fa-sync fa-lg fa-fw'
      ></i>
    );
  };

  const loadingRender = () => {

    return (
      <Loading/>
    );
  };

  const switchRender = () => {

    return (
      !loading
    ) ?
      refreshIconRender() :
      loadingRender();
  };

  const renderFn = () => {

    return (
      <a
        className = 'text-white'
        href = '#'
        onClick = {
          onRefreshTriggerHandle
        }
      >
        {
          switchRender()
        }
      </a>
    );
  };

  return (
    <div
      className = 'DeckRefresh'
    >
      {
        renderFn()
      }
    </div>
  );
};

export default createFragmentContainer(
  DeckRefresh,
  {
    viewer: graphql`
      fragment DeckRefresh_viewer on Viewer {
        id
      }
    `
  }
);
