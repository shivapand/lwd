'use strict';

import React from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

const SplashCharacter = (
  props
) => {

  const filterGet = () => {

    switch (
      true
    ) {

      case (
        props.character.role !==
        'hero'
      ) :

        return (
          'grayscale(100%)'
        );

      case (
        props.character.role ===
        'hero'
      ) :

        return (
          'grayscale(50%)'
        );
    }
  };

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
              fontFamily: 'Muli',
              fontSize: `
                ${
                  parseInt(
                    props.textFontSize
                  ) /
                  1.5
                }rem
              `
                .trim()
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
                filterGet()
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

export default createFragmentContainer(
  SplashCharacter,
  {
    character: graphql`
      fragment SplashCharacter_character on Character {
        renderText,
        role,
        dualRoleIndex,
        image
      }
    `,
    viewer: graphql`
      fragment SplashCharacter_viewer on Viewer {
        id
      }
    `
  }
);
