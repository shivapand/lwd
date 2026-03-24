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
import { config } from '../../../../package.json';

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
      config.GENRE;

    const hero = searchParams.get('hero') ||
      config.HERO;

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

          const base64Data = movie.base64
            .replace(/^data:image\/gif;base64,/, '')
            .replace(/[\r\n\s]+/g, '');

          const filename = movie.path.split('/').pop();

          console.log('Preparing download...', filename, 'Base64 length:', base64Data.length);

          try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/gif' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log('Download triggered');
            return Promise.resolve(props.onShareCompleted());
          } catch (e) {
            console.error('Download processing failed:', e);
            throw e;
          }
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
