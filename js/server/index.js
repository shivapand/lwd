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

    return express()

      .set(
        'view engine',
        'ejs'
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
        }
      )

      .get(
        '/deck/:deckTitle',
        (
          req,
          res
        ) => {

          return deckTitleRouteHandle(
            db,
            req,
            res
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
)();
