'use strict';

import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Text
} from 'ink';
import InkSelectInput from 'ink-select-input';

import {
  genresFind 
} from '~/js/server/data/genre';

const GenreSelect = (
  {
    dbLocal,
    onGenreSelect
  }
) => {

  const [
    genres,
    genresSet
  ] = useState(
    null
  );

  const genresFetch = useCallback(
    () => {

      if (
        genres
      ) {

        return (
          null
        );
      }

      return genresFind(
        undefined,
        undefined,
        dbLocal
      )
        .then(
          (
            res
          ) => {

            const genres = res.map(
              (
                {
                  text,
                  _id: genreId
                }
              ) => {

                return {
                  label: text,
                  value: text,
                  genreId
                };
              }
            );

            return Promise.resolve(
              genresSet(
                genres
              )
            );
          }
        );
    },
    [
      genres,
      dbLocal
    ]
  );

  useEffect(
    () => {

      genresFetch();
    },
    [
      genresFetch
    ]
  );

  const onSelectHandle = (
    {
      genreId
    }
  ) => {

    return onGenreSelect(
      genreId
    );
  };

  const inkSelectInputRender = () => {

    return (
      genres
    ) &&
      <InkSelectInput
        items = {
          genres
        }
        onSelect = {
          onSelectHandle
        }
      />;
  };

  return (
    <Box
      flexDirection = 'column'
    >
      <Text>
        genre select:
      </Text>

      {
        inkSelectInputRender()
      }
    </Box>
  );
};

export default GenreSelect;
