'use strict';

import React from 'react';

import MovieSearch from 'Components/MovieSearch';

const Header = () => {

  const movieSearchRender = () => {

    return (
      <MovieSearch />
    );
  };

  return (
    <div
      className = 'Header pt-3'
    >
      {
        movieSearchRender()
      }
    </div>
  );
};

export default Header;
