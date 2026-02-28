'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

const MovieSearchResultItem = (
  props
) => {

  return (
    <div
      className = 'MovieSearchResultItem'
    >
      {
        props.resultTitle
      }
    </div>
  );
};

export default createFragmentContainer(
  MovieSearchResultItem,
  {
    viewer: graphql`
      fragment MovieSearchResultItem_viewer on Viewer {
        id
      }
    `
  }
);
