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
        className = 'px-2 py-1 m-0 text-center text-white'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              bottom: 0,
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 80%, transparent 100%)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
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
      className = 'SplashCharacter m-2 overflow-hidden'
      css = {
        css(
          {
            position: 'relative',
            width: props.splashCharacterElementSize,
            height: props.splashCharacterElementSize,
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
              } brightness(1.1)
            `
              .trim(),
            transition: 'transform 0.3s ease, border-color 0.3s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05) translateY(-4px)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              filter: 'grayscale(0%) brightness(1.2)'
            }
          }
        )
      }
    >
      <div 
        css = {
          css(
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)',
              pointerEvents: 'none'
            }
          )
        }
      />
      {
        textRender()
      }
    </div>
  );
};

export default SplashCharacter;
