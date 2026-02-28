'use strict';

import React, {
  useState,
  useCallback
} from 'react';
import {
  Box,
  Text,
  useInput
} from 'ink';

const InkConfirmInput = (
  {
    isChecked,
    placeholder,
    onChange
  }
) => {

  const [
    value,
    valueSet
  ] = useState(
    isChecked
  );

  const [
    completed,
    completedSet
  ] = useState(
    false
  );

  const promptString = (
    isChecked
  ) ?
    'Y/n' :
    'y/N';

  const completedString = (
    value
  ) ?
    'Yes' :
    'No';

  const onInputHandle = useCallback(
    (
      input
    ) => {

      return Promise.resolve(
        valueSet(
          input
        )
      )
        .then(
          () => {

            return Promise.resolve(
              completedSet(
                true
              )
            );
          }
        )
        .then(
          () => {

            return Promise.resolve(
              onChange(
                input
              )
            );
          }
        );
    },
    [
      onChange
    ]
  );

  useInput(
    (
      input,
      key
    ) => {

      switch (
        true
      ) {

        case (
          !!key.return
        ) :

          return onInputHandle(
            isChecked
          );

        case (
          input ===
          'y'
        ) :

          return onInputHandle(
            true
          );

        case (
          input ===
          'n'
        ) :

          return onInputHandle(
            false
          );
      }
    }
  );

  return (
    <Box>
      <Box
        marginRight = {1}
      >
        <Text>
          {
            placeholder
          }
        </Text>
      </Box>

      <Text
        color = {
          (
            !completed
          ) ?
            'grey' :
            'black'
        }
      >
        {
          (
            !completed
          ) ?
            promptString :
            completedString
        }
      </Text>
    </Box>
  );
};

export default InkConfirmInput;
