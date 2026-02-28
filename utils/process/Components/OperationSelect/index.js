'use strict';

import React from 'react';
import {
  Box,
  Text
} from 'ink';
import InkSelectInput from 'ink-select-input';

const OperationSelect = (
  {
    onOperationSelect
  }
) => {

  const operationTypes = [
    {
      label: 'source',
      value: '0'
    },
    {
      label: 'data',
      value: '1'
    }
  ];

  const onSelectHandle = (
    (
      {
        value
      }
    ) => {

      return onOperationSelect(
        value
      );
    }
  );

  const inkSelectInputRender = () => {

    return (
      <InkSelectInput
        items = {
          operationTypes
        }
        onSelect = {
          onSelectHandle
        }
      />
    );
  };

  return (
    <Box
      flexDirection = 'column'
    >
      <Text>
        operation select:
      </Text>
      {
        inkSelectInputRender()
      }
    </Box>
  );
};

export default OperationSelect;
