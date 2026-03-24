'use strict';

import React,
{
  useState,
  useRef
} from 'react';
import {
  useParams,
  useSearchParams
} from 'react-router-dom';
import {
  css
} from '@emotion/core';

import {
  useIsMounted
} from 'fns';
import downloadjs from 'downloadjs';

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

  const {
    deckTitle
  } = useParams();

  const [
    searchParams
  ] = useSearchParams();

  const movieCreateFn = () => {

    const title = deckTitle;

    const genre = searchParams.get('genre') ||
      process.env.GENRE;

    const hero = searchParams.get('hero') ||
      process.env.HERO;

    return fetch(
      '/api/movie',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            title,
            genre,
            hero
          }
        )
      }
    )
      .then(
        (res) => res.json()
      )
      .then(
        (movie) => {

          if (!movie || !movie.base64) {
            console.error('Movie or base64 data is missing', movie);
            throw new Error('Movie data missing');
          }

          const base64 = `
            data:image/gif;base64,${
              movie.base64
            }
          `
            .trim();

          const filename = movie.path.match(
            /^\/output\/(.+)/
          )?.[
            1
          ];

          console.log('Downloading...', filename, 'Base64 length:', base64.length);

          return Promise.resolve(
            downloadjs(
              base64,
              filename,
              'image/gif'
            )
          )
            .then(
              () => {

                console.log('Download complete');

                return Promise.resolve(
                  props.onShareCompleted()
                );
              }
            );
        }
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

          return isMounted.current &&
            Promise.resolve(
              loadingSet(
                false
              )
            );
        }
      )
      .catch(
        () => {

          return isMounted.current &&
            Promise.resolve(
              loadingSet(
                false
              )
            );
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
      <span
        className = 'spinner-border spinner-border-sm text-light'
        role = 'status'
      />
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

export default ShareDownload;
