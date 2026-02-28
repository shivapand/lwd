'use strict';

import React, 
{
  cloneElement,
  useEffect,
  useCallback
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

import Header from 'Components/Header';
import Footer from 'Components/Footer';

const Viewer = (
  props
) => {

  const maxWidth = 768;

  const init = useCallback(
    () => {

      if (
        !props.match.location.pathname
          .match(
            /^\/$/
          )
      ) {

        return (
          null
        );
      }

      return props.match.router
        .push(
          `
            /Deck/${
              props.viewer.deckTitle
            }?genre=${
              process.env.GENRE
            }&hero=${
              process.env.HERO
            }
          `
            .trim()
        );
    },
    [
      props.match.location.pathname,
      props.match.router,
      props.viewer.deckTitle
    ]
  );

  useEffect(
    () => {

      init();
    },
    [
      init
    ]
  );

  const headerRender = () => {

    return (
      <div
        className = {
          `
            headerContainer 
            w-100 
            d-flex 
            justify-content-center
          `
        }
      >
        <div
          className = 'headerContainerInner w-100'
          css = {
            css(
              {
                maxWidth
              }
            )
          }
        >
          <Header
            viewer = {
              props.viewer
            }
            match = {
              props.match
            }
          />
        </div>
      </div>
    );
  };

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

  const contentRender = () => {

    return (
      <div
        className = {
          `
            contentContainer 
            flex-fill
            d-flex
            justify-content-center
          `
        }
      >
        <div
          className = 'content w-100'
          css = {
            css(
              {
                maxWidth
              }
            )
          }
        >
          {
            childrenRender()
          }
        </div>
      </div>
    );
  };

  const footerRender = () => {

    return (
      <Footer
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
      className = 'Viewer d-flex flex-column'
      css = {
        css(
          {
            height: '100vh'
          }
        )
      }
    >
      {
        headerRender()
      }
      {
        contentRender()
      }
      {
        footerRender()
      }
    </div>
  );
};

export default createFragmentContainer(
  Viewer,
  {
    viewer: graphql`
      fragment Viewer_viewer on Viewer {
        id,
        deckTitle,
        ...Header_viewer,
        ...Home_viewer,
        ...Deck_viewer,
        ...Footer_viewer
      }
    `
  }
);
