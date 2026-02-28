'use strict';

export default (
  _text
) => {

  let text = _text;

  while (
    text != (
      text = text.replace(
        /\s*\([^()]*\)(\s*)/g,
        '$1'
      )
    )
  );

  return (
    text
  );
};
