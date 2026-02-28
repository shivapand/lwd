'use strict';

import React, {
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';
import InkTextInput from 'ink-text-input';
import escapeStringRegexp from 'escape-string-regexp';

import download from '../../fns/download';

const OperationDownload = (
  {
    videosFolderPathString,
    onCompleted
  }
) => {

  const [
    link,
    linkSet
  ] = useState(
    null
  );

  const [
    error,
    errorSet
  ] = useState(
    null
  );

  const [
    downloading,
    downloadingSet
  ] = useState(
    null
  );

  const onChangeHandle = (
    link
  ) => {

    return Promise.resolve(
      linkSet(
        link.trim()
      )
    )
      .then(
        () => {

          return Promise.resolve(
            errorSet(
              null
            )
          );
        }
      );
  };

  const onSubmitHandle = () => {

    if (
      !link ||
      (
        !link.match(
          `
            ^(http|https)${
              escapeStringRegexp(
                '://www.youtube.com/watch?v='
              )
            }
          `
            .trim()
        )
      )
    ) {

      return Promise.resolve(
        errorSet(
          'invalid'
        )
      );
    }

    else if (
      downloading ||
      error
    ) {

      return Promise.resolve(
        null
      );
    }

    return Promise.resolve(
      downloadingSet(
        true
      )
    )
      .then(
        () => {
          return download(
            link,
            videosFolderPathString
          );
        }
      )
      .then(
        () => {

          return Promise.resolve(
            downloadingSet(
              false
            )
          );
        }
      )
      .then(
        () => {

          return onCompleted();
        }
      );
  };

  const inkTextInputRender = () => {

    return (
      <InkTextInput
        value = {
          link || ''
        }
        onChange = {
          onChangeHandle
        }
        onSubmit = {
          onSubmitHandle
        }
      />
    );
  };

  const errorRender = () => {

    return (
      <Box
        marginLeft = {1}
      >
        <Text
          color = 'red'
        >
          {
            error
          }
        </Text>
      </Box>
    );
  };

  const downloadingRender = () => {

    return (
      downloading
    ) &&
      <Text>
        downloading ...
      </Text>;
  };

  return (
    <Box
      flexDirection = 'column'
    >
      <Box>
        <Box
          marginRight = {1}
        >
          <Text>
            link:
          </Text>
        </Box>
        {
          inkTextInputRender()
        }
        {
          errorRender()
        }
      </Box>
      {
        downloadingRender()
      }
    </Box>
  );
};

export default OperationDownload;
