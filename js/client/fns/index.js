'use strict';

import {
  useRef,
  useEffect
} from 'react';

const useIsMounted = (
  initialValue
) => {

  const isMounted = useRef(
    initialValue
  );

  useEffect(
    () => {

      isMounted.current = true;

      return () => {

        isMounted.current = false;
      };
    },
    []
  );

  return isMounted;
};

export {
  useIsMounted
};
