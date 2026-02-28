'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

const Home = () => {

  return (
    <div
      className = 'Home'
    >
      Home
    </div>
  );
};

export default createFragmentContainer(
  Home,
  {
    viewer: graphql`
      fragment Home_viewer on Viewer {
        id
      }
    `
  }
);
