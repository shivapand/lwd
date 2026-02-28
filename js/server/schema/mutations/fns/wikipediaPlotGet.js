'use strict';

import mediawikiFetch from './mediawikiFetch';
import movieDataBasicPlotGet from './movieDataBasicPlotGet';

const PLOT_SECTION_NAMES = [
  'Plot',
  'Synopsis',
  'Premise',
  'Plot summary',
  'Story'
];

const sectionsQueryGet = (title) =>
  `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${encodeURIComponent(title)}&prop=sections&redirects=1&origin=*`;

const sectionQueryGet = (title, sectionIndex) =>
  `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${encodeURIComponent(title)}&prop=text&section=${sectionIndex}&redirects=1&origin=*`;

const plotSectionIndexGet = (sections) =>
  sections.reduce(
    (memo, section) =>
      memo ?? (
        PLOT_SECTION_NAMES.find(
          (name) => section.line.toLowerCase() === name.toLowerCase()
        )
          ? Number(section.index)
          : null
      ),
    null
  );

export default async (title, plotLimit) => {

  try {

    const sectionsJson = await mediawikiFetch(
      sectionsQueryGet(title)
    );

    const sections = sectionsJson?.parse?.sections;

    return (!sections)
      ? null
      : await (async () => {

        const sectionIndex = plotSectionIndexGet(sections);

        return (sectionIndex === null)
          ? null
          : await (async () => {

            const sectionJson = await mediawikiFetch(
              sectionQueryGet(title, sectionIndex)
            );

            const html = sectionJson?.parse?.text?.['*'];

            return (!html)
              ? null
              : movieDataBasicPlotGet(html, plotLimit);
          })();
      })();
  } catch (error) {

    console.log(
      `wikipediaPlotGet error for "${title}": ${error.message}`
    );

    return null;
  }
};
