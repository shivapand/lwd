'use strict';

const characterInPlotFlagGet = (castMember, plot) => {

  const lowerName = (castMember.characterName || '').toLowerCase();

  const lowerNameFull = (castMember.characterNameFull || '').toLowerCase();

  return !!plot.find(
    (sentence) =>
      sentence.tokens.find(
        (token) =>
          token.role &&
          (
            (castMember.castRole && token.role === castMember.castRole) ||
            lowerName.includes(token.text.toLowerCase()) ||
            token.text.toLowerCase().includes(lowerName) ||
            lowerNameFull.includes(token.text.toLowerCase()) ||
            token.text.toLowerCase().includes(lowerNameFull)
          )
      )
  );
};

export default async (
  cast,
  plot
) => {

  const characters = cast.reduce(
    (memo, castMember, castIndex) => {

      return (
        castIndex &&
        !castMember.castRole &&
        !characterInPlotFlagGet(castMember, plot)
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
            role: castMember.castRole || 'unknown'
          }
        ];
    },
    []
  );

  return characters;
};
