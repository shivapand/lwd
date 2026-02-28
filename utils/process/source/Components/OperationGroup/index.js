'use strict';

import React,
{
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';

import FolderSelect from '../FolderSelect';
import group from '../../fns/group';

const OperationGroup = (
  {
    sourceFolderPathString,
    onCompleted
  }
) => {

  const [
    sourceFolderName,
    sourceFolderNameSet
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
    sourceFolderName
  ) => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return Promise.resolve(
            sourceFolderNameSet(
              sourceFolderName
            )
          );
        }
      )
      .then(
        () => {

          return group(
            sourceFolderName,
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

          return Promise.resolve(
            onCompleted()
          );
        }
      );
  };

  const folderSelectRender = () => {

    return (
      !sourceFolderName
    ) &&
      <FolderSelect
        sourceFolderPathString = {
          sourceFolderPathString
        }
        onFolderSelect = {
          onFolderSelectHandle
        }
      />;
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Box>
        <Text>
          running ...
        </Text>
      </Box>;
  };

  return (
    <Box>
      {
        folderSelectRender()
      }
      {
        loadingRender()
      }
    </Box>
  );
};

export default OperationGroup;
