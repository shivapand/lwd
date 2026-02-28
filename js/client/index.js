'use strict';

import React from 'react';
import {
  render
} from 'react-dom';
import {
  RecordSource,
  Store,
  Network,
  Environment
} from 'relay-runtime';
import {
  graphql
} from 'react-relay';
import {
  makeRouteConfig,
  Route,
  createFarceRouter,
  createRender
} from 'found';
import {
  BrowserProtocol,
  queryMiddleware
} from 'farce';
import {
  Resolver
} from 'found-relay';
import {
  ScrollManager
} from 'found-scroll';
import 'bootstrap/dist/js/bootstrap';

import 'styles.scss';
import Viewer from 'Components/Viewer';
import Home from 'Components/Home';
import Deck from 'Components/Deck';
import DeckDetail from 'Components/Deck/DeckDetail';
import DeckNode from 'Components/Deck/DeckNode';

const query = graphql`
  query clientQuery {
    viewer {
      ...Viewer_viewer
    }
  }
`;

const routeConfig = makeRouteConfig(
  <Route
    path = '/'
    Component = {
      Viewer
    }
    query = {
      query
    }
  >
    <Route
      Component = {
        Home
      }
    />

    <Route
      path = 'Deck'
      Component = {
        Deck
      }
    >
      <Route
        path = ':deckTitle'
        Component = {
          DeckDetail
        }
      >
        <Route
          Component = {
            DeckNode
          }
        />
      </Route>
    </Route>
  </Route>
);

const recordSource = new RecordSource();

const store = new Store(
  recordSource
);

const fetchQuery = (
  operation,
  variables
) => {

  return fetch(
    '/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          query: operation.text,
          variables
        }
      )
    }
  )
    .then(
      (
        res
      ) => {

        return res.json();
      }
    )
    .then(
      (
        json
      ) => {

        return (
          json.errors
        ) ?
          Promise.reject(
            json
          ) :
          Promise.resolve(
            json
          );
      }
    );
};

const network = Network.create(
  fetchQuery
);

const environment = new Environment(
  {
    store,
    network
  }
);

const Router = createFarceRouter(
  {
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [
      queryMiddleware
    ],
    routeConfig,
    render(
      renderArgs
    ) {

      return (
        <ScrollManager
          renderArgs = {
            renderArgs
          }
        >
          {
            createRender(
              {}
            )(
              renderArgs
            )
          }
        </ScrollManager>
      );
    }
  }
);

render(
  <Router
    resolver = {
      new Resolver(
        environment
      )
    }
  />,
  document.getElementById(
    'viewer'
  )
);
