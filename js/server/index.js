'use strict';

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';

import {
  titleGet,
  portGet,
  nodeEnvGet,
  mongoUriGet,
  outputResGet,
  hostUrlGet,
  fbAppIdGet
} from './fns/variable';
import mongoClientConnect from './fns/mongoClientConnect';
import mediaOutputFolderInit from
  './fns/mediaOutputFolderInit';
import deckTitleRouteHandle
  from './fns/deckTitleRouteHandle';
import outputGifRouteHandle
  from './fns/outputGifRouteHandle';
import searchRoute from './routes/search';
import deckRoute from './routes/deck';
import movieRoute from './routes/movie';

(
  async () => {

    await mediaOutputFolderInit();

    const db = await mongoClientConnect(
      mongoUriGet()
    );

    const port = portGet();

    return express()

      .set(
        'trust proxy',
        true
      )

      .set(
        'view engine',
        'ejs'
      )

      .use(
        express.json()
      )

      .get(
        '/favicon.ico',
        (req, res) => res.status(204).end()
      )

      .get(
        '/output/:gif.gif',
        (
          req,
          res,
          next
        ) => {

          return outputGifRouteHandle(
            db,
            req,
            res,
            next
          );
        }
      )

      .use(
        express.static(
          path.join(
            process.cwd(),
            'dist/client'
          )
        )
      )

      .use(
        express.static(
          path.join(
            process.cwd(),
            'media'
          )
        )
      )

      .get(
        '/api/search',
        (
          req,
          res
        ) => {

          return searchRoute(
            req,
            res
          );
        }
      )

      .get(
        '/api/deck/:deckTitle',
        (
          req,
          res
        ) => {

          return deckRoute(
            db,
            req,
            res
          );
        }
      )

      .post(
        '/api/movie',
        (
          req,
          res
        ) => {

          return movieRoute(
            db,
            req,
            res
          );
        }
      )

      .get(
        '/deck/:deckTitle',
        (
          req,
          res,
          next
        ) => {

          return deckTitleRouteHandle(
            db,
            req,
            res
          )
            .catch(
              () => {

                return next();
              }
            );
        }
      )

      .get(
        '*',
        (
          req,
          res
        ) => {

          return res.render(
            'index',
            {
              fbAppId: fbAppIdGet(),
              title: titleGet(),
              description: 'just messing ... :D',
              type: 'article',
              url: hostUrlGet(
                req
              ),
              image: {
                url: `
                  ${
                    hostUrlGet(
                      req
                    )
                  }/root.jpeg
                `
                  .trim(),
                type: 'image/jpeg',
                width: outputResGet(),
                height: outputResGet()
              }
            }
          );
        }
      )

      .listen(
        port,
        () => {

          // eslint-disable-next-line no-console
          console.log(
            `
              listening at http://localhost:${
                port
              } in ${
                nodeEnvGet()
              } mode
            `
              .trim()
          );

          return (
            null
          );
        }
      );
  }
)().catch(
  (error) => {
    // eslint-disable-next-line no-console
    console.error('Server startup failed:', error);
  }
);
