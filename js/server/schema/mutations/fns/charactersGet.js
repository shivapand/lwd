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

const STOP_WORDS = ['the', 'a', 'an', 'no', 'my', 'his', 'her', 'old', 'big'];

const characterNameVariantsGet = (castMember) => {

  const variants = castMember.characterNameFull
    .split('/')
    .map((name) => name.replace(/\(.*?\)/g, '').trim())
    .filter((name) => name.length > 1);

  const firstNames = variants
    .map((name) => name.split(/\s+/)[0])
    .filter((name) => name.length > 1)
    .filter((name) => !STOP_WORDS.includes(name.toLowerCase()));

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

      return (
        castIndex &&
        !castMember.castRole &&
        !characterInPlotFlagGet(nameVariants, plotJoined)
      )
        ? memo
        : [
          ...memo,
          {
            text: castMember.characterName,
            characterNameFull: castMember.characterNameFull,
            profileImage: castMember.profileImage,
            actor: castMember.actor,
            castIndex,
            ...(castMember.castRole
              ? { role: castMember.castRole }
              : {})
          }
        ];
    },
    []
  );

  return characters;
};
