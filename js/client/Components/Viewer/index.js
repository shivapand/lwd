'use strict';

import React from 'react';
import {
  Outlet
} from 'react-router-dom';
import {
  css
} from '@emotion/core';

import Header from 'Components/Header';
import Footer from 'Components/Footer';

const maxWidth = 768;

const Layout = () => {

  const headerRender = () => {

    return (
      <div
        className = {
          `
            headerContainer
            w-100
            d-flex
            justify-content-center
          `
        }
      >
        <div
          className = 'headerContainerInner w-100'
          css = {
            css(
              {
                maxWidth
              }
            )
          }
        >
          <Header />
        </div>
      </div>
    );
  };

  const contentRender = () => {

    return (
      <div
        className = {
          `
            contentContainer
            flex-fill
            d-flex
            justify-content-center
          `
        }
      >
        <div
          className = 'content w-100'
          css = {
            css(
              {
                maxWidth
              }
            )
          }
        >
          <Outlet />
        </div>
      </div>
    );
  };

  const footerRender = () => {

    return (
      <Footer />
    );
  };

  return (
    <div
      className = 'Viewer d-flex flex-column'
      css = {
        css(
          {
            height: '100vh'
          }
        )
      }
    >
      {
        headerRender()
      }
      {
        contentRender()
      }
      {
        footerRender()
      }
    </div>
  );
};

export default Layout;
