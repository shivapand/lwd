'use strict';

import {
  exec
} from 'child_process';

export default async (
  base64,
  _text,
  res,
  textPointsize,
  textBorder
) => {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      let text = _text
        .replace(
          /"/g,
          '\\"'
        )
        .replace(
          /&/g,
          '\\&amp;'
        )
        .replace(
          /\$/g,
          '\\$'
        );

      const factor = res / 480;

      const command = `
        convert 
        \\(
          jpeg:-
          -resize ${
            res
          }x${
            res
          }^
          -gravity center
          -crop ${
            res
          }x${
            res
          }+0+0
        \\)
        \\(
          -size ${
            res - (
              (
                textBorder * 2
              ) * factor
            )
          }
          -background "#000" 
          -fill "#fff" 
          -pointsize ${
            textPointsize * factor
          }
          -font "/media/fonts/Muli-Italic-VariableFont_wght.ttf"
          pango:"${
            text
          }" 
          -bordercolor "#000"
          -border ${
            textBorder * factor
          }
        \\)
        -gravity south
        -compose blend
        -define compose:args=90
        -composite
        jpeg:-
      `
        .split(
          /\s/
        )
        .reduce(
          (
            memo,
            _command
          ) => {

            return `
              ${
                memo
              } ${
                _command
              }
            `
              .trim();
          },
          ''
        );

      const _base64 = base64
        .replace(
          /^data:image\/jpeg;base64,/,
          ''
        );

      const buffer = new Buffer.from(
        _base64,
        'base64'
      );

      const proc = exec(
        command,
        {
          encoding: 'base64'
        },
        (
          error,
          stdout
        ) => {

          if (
            error
          ) {

            return reject(
              error
            );
          }

          const base64 = `
            data:image/jpeg;base64,${
              stdout
            }
          `
            .trim();

          return resolve(
            base64
          );
        }
      );

      proc.stdin.write(
        buffer
      );

      proc.stdin.end();
    }
  );
};

