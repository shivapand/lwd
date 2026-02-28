'use strict';

import path from 'path';
import fs from 'fs';
import ytdlCore from 'ytdl-core';

export default async (
  link,
  videosFolderPathString
) => {

  const title = (
    await ytdlCore.getInfo(
      link,
    )
  )?.videoDetails
    .title; 

  const filePath = path.join(
    process.cwd(),
    videosFolderPathString,
    `
      ${
        title
      }.mp4
    `
      .trim()
  );

  return new Promise(
    (
      resolve
    ) => {

      return ytdlCore(
        link,
        {
          quality: 'highest'
        }
      )
        .pipe(
          fs.createWriteStream(
            filePath
          )
        )
        .on(
          'close',
          () => {

            return resolve(
              null
            );
          }
        );
    }
  );
};
