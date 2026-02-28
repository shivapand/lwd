'use strict';

import React, 
{
  cloneElement
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';

const Deck = (
  props
) => {

  const childrenRender = () => {

    return (
      props.children
    ) &&
      cloneElement(
        props.children,
        {
          viewer: props.viewer,
          match: props.match
        }
      ); 
  };

  return (
    <div
      className = 'Deck h-100'
    >
      {
        childrenRender()
      }
    </div>
  );
};

export default createFragmentContainer(
  Deck,
  {
    viewer: graphql`
      fragment Deck_viewer on Viewer {
        ...DeckDetail_viewer
      }
    `
  }
);
