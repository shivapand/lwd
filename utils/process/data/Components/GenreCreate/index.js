'use strict';

import React, {
  useState
} from 'react';
import {
  Box,
  Text
} from 'ink';
import InkTextInput from 'ink-text-input';

import genreCreate from '../../fns/genreCreate';

const GenreCreate = (
  {
    dbLocal,
    onCompleted
  }
) => {

  const [
    genreText,
    genreTextSet
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
    loading,
    loadingSet
  ] = useState(
    false
  );

  const onChangeHandle = (
    genreText
  ) => {

    return Promise.resolve(
      genreTextSet(
        genreText
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

  const onSubmitHandle = async () => {

    return Promise.resolve(
      loadingSet(
        true
      )
    )
      .then(
        () => {

          return genreCreate(
            genreText,
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

          return Promise.resolve(
            onCompleted()
          );
        }
      )
      .catch(
        (
          error
        ) => {

          return Promise.resolve(
            errorSet(
              error
            )
          );
        }
      );
  };

  const inkTextInputRender = () => {

    return (
      <InkTextInput
        value = {
          genreText || ''
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

  const loadingRender = () => {

    return (
      loading
    ) &&
      <Text>
        running ...
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
            genre name:
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
        loadingRender()
      }
    </Box>
  );
};

export default GenreCreate;
