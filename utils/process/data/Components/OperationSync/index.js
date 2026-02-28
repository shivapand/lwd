'use strict';

import React, {
  useEffect,
  useCallback
} from 'react';
import {
  Box,
  Text
} from 'ink';

import sync from '../../fns/sync';

const OperationSync = (
  {
    dbLocal,
    dbRemote,
    onCompleted
  }
) => {

  const collectionNamesFetch = useCallback(
    () => {

      return sync(
        dbLocal,
        dbRemote
      )
        .then(
          () => {

            return onCompleted();
          }
        );
    },
    [
      dbLocal,
      dbRemote,
      onCompleted
    ]
  );

  useEffect(
    () => {

      collectionNamesFetch();
    },
    [
      collectionNamesFetch
    ]
  );

  return (
    <Box>
      <Text>
        running ...
      </Text>
    </Box>
  );
};

export default OperationSync;
