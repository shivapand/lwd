'use strict';

import React from 'react';

import Share from 'Components/Share';

const Footer = () => {

  const contactRender = () => {

    return (
      <div
        className = 'contact p-2 text-secondary'
      >
        pyratin@gmail.com
      </div>
    );
  };

  const shareRender = () => {

    return (
      <div
        className = 'shareContainer ml-auto text-secondary'
      >
        <Share />
      </div>
    );
  };

  return (
    <div
      className = {
        `
          Footer
          d-flex
          align-items-center
        `
      }
    >
      {
        contactRender()
      }
      {
        shareRender()
      }
    </div>
  );
};

export default Footer;
