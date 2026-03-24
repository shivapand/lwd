'use strict';

import React from 'react';
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
              marginBottom: 10
            }
          )
        }
      >
        <SplashCharacters
          splash = {
            props.splash
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
        onSplashSpoofInputTrigger = {
          props.onSplashSpoofInputTrigger
        }
        onFocus = {
          props.onFocus
        }
        onBlur = {
          props.onBlur
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
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              borderRadius: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'inherit',
              padding: '2rem 1.5rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }
          )
        }
      >
        <div
          css = {
            css(
              {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
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
                border border-info
                text-info
                font-weight-bold
              `
            }
            css = {
              css(
                {
                  width: '2.2rem',
                  height: '2.2rem',
                  lineHeight: '2rem',
                  fontSize: '0.9rem',
                  padding: 0,
                  margin: '1rem 0',
                  backgroundColor: 'rgba(23, 162, 184, 0.1)',
                  boxShadow: '0 0 15px rgba(23, 162, 184, 0.3)',
                  borderWidth: '2px !important'
                }
              )
            }
          >
            in
          </div>

          <div
            css = {
              css(
                {
                  fontSize: props.textFontSize,
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  textShadow: '0 10px 20px rgba(0, 0, 0, 0.4)',
                  textTransform: 'uppercase',
                  lineHeight: 1.1
                }
              )
            }
          >
            {
              props.splash.title
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className = 'Splash w-100 h-100 bg-dark overflow-hidden'
      css = {
        css(
          {
            position: 'relative'
          }
        )
      }
    >
      <div
        css = {
          css(
            {
              position: 'absolute',
              zIndex: 2,
              left: 0,
              right: 0,
              bottom: '10%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0 2rem'
            }
          )
        }
      >
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
              filter: 'grayscale(100%) brightness(0.4)',
              transform: 'scale(1.05)',
              transition: 'filter 1s ease, transform 1s ease'
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
                background: 'radial-gradient(circle at center, transparent 0%, rgba(7, 13, 31, 0.8) 100%)'
              }
            )
          }
        />
      </div>
    </div>
  );
};

export default Splash;
