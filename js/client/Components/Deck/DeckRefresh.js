'use strict';

import React,
{
  useState
} from 'react';
import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';

import {
  useIsMounted
} from 'fns';
import Loading from 'Components/Loading';

const DeckRefresh = () => {

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const isMounted = useIsMounted(
    false
  );

  const navigate = useNavigate();

  const [
    searchParams
  ] = useSearchParams();

  const onRefreshTriggerHandle = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();

    loadingSet(true);

    const genre = searchParams.get('genre') ||
      process.env.GENRE;

    const hero = searchParams.get('hero') ||
      process.env.HERO;

    return fetch(
      `/api/deck/random?genre=${
        encodeURIComponent(genre)
      }&hero=${
        encodeURIComponent(hero)
      }`
    )
      .then(
        (res) => res.json()
      )
      .then(
        (data) => {

          return (data.redirect)
            ? navigate(data.redirect)
            : null;
        }
      )
      .then(
        () => {

          return isMounted.current &&
            loadingSet(false);
        }
      )
      .catch(
        () => {

          return isMounted.current &&
            loadingSet(false);
        }
      );
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
      <Loading />
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

export default DeckRefresh;
