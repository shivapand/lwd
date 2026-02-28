'use strict';

import React, {
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';

import GenreSelect from '../GenreSelect';
import genreRemove from '../../fns/genreRemove';

const GenreRemove = (
  {
    dbLocal,
    onCompleted
  }
) => {

  const [
    genreId,
    genreIdSet
  ] = useState(
    null
  );

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const onGenreSelectHandle = (
    genreId
  ) => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return Promise.resolve(
            genreIdSet(
              genreId
            )
          );
        }
      )
      .then(
        () => {

          return genreRemove(
            genreId,
            dbLocal
          );
        }
      )
      .then(
        () => {

          return Promise.resolve(
            loadingSet(
              false
            )
          );
        }
      )
      .then(
        () => {

          return onCompleted();
        }
      );
  };

  const genreSelectRender = () => {

    return (
      !genreId 
    ) &&
      <GenreSelect
        dbLocal = {
          dbLocal
        }
        onGenreSelect = {
          onGenreSelectHandle
        }
      />;
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Text>
        running ...
      </Text>;
  };

  return (
    <Box>
      {
        genreSelectRender()
      }
      {
        loadingRender()
      }
    </Box>
  );
};

export default GenreRemove;
