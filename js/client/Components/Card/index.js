'use strict';

import React,
{
  useState,
  useEffect
} from 'react';
import {
  css
} from '@emotion/core';

import Loading from 'Components/Loading';

const filterGet = (
  card
) => {

  switch (
    true
  ) {

    case (
      !['hero', 'villain', 'heroine'].includes(
        card.character?.role
      )
    ) :

      return (
        'grayscale(100%)'
      );
  }
};

const Card = (
  props
) => {

  const imageUrl = props.card.image ||
    '/placeholder.png';

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

  const textRender = () => {

    return (
      <p
        className = 'p-1 m-0 text-center text-white'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 1,
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: props.textElementMinHeight,
              fontFamily: 'inherit',
              fontSize: props.textFontSize,
              backgroundColor: 'rgba(0, 0, 0, 0.8)'
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
        <Loading />
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
              filter: filterGet(props.card)
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

export default Card;
