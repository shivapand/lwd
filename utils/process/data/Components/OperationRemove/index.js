'use strict';

import React, {
  useState
} from 'react';
import {
  Box
} from 'ink';

import CollectionSelect from '../CollectionSelect';
import GenreRemove from '../GenreRemove';
import SetRemove from '../SetRemove';

const OperationRemove = (
  {
    dbLocal,
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

  const genreRemoveRender = () => {

    return (
      <GenreRemove
        dbLocal = {
          dbLocal
        }
        onCompleted = {
          onCompleted
        }
      />
    );
  };

  const setRemoveRender = () => {

    return (
      <SetRemove
        dbLocal = {
          dbLocal
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

        return genreRemoveRender();

      case (
        'sets'
      ) :

        return setRemoveRender();

      default:

        return (
          null
        );
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

export default OperationRemove;
