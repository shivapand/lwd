'use strict';

import React,
{
  useState
} from 'react';
import {
  Box
} from 'ink';

import OperationSelect from '../OperationSelect';
import OperationDownload from '../OperationDownload';
import OperationGrab from '../OperationGrab';
import OperationGroup from '../OperationGroup';

const Viewer = (
  {
    videosFolderPathString,
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

  const operationDownloadRender = () => {

    return (
      <OperationDownload
        videosFolderPathString = {
          videosFolderPathString
        }
        onCompleted = {
          onCompletedHandle
        }
      />
    );
  };

  const operationGrabRender = () => {

    return (
      <OperationGrab
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

  const operationGroupRender = () => {

    return (
      <OperationGroup
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

        return operationDownloadRender();

      case (
        '1'
      ) :

        return operationGrabRender();

      case (
        '2'
      ) :

        return operationGroupRender();
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
