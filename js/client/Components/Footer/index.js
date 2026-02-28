'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

import Share from 'Components/Share';

const Footer = (
  props
) => {

  const contactRender = () => {

    return (
      <div
        className = 'contact p-2 text-secondary'
      >
        pyratin@gmail.com
      </div>
    );
  };

  const shareRender = () => {

    return (
      <div
        className = 'shareContainer ml-auto text-secondary'
      >
        <Share
          viewer = {
            props.viewer
          }
          match = {
            props.match
          }
        />
      </div>
    );
  };

  return (
    <div
      className = {
        `
          Footer 
          d-flex
          align-items-center
        `
      }
    >
      {
        contactRender()
      }
      {
        shareRender()
      }
    </div>
  );
};

export default createFragmentContainer(
  Footer,
  {
    viewer: graphql`
      fragment Footer_viewer on Viewer {
        ...Share_viewer
      }
    `
  }
);
