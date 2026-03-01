'use strict';

import React from 'react';
import {
  css
} from '@emotion/core';

const containerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '4px 0',
  minWidth: 0
});

const infoStyle = css({
  minWidth: 0,
  flex: 1
});

const titleStyle = css({
  fontWeight: 600,
  fontSize: '14px',
  color: '#eee',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const subtitleStyle = css({
  fontSize: '12px',
  color: '#999',
  marginTop: '2px'
});

const subtitlePartsGet = (
  result
) => {

  return [
    result.year,
    result.rating &&
      `\u2605 ${result.rating}`
  ]
    .filter(Boolean)
    .join(' \u00B7 ');
};

const MovieSearchResultItem = (
  {
    result
  }
) => {

  const subtitle = subtitlePartsGet(
    result
  );

  return (
    <div
      css = {
        containerStyle
      }
    >
      <div
        css = {
          infoStyle
        }
      >
        <div
          css = {
            titleStyle
          }
        >
          {
            result.title
          }
        </div>
        {
          subtitle &&
            (
              <div
                css = {
                  subtitleStyle
                }
              >
                {
                  subtitle
                }
              </div>
            )
        }
      </div>
    </div>
  );
};

export default MovieSearchResultItem;
