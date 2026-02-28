'use strict';

import path from 'path';
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
import shelljs from 'shelljs';

import {
  setsFind
} from '~/js/server/data/set';

const FolderSelect = (
  {
    dbLocal,
    sourceFolderPathString,
    operationType,
    onFolderSelect
  }
) => {

  const [
    folderNames,
    folderNamesSet
  ] = useState(
    null
  );

  const setExistsGet = (
    folderName,
    sets
  ) => {

    return sets.find(
      (
        {
          text
        }
      ) => {

        return (
          text ===
          folderName
        );
      }
    );
  };

  const folderNamesFilteredGet = useCallback(
    (
      _folderNames,
      sets,
      operationType
    ) => {

      switch (
        operationType
      ) {

        case (
          '0'
        ) :

          return _folderNames.reduce(
            (
              memo,
              _folderName
            ) => {

              const exists = setExistsGet(
                _folderName,
                sets
              );

              if (
                !exists
              ) {

                return [
                  ...memo,
                  _folderName
                ];
              }

              return (
                memo
              );
            },
            []
          );
      }
    },
    []
  );

  const folderNamesFetch = useCallback(
    async () => {

      if (
        folderNames
      ) {

        return (
          null
        );
      }

      const _folderNames = shelljs.ls(
        path.join(
          process.cwd(),
          sourceFolderPathString
        )
      );

      const sets = await setsFind(
        undefined,
        undefined,
        dbLocal
      );

      const folderNames = folderNamesFilteredGet(
        _folderNames,
        sets,
        operationType
      )
        .map(
          (
            folderName
          ) => {

            return {
              label: folderName,
              value: folderName
            };
          }
        );

      return Promise.resolve(
        folderNamesSet(
          folderNames
        )
      );
    },
    [
      dbLocal,
      sourceFolderPathString,
      operationType,
      folderNamesFilteredGet
    ]
  );

  useEffect(
    () => {

      folderNamesFetch();
    },
    [
      folderNamesFetch
    ]
  );

  const onSelectHandle = (
    {
      value
    }
  ) => {

    return onFolderSelect(
      value
    );
  };

  const inkSelectInputRender = () => {

    return (
      !!folderNames?.length
    ) &&
      <InkSelectInput
        items = {
          folderNames
        }
        onSelect = {
          onSelectHandle
        }
      />;
  };

  const emptyRender = () => {

    return (
      !folderNames?.length
    ) &&
      <Text>
        no new source
      </Text>;
  };

  return (
    <Box
      flexDirection = 'column'
    >
      <Text>
        select a folder:
      </Text>
      {
        inkSelectInputRender()
      }
      {
        emptyRender()
      }
    </Box>
  );
};

export default FolderSelect;
