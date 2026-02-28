'use strict';

import React,
{
  useState
} from 'react';
import {
  Box
} from 'ink';

import OperationSelect from '../OperationSelect';
import OperationSource from 
  '../../source/Components/Viewer';
import OperationData from 
  '../../data/Components/Viewer';

const Viewer = (
  {
    dbLocal,
    dbRemote,
    videosFolderPathString,
    sourceFolderPathString
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

  const operationSourceRender = () => {

    return (
      <OperationSource
        videosFolderPathString = {
          videosFolderPathString
        }
        sourceFolderPathString = {
          sourceFolderPathString
        }
        onCompleted = {
          onCompletedHandle
        }
      />
    );
  };

  const operationDataRender = () => {

    return (
      <OperationData
        dbLocal = {
          dbLocal
        }
        dbRemote = {
          dbRemote
        }
        sourceFolderPathString = {
          sourceFolderPathString
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

        return operationSourceRender();

      case (
        '1'
      ) :

        return operationDataRender();
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
