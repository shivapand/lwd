'use strict';

import React from 'react';
import {
  render
} from 'ink';

import mongoClientConnectFn from 
  '~/js/server/fns/mongoClientConnect';
import {
  mongoLocalUriGet,
  mongoRemoteUriGet
} from '~/js/server/fns/variable';
import Viewer from './Components/Viewer';

const mongoClientConnectLocal = () => {

  return mongoClientConnectFn(
    mongoLocalUriGet()
  );
};

const mongoClientConnectRemote = () => {

  return mongoClientConnectFn(
    mongoRemoteUriGet()
  );
};

const processFolderPathString = 'temp/process';

const videoFolderName = 'videos';

const sourceFolderName = 'source';

const videosFolderPathString = `
  ${
    processFolderPathString
  }/${
    videoFolderName
  }
`
  .trim();

const sourceFolderPathString = `
  ${
    processFolderPathString
  }/${
    sourceFolderName
  }
`
  .trim();

(
  async() => {

    const dbLocal = await mongoClientConnectLocal();

    const dbRemote = await mongoClientConnectRemote();

    render(
      <Viewer
        dbLocal = {
          dbLocal
        }
        dbRemote = {
          dbRemote
        }
        videosFolderPathString = {
          videosFolderPathString
        }
        sourceFolderPathString = {
          sourceFolderPathString
        }
      />
    );
  }
)();
