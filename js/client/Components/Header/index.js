'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

import MovieSearch from 'Components/MovieSearch';

const Header = (
  props
) => {

  const movieSearchRender = () => {

    return (
      <MovieSearch
        viewer = {
          props.viewer
        }
        match = {
          props.match
        }
      />
    );
  };

  return (
    <div
      className = 'Header pt-3'
    >
      {
        movieSearchRender()
      }
    </div>
  );
};

export default createFragmentContainer(
  Header,
  {
    viewer: graphql`
      fragment Header_viewer on Viewer {
        ...MovieSearch_viewer
      }
    `
  }
);
