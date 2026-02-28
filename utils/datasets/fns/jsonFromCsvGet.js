'use strict';

import path from 'path';
import fs from 'fs';
import csvtojson from 'csvtojson/v2';
import shelljs from 'shelljs';

const jsonFolderCreate = (
  datasetsFolderPathString
) => {

  const datasetsFolderPath = path.join(
    process.cwd(),
    datasetsFolderPathString
  );

  const jsonFolderName = 'json';

  if (
    !shelljs.ls(datasetsFolderPath)
      .includes(
        jsonFolderName
      )
  ) {

    return shelljs.mkdir(
      path.join(
        datasetsFolderPath,
        'json'
      )
    );
  }
};

const csvDataGet = (
  csvFilePath
) => {

  return csvtojson().fromFile(
    csvFilePath
  )
    .then(
      (
        res
      ) => {

        return (
          res
        );
      }
    );
};

const jsonFileWrite = (
  json,
  jsonFilePath
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      return fs.writeFile(
        jsonFilePath,
        JSON.stringify(
          json,
          null,
          2
        ),
        (
          error,
          res
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          return resolve(
            res
          );
        }
      );
    }
  );
};

const jsonFromCsvGet = async (
  dataFilename,
  datasetsFolderPathString
) => {

  jsonFolderCreate(
    datasetsFolderPathString
  );

  const csvFilePath = path.join(
    process.cwd(),
    datasetsFolderPathString,
    'csv',
    `
      ${
        dataFilename
      }.csv
    `
      .trim()
  );

  const json = await csvDataGet(
    csvFilePath
  );

  const jsonFilePath = path.join(
    process.cwd(),
    datasetsFolderPathString,
    'json',
    `
      ${
        dataFilename
      }.json
    `
      .trim()
  );

  await jsonFileWrite(
    json,
    jsonFilePath
  );
};

if (
  !module.parent
) {

  jsonFromCsvGet(
    'tmdb_5000_movies',
    'temp/datasets'
  );
}

export default jsonFromCsvGet;
