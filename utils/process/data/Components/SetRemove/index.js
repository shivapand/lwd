'use strict';

import React, {
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';

import SetSelect from '../SetSelect';
import setRemove from '../../fns/setRemove';

const SetRemove = (
  {
    dbLocal,
    onCompleted
  }
) => {

  const [
    setId,
    setIdSet
  ] = useState(
    null
  );

  const [
    loading,
    loadingSet
  ] = useState(
    false
  );

  const onSelectHandle = (
    setId
  ) => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return Promise.resolve(
            setIdSet(
              setId
            )
          );
        }
      )
      .then(
        () => {

          return setRemove(
            setId,
            dbLocal
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

          return onCompleted();
        }
      );
  };

  const setSelectRender= () => {

    return (
      !setId
    ) &&
      <SetSelect
        dbLocal = {
          dbLocal
        }
        onSetSelect = {
          onSelectHandle
        }
      />;
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Text>
        running ...
      </Text>;
  };

  return (
    <Box>
      {
        setSelectRender()
      }
      {
        loadingRender()
      }
    </Box>
  );
};

export default SetRemove;
