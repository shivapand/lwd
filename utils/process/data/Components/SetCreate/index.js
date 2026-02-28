'use strict';

import React, {
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';

import FolderSelect from '../FolderSelect';
import GenreSelect from '../GenreSelect';
import setCreate from '../../fns/setCreate';

const SetCreate = (
  {
    dbLocal,
    sourceFolderPathString,
    operationType,
    onCompleted
  }
) => {

  const [
    setText,
    setTextSet
  ] = useState(
    null
  );

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

  const onFolderSelectHandle = (
    setText
  ) => {

    return Promise.resolve(
      setTextSet(
        setText
      )
    );
  };

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

          return setCreate(
            genreId,
            setText,
            dbLocal,
            sourceFolderPathString
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

  const folderSelectRender = () => {

    return (
      !setText &&
      !genreId
    ) &&
      <FolderSelect
        dbLocal = {
          dbLocal
        }
        sourceFolderPathString = {
          sourceFolderPathString
        }
        operationType = {
          operationType
        }
        onFolderSelect = {
          onFolderSelectHandle
        }
      />;
  };

  const genreSelectRender = () => {

    return (
      setText &&
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
    <Box
      flexDirection = 'column'
    >
      <Box>
        {
          folderSelectRender()
        }
        {
          genreSelectRender()
        }
      </Box>
      {
        loadingRender()
      }
    </Box>
  );
};

export default SetCreate;
