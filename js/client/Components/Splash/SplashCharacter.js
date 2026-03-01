'use strict';

import React from 'react';
import {
  css
} from '@emotion/core';

const filterGet = (
  role
) => {

  switch (
    true
  ) {

    case (
      ['hero', 'villain', 'heroine'].includes(
        role
      )
    ) :

      return (
        'grayscale(50%)'
      );

    default :

      return (
        'grayscale(100%)'
      );
  }
};

const SplashCharacter = (
  props
) => {

  const textRender = () => {

    return (
      <p
        className = 'p-0 m-0 text-center text-light bg-dark'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 1,
              left: 0,
              right: 0,
              bottom: 0,
              fontFamily: 'inherit',
              fontSize: '1.1rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          )
        }
      >
        {
          props.character.renderText
        }
      </p>
    );
  };

  return (
    <div
      className = 'SplashCharacter m-1 rounded rounded-lg'
      css = {
        css(
          {
            position: 'relative',
            width: props.splashCharacterElementSize,
            height: props.splashCharacterElementSize,
            backgroundImage: `
              url("${
                props.character.image
              }")
            `
              .trim(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `
              ${
                filterGet(props.character.role)
              } brightness(1.25)
            `
              .trim()
          }
        )
      }
    >
      {
        textRender()
      }
    </div>
  );
};

export default SplashCharacter;
