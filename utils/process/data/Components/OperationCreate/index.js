'use strict';

import React, {
  useState
} from 'react';
import {
  Box
} from 'ink';

import CollectionSelect from '../CollectionSelect';
import GenreCreate from '../GenreCreate';
import SetCreate from '../SetCreate';

const OperationCreate = (
  {
    dbLocal,
    sourceFolderPathString,
    operationType,
    onCompleted
  }
) => {

  const [
    collectionName,
    collectionNameSet
  ] = useState(
    null
  );

  const onCollectionSelectHandle = (
    collectionName
  ) => {

    return Promise.resolve(
      collectionNameSet(
        collectionName
      )
    );
  };

  const collectionSelectRender = () => {

    return (
      !collectionName
    ) &&
      <CollectionSelect
        dbLocal = {
          dbLocal
        }
        onCollectionSelect = {
          onCollectionSelectHandle
        }
      />;
  };

  const genreCreateRender = () => {

    return (
      <GenreCreate
        dbLocal = {
          dbLocal
        }
        onCompleted = {
          onCompleted
        }
      />
    );
  };

  const setCreateRender = () => {

    return (
      <SetCreate
        dbLocal = {
          dbLocal
        }
        sourceFolderPathString = {
          sourceFolderPathString
        }
        operationType = {
          operationType
        }
        onCompleted = {
          onCompleted
        }
      />
    );
  };

  const switchRender = () => {

    switch (
      collectionName
    ) {

      case (
        'genres'
      ) :

        return genreCreateRender();

      case (
        'sets'
      ) :

        return setCreateRender();
    }
  };

  return (
    <Box>
      {
        collectionSelectRender()
      }
      {
        switchRender()
      }
    </Box>
  );
};

export default OperationCreate;
