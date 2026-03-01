'use strict';

import React from 'react';
import {
  css
} from '@emotion/core';

const Loading = () => {

  return (
    <div
      className = {
        `
          Loading
          w-100 h-100
          d-flex
          justify-content-center align-items-center
        `
      }
    >
      <div
        className = 'spinner-border text-light'
        role = 'status'
        css = {
          css(
            {
              width: '3rem',
              height: '3rem'
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
    </div>
  );
};

export default Loading;
