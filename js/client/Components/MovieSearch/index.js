'use strict';

import React,
{
  useState,
  useCallback,
  useRef
} from 'react';
import {
  useNavigate,
  useSearchParams
} from 'react-router-dom';
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

const dropdownStyle = css({
  '& .form-control': {
    borderRadius: 0,
    backgroundColor: '#1e1e22',
    color: '#eee',
    borderColor: '#333',
    '&::placeholder': {
      color: '#888'
    },
    '&:focus': {
      backgroundColor: '#1e1e22',
      color: '#eee',
      borderColor: '#555',
      boxShadow: 'none'
    }
  },
  '& .dropdown-menu': {
    backgroundColor: '#1e1e22',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '4px 0',
    marginTop: '2px',
    scrollbarColor: '#333 #1e1e22',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: '#1e1e22'
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#333',
      borderRadius: '4px'
    }
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

const MovieSearch = () => {

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

  const navigate = useNavigate();

  const [
    searchParams
  ] = useSearchParams();

  const movieSearchFn = useCallback(
    (
      text
    ) => {

      return fetch(
        `/api/search?q=${
          encodeURIComponent(text)
        }`
      )
        .then(
          (res) => res.json()
        )
        .then(
          (data) => {

            return resultsSet(
              data.results
            );
          }
        );
    },
    []
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

  const onChangeHandle = (
    [
      result
    ]
  ) => {

    const title = result?.title;

    return (!loading && title)
      ? navigate(
        `/deck/${
          encodeURIComponent(title)
        }?genre=${
          encodeURIComponent(
            searchParams.get('genre') ||
            process.env.GENRE
          )
        }&hero=${
          encodeURIComponent(
            searchParams.get('hero') ||
            process.env.HERO
          )
        }`
      )
      : null;
  };

  const onFocusHandle = () => {

    return !results &&
      movieSearch('');
  };

  const onInputChangeHandle = (
    text
  ) => {

    return !text &&
      movieSearch('');
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
              0
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
            onFocus = {
              onFocusHandle
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

export default MovieSearch;
