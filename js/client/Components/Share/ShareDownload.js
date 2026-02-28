'use strict';

import React, 
{
  useState,
  useRef
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

import {
  useIsMounted
} from 'fns';
import MovieCreateMutation from 'mutations/MovieCreate';
import downloadjs from 'downloadjs';
import Loading from 'Components/Loading';

const ShareDownload = (
  props
) => {

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const shareDownloadRef = useRef(
    null
  );

  const isMounted = useIsMounted(
    false
  );

  const onErrorHandle = (
    json
  ) => {

    return Promise.resolve(
      JSON.parse(
        json.errors[
          0
        ]
          .message
      )
    );
  };

  const onCompletedHandle = (json) => {

    const movie = json.movieCreate.output;

    const base64 = `
      data:image/jpeg;base64,${
        movie.base64
      }
    `
      .trim();

    const filename = movie.path.match(
      /^\/output\/(.+)/
    )?.[
      1
    ];

    return Promise.resolve(
      downloadjs(
        base64,
        filename
      )
    )
      .then(
        () => {

          return Promise.resolve(
            props.onShareCompleted()
          );
        }
      );
  };

  let clientMutationId = 0;

  const movieCreateFn = () => {

    const text = props.match.location.pathname
      .match(
        /^\/Deck\/(.+)/
      )?.[
        1
      ];

    const {
      genre,
      hero
    } = props.match.location.query;

    return MovieCreateMutation.commit(
      {
        input: {
          clientMutationId: (
            clientMutationId++
          )
            .toString(),
          text,
          spoofInput: {
            hero
          },
          genre,
          outputType: 'movie',
          createFlag: true
        }
      },
      props.relay.environment,
      onErrorHandle,
      onCompletedHandle
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

  const onClickHandle = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();

    return movieCreate();
  };

  const downloadIconRender = () => {

    return (
      <i 
        className = 'fa fa-download fa-fw'
      ></i>
    );
  };

  const loadingIconRender = () => {

    return (
      <Loading/>
    );
  };

  const iconRender = () => {

    return (
      !loading
    ) ?
      downloadIconRender() :
      loadingIconRender();
  };

  return (
    <button 
      ref = {
        shareDownloadRef
      }
      className = 'btn btn-secondary rounded-0'
      css = {
        css(
          {
            boxShadow: 'none !important',
            outline: 'none !important'
          }
        )
      }
      onClick = {
        onClickHandle
      }
    >
      {
        iconRender()
      }
    </button>
  );
};

export default createFragmentContainer(
  ShareDownload,
  {
    viewer: graphql`
      fragment ShareDownload_viewer on Viewer {
        id
      }
    `
  }
);
