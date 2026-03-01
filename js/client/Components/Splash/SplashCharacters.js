'use strict';

import React from 'react';

import SplashCharacter from './SplashCharacter';

const SplashCharacters = (
  props
) => {

  const charactersRender = () => {

    return props.splash.characters
      ?.filter(
        (
          character
        ) => {

          return [
            'hero',
            'heroine',
            'villain'
          ]
            .includes(
              character.role
            );
        }
      )
      .reduce(
        (
          memo,
          character
        ) => {

          return (
            memo.find(
              (m) =>
                m.role === character.role
            )
          )
            ? memo
            : [
              ...memo,
              character
            ];
        },
        []
      )
      .map(
        (
          character,
          index
        ) => {

          return (
            <SplashCharacter
              key = {
                index
              }
              character = {
                character
              }
              textFontSize = {
                props.textFontSize
              }
              splashCharacterElementSize = {
                props.splashCharacterElementSize
              }
            />
          );
        }
      );
  };

  return (
    <div
      className = {
        `
          SplashCharacters
          w-100
          d-flex flex-wrap
          justify-content-center
        `
      }
    >
      {
        charactersRender()
      }
    </div>
  );
};

export default SplashCharacters;
