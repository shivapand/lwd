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

const videoRegExp = /(.+)\.mp4$/;

const VideoSelect = (
  {
    videosFolderPathString,
    sourceFolderPathString,
    onVideoSelect
  }
) => {

  const [
    videoNames,
    videoNamesSet
  ] = useState(
    null
  );

  const videoNamesFilteredGet = useCallback(
    (
      videoNames,
      sourceFolderNames
    ) => {

      return videoNames.reduce(
        (
          memo,
          videoName
        ) => {

          const match = videoName.match(
            videoRegExp 
          );

          const exists = sourceFolderNames.find(
            (
              sourceFolderName
            ) => {

              return (
                sourceFolderName ===
                match?.[
                  1
                ]
              );
            }
          );

          if (
            !exists
          ) {

            return [
              ...memo,
              videoName
            ];
          }

          return (
            memo
          );
        },
        []
      );
    },
    []
  );

  const videoNamesFetch = useCallback(
    () => {

      let videoNames = shelljs.ls(
        path.join(
          process.cwd(),
          videosFolderPathString
        )
      );

      const sourceFolderNames = shelljs.ls(
        path.join(
          process.cwd(),
          sourceFolderPathString
        )
      );

      videoNames = videoNamesFilteredGet(
        videoNames,
        sourceFolderNames
      );

      videoNames = videoNames.map(
        (
          videoName
        ) => {

          return {
            label: videoName,
            value: videoName
          };
        }
      );

      return Promise.resolve(
        videoNamesSet(
          videoNames
        )
      );
    },
    [
      videosFolderPathString,
      sourceFolderPathString,
      videoNamesFilteredGet
    ]
  );

  useEffect(
    () => {

      videoNamesFetch();
    },
    [
      videoNamesFetch
    ]
  );

  const onSelectHandle = (
    (
      {
        value
      } 
    ) => {

      const match = value.match(
        videoRegExp
      );

      return Promise.resolve(
        onVideoSelect(
          value,
          match?.[
            1
          ]
        )
      );
    }
  );

  const inkSelectInputRender = () => {

    return (
      !!videoNames?.length
    ) &&
      <InkSelectInput
        items = {
          videoNames
        }
        onSelect = {
          onSelectHandle
        }
      />;
  };

  const emptyRender = () => {

    return (
      !videoNames?.length
    ) &&
      <Text>
        no new video
      </Text>;
  };

  return (
    <Box
      flexDirection = 'column'
    >
      <Text>
        video select:
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

export default VideoSelect;
