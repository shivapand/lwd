'use strict';

import fs from 'fs';
import path from 'path';

export default () => {

  const paths = [
    'media/output',
    'media/poster'
  ];

  const createFolder = (folderPath) => {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(process.cwd(), folderPath);
      if (!fs.existsSync(fullPath)) {
        return fs.mkdir(fullPath, { recursive: true }, (error) => {
          if (error) return reject(error);
          return resolve();
        });
      }
      return resolve();
    });
  };

  return Promise.all(paths.map(createFolder));
};
