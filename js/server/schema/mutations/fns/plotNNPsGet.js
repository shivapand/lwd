'use strict';

import NNPsGet from './NNPsGet';
import NNPsUniqueGet from './NNPsUniqueGet';

export default (
  plot,
  uniqueFlag = false
) => {

  let plotNNPs = plot.reduce(
    (
      memo,
      sentence
    ) => {

      return [
        ...memo,
        ...NNPsGet(
          sentence.text
        )
          .map(
            (
              NNP
            ) => {

              return {
                ...NNP,
                sentenceIndex: sentence.sentenceIndex
              };
            }
          )
      ];
    },
    []
  );

  if (
    uniqueFlag
  ) {

    plotNNPs = NNPsUniqueGet(
      plotNNPs
    );
  }

  plotNNPs = plotNNPs.map(
    (
      plotNNP,
      index
    ) => {

      return {
        ...plotNNP,
        index
      };
    }
  );

  return (
    plotNNPs
  );
};
