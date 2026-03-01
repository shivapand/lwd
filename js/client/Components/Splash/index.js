'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

import SplashCharacters from './SplashCharacters';
import SplashSpoofInput from './SplashSpoofInput';

const Splash = (
  props
) => {

  const splashCharactersRender = () => {

    return (
      <div
        className = {
          `
            splashCharactersContainer
            w-100
            d-flex justify-content-center
            pt-2
          `
        }
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 1
            }
          )
        }
      >
        <SplashCharacters
          splash = {
            props.splash
          }
          viewer = {
            props.viewer
          }
          match = {
            props.match
          }
          textFontSize = {
            props.textFontSize
          }
          splashCharacterElementSize = {
            props.splashCharacterElementSize
          }
        />
      </div>
    );
  };

  const splashSpoofInputRender = () => {

    return (
      <SplashSpoofInput
        viewer = {
          props.viewer
        }
        match = {
          props.match
        }
        onSplashSpoofInputTrigger = {
          props.onSplashSpoofInputTrigger
        }
      />
    );
  };

  const titleRender = () => {

    return (
      <div
        className = 'titleContainer text-center text-white'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 1,
              left: 0,
              right: 0,
              bottom: 0,
              fontFamily: 'inherit',
              fontSize: props.textFontSize,
              minHeight: props.textElementMinHeight,
              padding: '0.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          )
        }
      >
        {
          splashSpoofInputRender()
        }
        <div
          className = {
            `
              d-inline-block
              rounded-circle
              border border-secondary
              text-white
              bg-dark
            `
          }
          css = {
            css(
              {
                width: '1.8rem',
                height: '1.8rem',
                lineHeight: '1.8rem',
                fontSize: '1.1rem',
                padding: 0,
                margin: '0.3rem 0'
              }
            )
          }
        >
          in
        </div>
        <div>
          {
            props.splash.title
          }
        </div>
      </div>
    );
  };

  return (
    <div
      className = 'Splash w-100 h-100 bg-dark'
    >
      <div>
        {
          splashCharactersRender()
        }
        {
          titleRender()
        }
      </div>
      <div
        className = 'w-100 h-100'
        css = {
          css(
            {
              position: 'relative',
              backgroundImage: `
                url("${
                  props.splash.poster ||
                  '/poster.jpeg'
                }")
              `
                .trim(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'grayscale()',
              opacity: 0.25
            }
          )
        }
      ></div>
    </div>
  );
};

export default createFragmentContainer(
  Splash,
  {
    splash: graphql`
      fragment Splash_splash on Splash {
        title,
        poster,
        ...SplashCharacters_splash
      }
    `,
    viewer: graphql`
      fragment Splash_viewer on Viewer {
        ...SplashCharacters_viewer,
        ...SplashSpoofInput_viewer
      }
    `
  }
);
