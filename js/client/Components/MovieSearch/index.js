'use strict';

import React,
{
  useState,
  useCallback,
  useRef
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  AsyncTypeahead,
  TypeaheadMenu
} from 'react-bootstrap-typeahead';
import {
  css
} from '@emotion/core';

import {
  useIsMounted
} from 'fns';
import MovieSearchResultItem from './MovieSearchResultItem';
import MovieSearchMutation
  from 'mutations/MovieSearch';
import MovieCreateMutation
  from 'mutations/MovieCreate';

const dropdownStyle = css({
  '& .form-control': {
    borderRadius: 0
  },
  '& .dropdown-menu': {
    backgroundColor: '#1e1e22',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '4px 0',
    marginTop: '2px'
  },
  '& .dropdown-item': {
    backgroundColor: 'transparent',
    color: '#eee',
    padding: '4px 10px',
    '&:hover, &:focus': {
      backgroundColor: '#2a2a30'
    },
    '&.active, &:active': {
      backgroundColor: '#333'
    }
  }
});

const noResultsStyle = css({
  padding: '12px 16px',
  color: '#888',
  fontSize: '14px',
  textAlign: 'center'
});

const MovieSearch = (
  props
) => {

  const [
    results,
    resultsSet
  ] = useState(
    null
  );

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const isMounted = useIsMounted(
    false
  );

  const [
    isInvalid,
    isInvalidSet
  ] = useState(
    false
  );

  const movieSearchRef = useRef(
    null
  );

  const asyncTypeaheadRef = useRef(
    null
  );

  const clientMutationIdRef = useRef(
    0
  );

  const clientMutationIdGet = () => {

    const current = clientMutationIdRef.current;

    clientMutationIdRef.current = current + 1;

    return current.toString();
  };

  const onMovieSearchErrorHandle = (
    json
  ) => {

    return (
      json.errors[0].message
    );
  };

  const onMovieSearchCompletedHandle = (
    json
  ) => {

    const data = json.movieSearch;

    const _results = data.results;

    return Promise.resolve(
      resultsSet(
        _results
      )
    );
  };

  const movieSearchFn = useCallback(
    (
      text
    ) => {

      return MovieSearchMutation.commit(
        {
          input: {
            clientMutationId: clientMutationIdGet(),
            text
          }
        },
        props.relay.environment,
        onMovieSearchErrorHandle,
        onMovieSearchCompletedHandle
      );
    },
    [
      props.relay.environment
    ]
  );

  const movieSearch = useCallback(
    (
      text
    ) => {

      return Promise.resolve(
        loadingSet(
          true
        )
      )
        .then(
          () => {

            return Promise.resolve(
              isInvalidSet(
                false
              )
            );
          }
        )
        .then(
          () => {

            return movieSearchFn(
              text
            );
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
        );
    },
    [
      movieSearchFn,
      isMounted
    ]
  );

  const timerRef = useRef(
    null
  );

  const movieSearchDelay = useCallback(
    (
      _text
    ) => {

      const timer = timerRef.current;

      timer &&
        clearTimeout(
          timer
        );

      timerRef.current = setTimeout(
        () => {

          return movieSearch(
            _text
          );
        },
        400
      );
    },
    [
      movieSearch
    ]
  );

  const resultsFilter = (
    options
  ) => {

    return (
      options
    );
  };

  const onMovieCreateErrorHandle = (
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

  const onMovieCreateCompletedHandle = useCallback(
    (
      json
    ) => {

      return Promise.resolve(
        props.match.router
          .push(
            `
              /Deck/${
                json.movieCreate.output.splash.title
              }?genre=${
                props.match.location.query.genre ||
                process.env.GENRE
              }&hero=${
                props.match.location.query.hero ||
                process.env.HERO
              }
            `
              .trim()
          )
      );
    },
    [
      props.match.router,
      props.match.location.query.genre,
      props.match.location.query.hero
    ]
  );

  const movieCreateFn = useCallback(
    (
      title
    ) => {

      return !title
        ? null
        : MovieCreateMutation.commit(
          {
            input: {
              clientMutationId: clientMutationIdGet(),
              text: title,
              source: 'user',
              createFlag: true,
              genre: props.match.location.query.genre ||
                process.env.GENRE,
              spoofInput: {
                hero: props.match.location.query.hero ||
                  process.env.HERO
              }
            }
          },
          props.relay.environment,
          onMovieCreateErrorHandle,
          onMovieCreateCompletedHandle
        );
    },
    [
      props.relay.environment,
      onMovieCreateCompletedHandle
    ]
  );

  const movieCreate = (
    title
  ) => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return movieCreateFn(
            title
          );
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
      );
  };

  const onChangeHandle = (
    [
      result
    ]
  ) => {

    return !loading &&
      movieCreate(
        result?.title
      );
  };

  const onInputChangeHandle = (
    text
  ) => {

    return !text &&
      Promise.resolve(
        resultsSet(
          null
        )
      );
  };

  const menuRender = (
    _results,
    menuProps
  ) => {

    return (() => {

      switch (true) {

        case (
          loading ||
          isInvalid ||
          !results
        ):
          return (
            null
          );

        case (
          results.length === 0
        ):
          return (
            <ul
              {
                ...menuProps
              }
              className = {
                `dropdown-menu show ${
                  menuProps.className || ''
                }`
              }
            >
              <li>
                <div
                  css = {
                    noResultsStyle
                  }
                >
                  No results found
                </div>
              </li>
            </ul>
          );

        default:
          return (
            <TypeaheadMenu
              {
                ...menuProps
              }
              options = {
                results
              }
              labelKey = 'title'
            />
          );
      }
    })();
  };

  const menuItemChildrenRender = (
    result
  ) => {

    return (
      <MovieSearchResultItem
        result = {
          result
        }
      />
    );
  };

  const renderFn = () => {

    return (
      <form
        ref = {
          movieSearchRef
        }
      >
        <div
          className = 'formGroup form-group'
        >
          <AsyncTypeahead
            id = 'mediawiki-movie-search'
            ref = {
              asyncTypeaheadRef
            }
            className = 'formControl w-100'
            css = {
              dropdownStyle
            }
            size = 'large'
            placeholder =
              '&#128269; by movie title ...'
            data-key = 'text'
            minLength = {
              1
            }
            labelKey = 'title'
            options = {
              results ||
              []
            }
            isLoading = {
              loading
            }
            onSearch = {
              movieSearchDelay
            }
            filterBy = {
              resultsFilter
            }
            renderMenu = {
              menuRender
            }
            renderMenuItemChildren = {
              menuItemChildrenRender
            }
            onInputChange = {
              onInputChangeHandle
            }
            onChange = {
              onChangeHandle
            }
            isInvalid = {
              isInvalid
            }
          />

          <small
            className = 'invalidFeedback text-danger'
          ></small>
        </div>
      </form>
    );
  };

  return (
    <div
      className = 'MovieSearch'
    >
      {
        renderFn()
      }
    </div>
  );
};

export default createFragmentContainer(
  MovieSearch,
  {
    viewer: graphql`
      fragment MovieSearch_viewer on Viewer {
        id
      }
    `
  }
);
