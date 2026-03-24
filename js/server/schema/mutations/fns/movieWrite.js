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
      console.log(`[MovieWrite] Attempting to write ${content.length} chars to ${filePath}...`);
      return new Promise((resolve, reject) => {
        fs.writeFile(
          filePath,
          content,
          'base64',
          (error) => {
            if (error) {
              console.error(`[MovieWrite] Failed to write to ${filePath}:`, error.message);
              return resolve(); 
            }
            console.log(`[MovieWrite] Successfully wrote ${filePath}`);
            return resolve();
          }
        );
      });
    };

    const content = movie.base64
      .replace(/^data:image\/gif;base64,/, '')
      .replace(/[\r\n\s]+/g, '');

    return Promise.all([
      writeFn(outputPath, content),
      // Also try to write to Downloads if it exists
      fs.existsSync(path.dirname(downloadsPath))
        ? writeFn(downloadsPath, content)
        : Promise.resolve().then(() => console.log(`[MovieWrite] Skipping Downloads folder: ${path.dirname(downloadsPath)} not found`))
    ])
      .then(() => movie);
  }
);
