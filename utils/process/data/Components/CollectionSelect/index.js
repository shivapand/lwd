'use strict';

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

import {
  listCollections
} from '~/js/server/data';

const CollectionSelect = (
  {
    dbLocal,
    onCollectionSelect
  }
) => {

  const collectionsShow = [
    'genres',
    'sets'
  ];

  const [
    collections,
    collectionsSet
  ] = useState(
    null
  );

  const collectionsFetch = useCallback(
    () => {

      if (
        collections
      ) {

        return (
          null
        );
      }

      return listCollections(
        undefined,
        undefined,
        dbLocal
      )
        .then(
          (
            res
          ) => {

            const collections = collectionsShow.reduce(
              (
                memo,
                _collectionsShow
              ) => {

                const collectionName = res.find(
                  (
                    {
                      name
                    }
                  ) => {

                    return (
                      name ===
                      _collectionsShow
                    );
                  }
                )?.name;

                if (
                  collectionName
                ) {

                  return [
                    ...memo,
                    {
                      label: collectionName,
                      value: collectionName
                    }
                  ];
                }

                return (
                  memo
                );
              },
              []
            );

            return Promise.resolve(
              collectionsSet(
                collections
              )
            );
          }
        );
    },
    [
      collections,
      dbLocal,
      collectionsShow
    ]
  );

  useEffect(
    () => {

      collectionsFetch();
    },
    [
      collectionsFetch
    ]
  );

  const onSelectHandle = (
    {
      value
    }
  ) => {

    return onCollectionSelect(
      value
    );
  };

  const inkSelectInputRender = () => {

    return (
      collections
    ) &&
      <InkSelectInput
        items = {
          collections
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
        collection select:
      </Text>

      {
        inkSelectInputRender()
      }
    </Box>
  );
};

export default CollectionSelect;
