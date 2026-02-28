'use strict';

import path from 'path';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import shelljs from 'shelljs';
import padLeft from 'pad-left';

const {
  Canvas,
  Image,
  ImageData
} = canvas;

const weightsPathString = 'utils/process/source/weights';

const weightsPath = path.join(
  process.cwd(),
  weightsPathString
);

const faceDetectionNetType = 'tinyFaceDetector';

const tinyFaceDetectorOptions = {
  inputSize: 416,
  scoreThreshold: 0.5
};

const ssdMobilenetv1Options = {
  minConfidence: 0.5,
  maxResults: 2
};

const faceWidthThreshold = 25;

const faceMatchDistanceThreshold = 0.4;

const tinyFaceDetectorWeightsLoad = async () => {

  await faceapi.nets.tinyFaceDetector.loadFromDisk(
    weightsPath
  );

  await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(
    weightsPath
  );

  return (
    null
  );
};

const ssdMobilenetv1WeightsLoad = async () => {

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(
    weightsPath
  );

  await faceapi.nets.faceLandmark68Net.loadFromDisk(
    weightsPath
  );
};

const faceDetectorWeightsLoad = () => {

  return (
    faceDetectionNetType === 'tinyFaceDetector'
  ) ?
    tinyFaceDetectorWeightsLoad() :
    ssdMobilenetv1WeightsLoad();
};

const faceapiInit = async () => {

  faceapi.env.monkeyPatch(
    {
      Canvas,
      Image,
      ImageData
    }
  );

  await faceDetectorWeightsLoad();

  await faceapi.nets.ageGenderNet.loadFromDisk(
    weightsPath
  );

  await faceapi.nets.faceRecognitionNet.loadFromDisk(
    weightsPath
  );
};

const faceDetectorOptionsGet = () => {

  const faceDetectorOptions = (
    faceDetectionNetType === 'tinyFaceDetector'
  ) ?
    new faceapi.TinyFaceDetectorOptions(
      tinyFaceDetectorOptions
    ) :
    new faceapi.SsdMobilenetv1Options(
      ssdMobilenetv1Options
    );

  return (
    faceDetectorOptions
  );
};

const detectAllFacesRun = (
  image
) => {

  const faceDetectorOptions = faceDetectorOptionsGet();

  return faceapi.detectAllFaces(
    image,
    faceDetectorOptions
  );
};

const detectSingleFaceRun = (
  image
) => {

  const faceDetectorOptions = faceDetectorOptionsGet();

  return faceapi.detectSingleFace(
    image,
    faceDetectorOptions
  );
};

const faceLandmarksGet = (
  detectionPromise
) => {

  return detectionPromise
    .withFaceLandmarks(
      (
        faceDetectionNetType === 'tinyFaceDetector'
      ) &&
        true
    );
};

const imagesGet = (
  sourceFolderPath
) => {

  return shelljs.ls(
    sourceFolderPath
  )
    .filter(
      (
        filename
      ) => {

        return (
          filename.match(
            /\.jpeg$/
          )
        );
      }
    )
    .sort(
      (
        a, b
      ) => {

        const aN = parseInt(
          a.match(
            /(\d+)/
          )[
            1
          ]
        );

        const bN = parseInt(
          b.match(
            /(\d+)/
          )[
            1
          ]
        );

        switch (
          true
        ) {

          case (
            aN > bN
          ) :

            return 1;

          case (
            bN > aN
          ) :

            return -1;
        }
      }
    );
};

const imageGet = (
  filename,
  sourceFolderPath
) => {

  return canvas.loadImage(
    path.join(
      sourceFolderPath,
      filename
    )
  );
};

const discardRunFn = async (
  filename,
  sourceFolderPath
) => {

  const image = await imageGet(
    filename,
    sourceFolderPath
  );

  const detections = await detectAllFacesRun(
    image
  );

  let detection = (
    detections.length === 1
  ) ?
    detections[
      0
    ] :
    null;

  detection = (
    detection &&
    (
      (
        detection._box._width /
        detection._imageDims._width
      ) *
      100
    ) > 
    faceWidthThreshold
  ) ?
    detection :
    null;

  if (
    detection
  ) {

    return (
      filename
    );
  }

  return (
    null
  );
};

const discardRun = (
  sourceFolderPath
) => {

  return imagesGet(
    sourceFolderPath
  )
    .reduce(
      (
        memo,
        filename
      ) => {

        return memo.then(
          (
            res
          ) => {

            return discardRunFn(
              filename,
              sourceFolderPath
            )
              .then(
                (
                  result
                ) => {

                  if (
                    result
                  ) {

                    return [
                      ...res,
                      result
                    ];
                  }

                  shelljs.mv(
                    path.join(
                      sourceFolderPath,
                      filename
                    ),
                    path.join(
                      sourceFolderPath,
                      'discard',
                      filename
                    )
                  );

                  return (
                    res
                  );
                }
              );
          }
        );
      },
      Promise.resolve(
        []
      )
    ); 
};

const filenamesFilteredGet = (
  _filenames,
  filenames
) => {

  return filenames.reduce(
    (
      memo,
      filename
    ) => {

      const exists = _filenames.find(
        (
          _filename
        ) => {

          return (
            _filename ===
            filename
          );
        }
      );

      if (
        !exists
      ) {

        return [
          ...memo,
          filename
        ];
      }

      return (
        memo
      );
    },
    []
  );
};

const __groupRunFn = async (
  faceMatcher,
  filename,
  sourceFolderPath
) => {

  const image = await imageGet(
    filename,
    sourceFolderPath
  );

  const detectionPromise = detectSingleFaceRun(
    image
  );

  const faceLandmarksPromise = faceLandmarksGet(
    detectionPromise
  );
    
  const faceDescriptor = await faceLandmarksPromise
    .withFaceDescriptor();

  const match = faceMatcher.findBestMatch(
    faceDescriptor.descriptor
  );

  return (
    match &&
    (
      match.distance <
      faceMatchDistanceThreshold 
    )
  ) ?
    true :
    false;
};

const _groupRunFn = (
  faceMatcher,
  filenames,
  sourceFolderPath
) => {

  return filenames.reduce(
    (
      memo,
      filename
    ) => {

      return memo.then(
        (
          res
        ) => {

          return __groupRunFn(
            faceMatcher,
            filename,
            sourceFolderPath
          )
            .then(
              (
                result
              ) => {

                if (
                  result
                ) {

                  return [
                    ...res,
                    filename
                  ];
                }

                return (
                  res
                );
              }
            );
        }
      );
    },
    Promise.resolve(
      []
    )
  );
};

const groupsCountGet = (
  gender,
  sourceFolderPath
) => {

  return shelljs.ls(
    sourceFolderPath
  )
    .filter(
      (
        filename
      ) => {

        return (
          filename.match(
            new RegExp(
              `
                ^${
                  gender
                }
              `
                .trim(),
              'i'
            )
          )
        );
      }
    )
    .length;
};

const filePathsGet = (
  filenames,
  sourceFolderPath
) => {

  return filenames.map(
    (
      filename
    ) => {

      return path.join(
        sourceFolderPath,
        filename
      );
    }
  );
};

const groupCreate = (
  filenames,
  _gender,
  sourceFolderPath
) => {

  const gender = (
    _gender === 'male'
  ) ?
    'man' :
    'woman';

  const count = groupsCountGet(
    gender,
    sourceFolderPath
  ) + 1;

  const countString = `
    ${
      padLeft(
        `
          ${
            count
          }
        `
          .trim(),
        2,
        '0'
      )
    }
  `
    .trim();

  const folderName = `
    ${
      gender
    }-${
      countString
    }
  `
    .trim();

  const folderPath = path.join(
    sourceFolderPath,
    folderName
  );

  shelljs.mkdir(
    folderPath
  );

  const filePaths = filePathsGet(
    filenames,
    sourceFolderPath
  );

  shelljs.mv(
    filePaths,
    folderPath
  );

  return (
    null
  );
};

const groupRunFn = async (
  filename,
  filenames,
  sourceFolderPath
) => {

  const image = await imageGet(
    filename,
    sourceFolderPath
  );

  const detectionPromise = detectSingleFaceRun(
    image
  );

  const faceLandmarksPromise = faceLandmarksGet(
    detectionPromise
  );

  const faceDescriptor = await faceLandmarksPromise
    .withFaceDescriptor();

  const faceMatcher = await new faceapi.FaceMatcher(
    faceDescriptor
  );

  let matches;

  matches = await _groupRunFn(
    faceMatcher,
    filenames,
    sourceFolderPath
  );

  matches = [
    filename,
    ...matches
  ];

  const gender = (
    await faceLandmarksPromise.withAgeAndGender()
  ).gender;

  groupCreate(
    matches,
    gender,
    sourceFolderPath
  );

  return (
    matches
  );
};

const groupRun = (
  sourceFolderPath
) => {

  const filenames = imagesGet(
    sourceFolderPath
  );

  return filenames.reduce(
    (
      memo,
      filename
    ) => {

      return memo.then(
        (
          res
        ) => {

          if (
            !res.includes(
              filename
            ) 
          ) {

            return (
              res
            );
          }

          return groupRunFn(
            filename,
            res.filter(
              (
                _filename
              ) => {

                return (
                  _filename !==
                  filename
                );
              }
            ),
            sourceFolderPath
          )
            .then(
              (
                result
              ) => {

                const _res = filenamesFilteredGet(
                  result,
                  res
                );

                return (
                  _res
                );
              }
            );
        }
      );
    },
    Promise.resolve(
      filenames
    )
  );
};

export default async (
  sourceFolderName,
  sourceFolderPathString
) => {

  const sourceFolderPath = path.join(
    process.cwd(),
    sourceFolderPathString,
    sourceFolderName
  );

  const discardFolderPath = path.join(
    sourceFolderPath,
    'discard'
  );

  shelljs.mkdir(
    discardFolderPath
  );

  await faceapiInit();

  await discardRun(
    sourceFolderPath
  );

  await groupRun(
    sourceFolderPath
  );

  shelljs.rm(
    '-rRf',
    discardFolderPath
  );
};
