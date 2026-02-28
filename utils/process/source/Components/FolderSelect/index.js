'use strict';

import path from 'path';
import React, 
{
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

const FolderSelect = (
  {
    sourceFolderPathString,
    onFolderSelect
  }
) => {

  const [
    folderNames,
    folderNamesSet
  ] = useState(
    null
  );

  const folderNamesFilteredGet = useCallback(
    (
      folderNames
    ) => {

      return folderNames.reduce(
        (
          memo,
          folderName
        ) => {

          const files = shelljs.ls(
            path.join(
              process.cwd(),
              sourceFolderPathString,
              folderName
            )
          );

          const stale = files.find(
            (
              file
            ) => {

              return (
                file.match(
                  /^(hero|heroine|villain|man|woman|discard)/
                )
              );
            }
          );

          if (
            !stale
          ) {

            return [
              ...memo,
              folderName
            ];
          }

          return (
            memo
          );
        },
        []
      );
    },
    [
      sourceFolderPathString
    ]
  );

  const folderNamesFetch = useCallback(
    () => {

      if (
        folderNames
      ) {

        return Promise.resolve(
          null
        );
      }

      let folderNames = shelljs.ls(
        path.join(
          process.cwd(),
          sourceFolderPathString
        )
      );

      folderNames = folderNamesFilteredGet(
        folderNames
      );

      folderNames = folderNames.map(
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
      sourceFolderPathString,
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
    (
      {
        value
      } 
    ) => {

      return Promise.resolve(
        onFolderSelect(
          value
        )
      );
    }
  );

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

  return (
    <Box
      flexDirection = 'column'
    >
      <Text>
        folder select:
      </Text>
      {
        inkSelectInputRender()
      }
    </Box>
  );
};

export default FolderSelect;
