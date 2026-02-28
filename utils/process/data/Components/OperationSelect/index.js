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
      label: 'create',
      value: '0'
    },
    {
      label: 'remove',
      value: '1'
    },
    {
      label: 'sync',
      value: '2'
    }
  ];

  const onSelectHandle = (
    {
      value
    }
  ) => {

    return onOperationSelect(
      value
    );
  };

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
