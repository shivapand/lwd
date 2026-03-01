'use strict';

const wordBoundaryMatchFlagGet = (
  text,
  name
) => {

  const escaped = name.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  return new RegExp(
    `\\b${escaped}\\b`,
    'i'
  )
    .test(text);
};

const characterNameVariantsGet = (castMember) => {

  const variants = castMember.characterNameFull
    .split('/')
    .map((name) => name.replace(/\(.*?\)/g, '').trim())
    .filter((name) => name.length > 1);

  const firstNames = variants
    .map((name) => name.split(/\s+/)[0])
    .filter((name) => name.length > 1);

  return [...variants, ...firstNames].reduce(
    (memo, name) =>
      memo.find((m) => m.toLowerCase() === name.toLowerCase())
        ? memo
        : [...memo, name],
    []
  );
};

const plotTextJoinedGet = (plot) =>
  plot.map(({ text }) => text).join(' ');

const characterInPlotFlagGet = (nameVariants, plotJoined) =>
  !!nameVariants.find(
    (name) => wordBoundaryMatchFlagGet(plotJoined, name)
  );

export default async (
  cast,
  plot
) => {

  const plotJoined = plotTextJoinedGet(plot);

  const characters = cast.reduce(
    (memo, castMember, castIndex) => {

      const nameVariants = characterNameVariantsGet(castMember);

      return (!characterInPlotFlagGet(nameVariants, plotJoined))
        ? memo
        : [
          ...memo,
          {
            text: castMember.characterName,
            characterNameFull: castMember.characterNameFull,
            profileImage: castMember.profileImage,
            actor: castMember.actor,
            castIndex
          }
        ];
    },
    []
  );

  return characters;
};
