'use strict';

import React,
{
  useState,
  useEffect
} from 'react';
import {
  createFragmentContainer,
  graphql
} from 'react-relay';
import {
  css
} from '@emotion/core';

import Loading from 'Components/Loading';

const Card  = (
  props
) => {

  const imageUrl = props.card.image ||
    '/placeholder.jpeg';

  const [
    loading,
    loadingSet
  ] = useState(
    true
  );

  const onImageLoadHandle = () => {

    return loadingSet(
      false
    );
  };

  useEffect(
    () => {

      const image = new Image();

      image.addEventListener(
        'load',
        onImageLoadHandle
      );

      image.src = imageUrl;

      return () => {

        image.removeEventListener(
          'load',
          onImageLoadHandle
        );
      };
    },
    [
      imageUrl
    ]
  );

  const filterGet = () => {

    switch (
      true
    ) {

      case (
        props.card.character?.role !==
        'hero'
      ) :

        return (
          'grayscale(100%)'
        );

      case (
        props.card.dualRoleIndex >=
        0
      ) :

        return (
          'hue-rotate(20deg)'
        );
    }
  };

  const textRender = () => {

    return (
      <p
        className = 'p-1 m-0 text-center text-white bg-dark'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 1,
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: props.textElementMinHeight,
              fontFamily: 'Muli',
              fontSize: props.textFontSize
            }
          )
        }
        dangerouslySetInnerHTML = {{
          __html: props.card.renderText
        }}
      ></p>
    );
  };

  const loadingRender = () => {

    return (
      loading
    ) &&
      <div
        className = {
          `
            w-100 h-100
            d-flex
            justify-content-center
            align-items-center
          `
        }
      >
        <Loading/>
      </div>;
  };

  return (
    <div
      className = 'Card w-100 h-100'
    >
      <div>
        {
          textRender()
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
                  imageUrl
                }")
              `
                .trim(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: filterGet()
            }
          )
        }
      >
        {
          loadingRender()
        }
      </div>
    </div>
  );
};

export default createFragmentContainer(
  Card,
  {
    card: graphql`
      fragment Card_card on Card {
        image,
        renderText,
        character {
          role
        },
        actorImageId,
        dualRoleIndex
      }
    `,
    viewer: graphql`
      fragment Card_viewer on Viewer {
        id
      }
    `
  }
);
