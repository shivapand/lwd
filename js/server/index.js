'use strict';

import path from 'path';
import express from 'express';
import expressGraphql from 'express-graphql';

import {
  titleGet,
  portGet,
  nodeEnvGet,
  mongoUriGet,
  outputResGet,
  hostUrlGet,
  fbAppIdGet
} from './fns/variable';
import schema from './schema';
import mongoClientConnect from './fns/mongoClientConnect';
import mediaOutputFolderInit from 
  './fns/mediaOutputFolderInit';
import deckTitleRouteHandle 
  from './fns/deckTitleRouteHandle';
import outputGifRouteHandle 
  from './fns/outputGifRouteHandle';
import schemaUpdate from './fns/schemaUpdate';

(
  async () => {

    await mediaOutputFolderInit();

    const db = await mongoClientConnect(
      mongoUriGet()
    );

    await schemaUpdate();

    const port = portGet();

    const app = express();

    app.set('trust proxy', true);
    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'ejs');

    return app

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

      .use(
        '/graphql',
        async (
          req,
          res
        ) => {

          try {
            return expressGraphql(
              {
                schema,
                pretty: true,
                context: {
                  db,
                  req
                }
              }
            )(
              req,
              res
            );
          } catch (error) {
            console.error('GraphQL Error:', error);
            res.status(500).send(error.message);
          }
        }
      )

      .get(
        '/deck/:deckTitle',
        async (
          req,
          res
        ) => {

          try {
            await deckTitleRouteHandle(
              db,
              req,
              res
            );
          } catch (error) {
            console.error('Route Error:', error);
            res.status(500).send(`Route Error: ${error.message}`);
          }
        }
      )

      .get(
        '*',
        (
          req,
          res
        ) => {

          try {
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
          } catch (error) {
            console.error('Catch-all Error:', error);
            res.status(500).send(`Catch-all Error: ${error.message}`);
          }
        }
      )

      .use((err, req, res, next) => {
        console.error('Unhandled Error:', err);
        res.status(500).send(`Unhandled Error: ${err.message}`);
      })

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
)();
