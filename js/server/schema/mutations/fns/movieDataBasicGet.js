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
  return `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${titleEncodedGet(title)}&prop=text&redirects=1&origin=*`;
};

const moviePageSectionTextsGetFn = (html, anchorNames) => {
  if (!html) return null;
  
  anchorNames = Array.isArray(anchorNames) ? anchorNames : [anchorNames];

  // Strategy 1: Look for the specific mw-headline ID (standard)
  for (const anchorName of anchorNames) {
    const regex = new RegExp(`<span[^>]*class="mw-headline"[^>]*id="${anchorName}"[^>]*>.*?</span>(.*?)(?:<h[2-6]|$)`, 'is');
    const match = html.match(regex);
    if (match && match[1]) return match[1].replace(/<[^>]*>?/gm, '').trim();
  }

  // Strategy 2: Look for the section title within any header tag (fallback)
  for (const anchorName of anchorNames) {
    const cleanName = anchorName.replace(/_/g, ' ');
    const regex = new RegExp(`<h[2-6][^>]*>.*?${cleanName}.*?</h[2-6]>(.*?)(?:<h[2-6]|$)`, 'is');
    const match = html.match(regex);
    if (match && match[1]) return match[1].replace(/<[^>]*>?/gm, '').trim();
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
  console.log(`movieDataBasicGet start: ${title}`);
  
  try {
    const summaryUrl = summaryQueryGet(title);
    const parseUrl = parseQueryGet(title);
    
    console.log(`Fetching summary from: ${summaryUrl}`);
    console.log(`Fetching parse from: ${parseUrl}`);

    // Fetch both the summary (for the poster) and the full parse (for plot/cast)
    const [summaryJson, parseJson] = await Promise.all([
      mediawikiFetch(summaryUrl),
      mediawikiFetch(parseUrl)
    ]);

    console.log(`Fetch complete. Summary success: ${!!summaryJson}, Parse success: ${!!parseJson}`);

    if (!parseJson || !parseJson.parse) {
      console.log("Wikipedia Parse API failed or returned no data.");
      return null;
    }

    const poster = summaryJson?.originalimage?.source || "https://via.placeholder.com/320x480?text=No+Poster";
    const html = parseJson?.parse?.text?.['*'];
    
    const castText = sectionTextCleanedGet(moviePageSectionTextsGetFn(html, ['Cast', 'Voice_cast']));
    const plotText = sectionTextCleanedGet(moviePageSectionTextsGetFn(html, ['Plot', 'Synopsis', 'Premise']));

    return processFn(title, poster, plotText, castText, plotLimit, processFlag);
  } catch (error) {
    console.log(`movieDataBasicGet error: ${error.message}`);
    return null;
  }
};
