'use strict';

const fnDelay = (
  fn,
  delay
) => {

  return new Promise(
    (
      resolve
    ) => {

      return setTimeout(
        () => {

          return resolve(
            fn()
          );
        },
        delay
      );
    }
  );
};

export default (
  fn,
  delay,
  message,
  ...args
) => {

  //eslint-disable-next-line no-console
  console.log(message);

  return fnDelay(
    () => {

      return fn(
        ...args
      );
    },
    delay
  );
};
