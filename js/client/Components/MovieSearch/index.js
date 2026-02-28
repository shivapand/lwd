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

    const results = data.results;

    return Promise.resolve(
      resultsSet(
        results
      )
    );
  };

  let clientMutationId = 0;

  const movieSearchFn = useCallback(
    (
      text
    ) => {

      return MovieSearchMutation.commit(
        {
          input: {
            clientMutationId: (
              clientMutationId++
            )
              .toString(),
            text
          }
        },
        props.relay.environment,
        onMovieSearchErrorHandle,
        onMovieSearchCompletedHandle
      );
    },
    [
      clientMutationId,
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

      if (
        timer
      ) {

        clearTimeout(
          timer
        );
      }

      timerRef.current = setTimeout(
        () => {

          return movieSearch(
            _text
          );
        },
        1000
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
        asyncTypeaheadRef.current
          .clear()
      )
        .then(
          () => {

            return Promise.resolve(
              props.match.router
                .push(
                  `
                    /Deck/${
                      json.movieCreate.output.splash.title
                    }?genre=${
                      props.match.location.query.genre
                    }&hero=${
                      props.match.location.query.hero
                    }
                  `
                    .trim()
                )
            );
          }
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

      if (
        !title
      ) {

        return (
          null
        );
      }

      return MovieCreateMutation.commit(
        {
          input: {
            clientMutationId: (
              clientMutationId++
            )
              .toString(),
            text: title,
            source: 'user',
            createFlag: true
          }
        },
        props.relay.environment,
        onMovieCreateErrorHandle,
        onMovieCreateCompletedHandle
      );
    },
    [
      clientMutationId,
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

  const onChangeHandle = (
    [
      title
    ]
  ) => {

    if (
      !loading
    ) {

      return movieCreate(
        title
      );
    }
  };

  const onInputChangeHandle = (
    text
  ) => {

    if (
      !text
    ) {

      return Promise.resolve(
        resultsSet(
          null
        )
      );
    }
  };

  const menuRender = (
    results,
    menuProps
  ) => {

    if (
      loading ||
      isInvalid ||
      !results
    ) {

      return (
        null
      );
    }

    return (
      <TypeaheadMenu
        {
          ...menuProps
        }
        options = {
          results.map(
            (
              {
                title
              }
            ) => {

              return (
                title
              );
            }
          )
        }
      />
    );
  };

  const menuItemChildrenRender = (
    resultTitle
  ) => {

    return (
      <MovieSearchResultItem
        viewer = {
          props.viewer
        }
        match = {
          props.match
        }
        resultTitle = {
          resultTitle
        }
      />
    );
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <div
        className = 'rbt-aux'
      >
        <i
          className = 'fa fa-spinner fa-spin'
        ></i>
      </div>;
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
              css(
                {
                  '& .form-control': {
                    borderRadius: 0
                  }
                }
              )
            }
            size = 'large'
            placeholder = 
              '&#128269; by movie title ...'
            data-key = 'text'
            minLength = {
              1
            }
            options = {
              results || 
              []
            }
            isLoading = {
              false
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
          >
            {
              loadingRender()
            }
          </AsyncTypeahead>

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
        ...MovieSearchResultItem_viewer
      }
    `
  }
);
