'use strict';

import React from 'react';
import {
  css
} from '@emotion/core';

const Loading = (props) => {

  return (
    <div
      className = {
        `
          Loading
          w-100 h-100
          d-flex flex-column
          justify-content-center align-items-center
        `
      }
    >
      <div
        className = 'spinner-border text-info mb-4'
        role = 'status'
        css = {
          css(
            {
              width: '4rem',
              height: '4rem',
              borderWidth: '0.25em',
              boxShadow: '0 0 20px rgba(23, 162, 184, 0.4)'
            }
          )
        }
      >
        <span
          className = 'sr-only'
        >
          Loading...
        </span>
      </div>
      {
        props.message && (
          <div
            className='text-white text-uppercase text-center px-4'
            css={css({
              fontSize: '0.8rem',
              letterSpacing: '0.4em',
              fontWeight: 300,
              opacity: 0.8,
              maxWidth: '400px',
              lineHeight: 1.6,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            })}
          >
            {props.message}
          </div>
        )
      }
    </div>
  );
};

export default Loading;
