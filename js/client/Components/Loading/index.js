'use strict';

import React from 'react';

const Loading = () => {

  const iconRender = () => {

    return (
      <div>
        <i
          className = 
            'fa fa-spinner fa-lg fa-spin text-white'
        ></i>
      </div>
    );
  };

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
      {
        iconRender()
      }
    </div>
  );
};

export default Loading;
