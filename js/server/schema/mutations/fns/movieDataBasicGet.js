'use strict';

import latinize from 'latinize';
import mediawikiFetch from './mediawikiFetch';
import movieDataBasicPlotGet from './movieDataBasicPlotGet';
import movieDataBasicCastGet from './movieDataBasicCastGet';

const titleEncodedGet = (title) => encodeURIComponent(title);

const summaryQueryGet = (title) => {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${titleEncodedGet(title)}`;
};

const parseQueryGet = (title) => {
  return `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${titleEncodedGet(title)}&prop=text&origin=*`;
};

const moviePageSectionTextsGetFn = (html, anchorName) => {
  if (!html) return null;
  // Regex to find the content between the headline span and the next header
  const regex = new RegExp(`<span[^>]*class="mw-headline"[^>]*id="${anchorName}"[^>]*>.*?</span>(.*?)<h[2-6]>`, 'is');
  const match = html.match(regex);
  
  if (match && match[1]) {
      return match[1].replace(/<[^>]*>?/gm, '').trim();
  }
  return null;
};

const sectionTextCleanedGet = (sectionText) => {
  if (!sectionText) return '';
  sectionText = sectionText.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
  sectionText = latinize(sectionText);
  return sectionText.replace(/((?:[A-Z][a-z]*.?\s?)*)"([A-Za-z.]+)"((?:\s?[A-Z][a-z]*.?)*)/g, '$1$2$3');
};

const processFn = (title, poster, plotText, castText, plotLimit, processFlag) => {
  if (!plotText || !castText) {
    console.log(`Scraper warning: Missing section for ${title}. Plot: ${!!plotText}, Cast: ${!!castText}`);
    return null;
  }
  if (!processFlag) return { plotText, castText };

  let plot = movieDataBasicPlotGet(plotText, plotLimit);
  const cast = movieDataBasicCastGet(castText);

  return { title, poster, cast, plot, castText, plotText };
};

export default async (title, plotLimit, processFlag = true) => {
  console.log(`movieDataBasicGet: ${title}`);
  
  try {
    // Fetch both the summary (for the poster) and the full parse (for plot/cast)
    const [summaryJson, parseJson] = await Promise.all([
      mediawikiFetch(summaryQueryGet(title)),
      mediawikiFetch(parseQueryGet(title))
    ]);

    if (!parseJson || !parseJson.parse) {
      console.log("Wikipedia Parse API failed, aborting.");
      return null;
    }

    const poster = summaryJson?.originalimage?.source || "https://via.placeholder.com/320x480?text=No+Poster";
    const html = parseJson?.parse?.text?.['*'];
    
    const castText = sectionTextCleanedGet(moviePageSectionTextsGetFn(html, 'Cast'));
    const plotText = sectionTextCleanedGet(moviePageSectionTextsGetFn(html, 'Plot'));

    return processFn(title, poster, plotText, castText, plotLimit, processFlag);
  } catch (error) {
    console.log(`movieDataBasicGet error: ${error.message}`);
    return null;
  }
};
