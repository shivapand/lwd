'use strict';

import React, {
  useState
} from 'react';
import {
  Box
} from 'ink';

import OperationSelect from '../OperationSelect';
import OperationCreate from '../OperationCreate';
import OperationRemove from '../OperationRemove';
import OperationSync from '../OperationSync';

const Viewer = (
  {
    dbLocal,
    dbRemote,
    sourceFolderPathString,
    onCompleted
  }
) => {

  const [
    operationType,
    operationTypeSet
  ] = useState(
    null
  );

  const onOperationSelectHandle = (
    operationType
  ) => {

    return Promise.resolve(
      operationTypeSet(
        operationType
      )
    );
  };

  const onCompletedHandle = () => {

    return Promise.resolve(
      operationTypeSet(
        null
      )
    )
      .then(
        () => {

          return Promise.resolve(
            onCompleted()
          );
        }
      );
  };

  const operationSelectRender = () => {

    return (
      !operationType
    ) &&
      <OperationSelect
        onOperationSelect = {
          onOperationSelectHandle
        }
      />;
  };

  const operationCreateRender = () => {

    return (
      <OperationCreate
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
          onCompletedHandle
        }
      />
    );
  };

  const operationRemoveRender = () => {

    return (
      <OperationRemove
        dbLocal = {
          dbLocal
        }
        operationType = {
          operationType
        }
        onCompleted = {
          onCompletedHandle
        }
      />
    );
  };

  const operationSyncRender = () => {

    return (
      <OperationSync
        dbLocal = {
          dbLocal
        }
        dbRemote = {
          dbRemote
        }
        onCompleted = {
          onCompletedHandle
        }
      />
    );
  };

  const switchRender = () => {

    switch (
      operationType
    ) {

      case (
        '0'
      ) :

        return operationCreateRender();

      case (
        '1'
      ) :

        return operationRemoveRender();

      case (
        '2'
      ) :

        return operationSyncRender();

      default :

        return (
          null
        );
    }
  };

  return (
    <Box>
      {
        operationSelectRender()
      }
      {
        switchRender()
      }
    </Box>
  );
};

export default Viewer;
