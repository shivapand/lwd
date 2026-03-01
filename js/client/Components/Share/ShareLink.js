'use strict';

import React from 'react';
import {
  css
} from '@emotion/core';
import copyToClipboard from 'copy-to-clipboard';

const ShareLink = (
  props
) => {

  const onClickHandle = (
    event
  ) => {

    event.preventDefault();
    event.stopPropagation();

    const link = window.location.href;

    return Promise.resolve(
      copyToClipboard(
        link
      )
    )
      .then(
        () => {

          return props.onShareCompleted();
        }
      );
  };

  return (
    <button
      className = 'btn btn-secondary rounded-0'
      css = {
        css(
          {
            boxShadow: 'none !important',
            outline: 'none !important'
          }
        )
      }
      onClick = {
        onClickHandle
      }
    >
      <i className = 'fa fa-link'></i>
    </button>
  );
};

export default ShareLink;
