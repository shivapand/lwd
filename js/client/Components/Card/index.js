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
        className = 'p-3 m-0 text-center text-white'
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              bottom: 0,
              minHeight: props.textElementMinHeight,
              fontFamily: 'inherit',
              fontSize: props.textFontSize,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 70%, transparent 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
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
            bg-dark
          `
        }
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 3,
              top: 0,
              left: 0
            }
          )
        }
      >
        <Loading />
      </div>;
  };

  return (
    <div
      className = 'Card w-100 h-100 overflow-hidden'
      css = {
        css(
          {
            position: 'relative',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
            '&:hover': {
              transform: 'scale(1.01)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          }
        )
      }
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
              filter: filterGet(props.card),
              transition: 'filter 0.5s ease'
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
