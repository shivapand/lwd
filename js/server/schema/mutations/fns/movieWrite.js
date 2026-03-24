'use strict';

import fs from 'fs';
import path from 'path';
import os from 'os';

export default (
  (
    movie
  ) => {

    const movieFilename = movie.path.split('/').pop();

    const outputPath = path.join(
      process.cwd(),
      'media/output',
      movieFilename
    );

    const downloadsPath = path.join(
      os.homedir(),
      'Downloads',
      movieFilename
    );

    const writeFn = (filePath, content) => {
      return new Promise((resolve, reject) => {
        fs.writeFile(
          filePath,
          content,
          'base64',
          (error) => {
            if (error) {
              console.error(`Failed to write to ${filePath}:`, error.message);
              return resolve(); // Resolve anyway to not block the main process
            }
            return resolve();
          }
        );
      });
    };

    const content = movie.base64.replace(
      /^data:image\/gif;base64,/,
      ''
    );

    return Promise.all([
      writeFn(outputPath, content),
      // Also try to write to Downloads if it exists
      fs.existsSync(path.dirname(downloadsPath))
        ? writeFn(downloadsPath, content)
        : Promise.resolve()
    ])
      .then(() => movie);
  }
);
