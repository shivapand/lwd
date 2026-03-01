'use strict';

import React from 'react';
import {
  render
} from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap';

import 'styles.scss';
import Layout from 'Components/Viewer';
import Home from 'Components/Home';
import DeckPage from 'Components/Deck/DeckPage';

render(
  <BrowserRouter>
    <Routes>
      <Route
        path = '/'
        element = {
          <Layout />
        }
      >
        <Route
          index
          element = {
            <Home />
          }
        />
        <Route
          path = 'deck/:deckTitle'
          element = {
            <DeckPage />
          }
        />
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById(
    'viewer'
  )
);
